import { Send } from 'lucide-react';
import { KeyboardEvent,useContext, useRef  } from 'react';

import { Button } from '@/components/ui/Button.component';
import { Textarea } from '@/components/ui/Textarea.component';

import { ChatContext } from '../../context/ChatContext.context';

type ChatInputProps = {
  isDisabled?: boolean;
};

const ChatInput = ({ isDisabled }: ChatInputProps) => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addMessage();
      textAreaRef.current?.focus();
    }
  };

  const handleSubmit = () => {
    addMessage();
    textAreaRef.current?.focus();
  };

  return (
    <div className='absolute bottom-0 left-0 w-full'>
      <div className='mx-2 flex flex-row gap-3 md:mx-4 md:lastr:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl'>
        <div className='relative flex h-full flex-1 items-stretch md:flex-col'>
          <div className='relative flex flex-col w-full flex-grow p-4'>
            <div className='relative'>
              <Textarea
                ref={textAreaRef}
                placeholder='Enter your question...'
                rows={1}
                maxRows={4}
                autoFocus
                onChange={handleInputChange}
                value={message}
                onKeyDown={handleKeyDown}
                className='resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
              />
              <Button
                disabled={isLoading || isDisabled}
                className='absolute bottom-1.5 right-[8px]'
                aria-label='send message'
                onClick={handleSubmit}
              >
                <Send className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
