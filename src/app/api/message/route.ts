import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { NextRequest } from 'next/server';

import { db } from '@/db';
import { openai } from '@/lib/openai';
import { pinecone } from '@/lib/pinecone';
import { SendMessageValidator } from '@/lib/validators/sendMessage.validator';
import { getLoddedInUser } from '@/queries/user.query';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { user } = await getLoddedInUser();

  if (!user || !user.id) {
    return new Response('UNAUTHORIZED', { status: 401 });
  }

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) {
    return new Response('NOT FOUND', { status: 404 });
  }

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId: user.id,
      fileId,
    },
  });

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  const index = pinecone.Index('quill');

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    namespace: file.id,
  });

  const results = await vectorStore.similaritySearch(message, 4);

  const previousMessage = await db.message.findMany({
    where: {
      fileId,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 6,
  });

  const formattedMessages = previousMessage.map((message) => ({
    role: message.isUserMessage ? ('user' as const) : ('assistant' as const),
    content: message.text,
  }));

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    stream: true,
    messages: [
      {
        role: 'system',
        content:
          'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
      },
      {
        role: 'user',
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
          
    \n----------------\n
    
    PREVIOUS CONVERSATION:
    ${formattedMessages.map((message) => {
      if (message.role === 'user') return `User: ${message.content}\n`;
      return `Assistant: ${message.content}\n`;
    })}
    
    \n----------------\n
    
    CONTEXT:
    ${results.map((r) => r.pageContent).join('\n\n')}
    
    USER INPUT: ${message}`,
      },
    ],
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          fileId,
          userId: user.id,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
};
