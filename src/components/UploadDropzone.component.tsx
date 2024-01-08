'use client';

import { Cloud, File, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Dropzone from 'react-dropzone';

import { trpc } from '@/app/_trpc/client';
import { Progress } from '@/components/ui/Progress.component';
import { useToast } from '@/hooks/use-toast.hook';
import { useUploadThing } from '@/lib/uploadthing';

type UploadDropzoneProps = {
  isSubscribed: boolean;
};

const UploadDropzone = ({ isSubscribed }: UploadDropzoneProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const router = useRouter();
  const { toast } = useToast();
  const { startUpload } = useUploadThing(
    isSubscribed ? 'proPlanUploader' : 'freePlanUploader',
  );

  const { mutate: startPolling } = trpc.file.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        } else {
          return prevProgress + 5;
        }
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);
        const progressInterval = startSimulatedProgress();
        const res = await startUpload(acceptedFile);

        if (!res) {
          return toast({
            title: 'Something went wrong',
            description: 'Please try again later',
            variant: 'destructive',
          });
        }

        const { key } = res[0];

        if (!key) {
          return toast({
            title: 'Something went wrong',
            description: 'Please try again later',
            variant: 'destructive',
          });
        }

        clearInterval(progressInterval);
        setUploadProgress(100);
        startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className='border h-64 m-4 border-dashed border-gray-300 rounded-lg'
        >
          <div className='flex items-center justify-center h-full w-full'>
            <label
              htmlFor='dropzone-file'
              className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'
            >
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <Cloud className='h-6 w-6 text-zinc-500 mb-2' />
                <p className='mb-2 text-sm text-zinc-700'>
                  <span className='font-semibold'>Click to upload</span> or drag
                  and drop.
                </p>
                <p className='text-xs text-zinc-500'>
                  PDF (up to {isSubscribed ? '16MB' : '4MB'})
                </p>
              </div>

              {acceptedFiles && acceptedFiles[0] && (
                <div className='max-w-xs bg-white flex items-center rouned-md overflow-hidden outline-[1px] outline-zinc-200 divide-x divide-zinc-200'>
                  <div className='px-3 py-2 h-full grid place-items-center'>
                    <File className='h-4 w-4 text-blue-500' />
                  </div>
                  <div className='px-3 py-2 h-full text-sm truncate'>
                    {acceptedFiles[0].name}
                  </div>
                </div>
              )}
              {isUploading && (
                <div className='w-full mt-4 max-w-xs mx-auto'>
                  <Progress
                    value={uploadProgress}
                    className='h-1 w-full bg-zinc-200'
                  />
                  {uploadProgress === 100 && (
                    <div className='flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2'>
                      <Loader2 className='h-3 w-3 animate-spin' />
                      Redirecting...
                    </div>
                  )}
                </div>
              )}
              <input
                {...getInputProps()}
                type='file'
                id='dropzone-file'
                className='hidden'
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default UploadDropzone;