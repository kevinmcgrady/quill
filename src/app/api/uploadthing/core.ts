import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

import { PLANS } from '@/config/stripe';
import { db } from '@/db';
import { pinecone } from '@/lib/pinecone';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { getLoddedInUser } from '@/queries/user.query';

const f = createUploadthing();

const middleware = async () => {
  const { user } = await getLoddedInUser();

  if (!user || !user.id) {
    throw new Error('unauthorized');
  }

  const subscriptionPlan = await getUserSubscriptionPlan();

  return { userId: user.id, subscriptionPlan };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  const doesFileExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  });

  if (doesFileExist) return;

  const createdFile = await db.file.create({
    data: {
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
      uploadStatus: 'PROCESSING',
    },
  });

  try {
    const response = await fetch(
      `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
    );
    const blob = await response.blob();
    const loader = new PDFLoader(blob);

    const pageLevelDocs = await loader.load();
    const pageAmount = pageLevelDocs.length;
    const { subscriptionPlan } = metadata;
    const { isSubscribed } = subscriptionPlan;
    const isProExceeded = pageAmount > PLANS.pro.pagesPerPdf;
    const isFreeExceeded = pageAmount > PLANS.free.pagesPerPdf;

    if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      await db.file.update({
        data: {
          uploadStatus: 'FAILED',
        },
        where: {
          id: createdFile.id,
        },
      });
    }

    const index = pinecone.Index('quill');

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex: index,
      namespace: createdFile.id,
    });

    await db.file.update({
      data: {
        uploadStatus: 'SUCCESS',
      },
      where: {
        id: createdFile.id,
      },
    });
  } catch (error) {
    await db.file.update({
      data: {
        uploadStatus: 'FAILED',
      },
      where: {
        id: createdFile.id,
      },
    });
  }
};

export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: '16MB' } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
