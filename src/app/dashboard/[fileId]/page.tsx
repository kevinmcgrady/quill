import { notFound, redirect } from 'next/navigation';

import ChatWrapper from '@/components/chat/ChatWrapper.component';
import PDFRenderer from '@/components/PdfRenderer.component';
import { db } from '@/db';
import { getLoddedInUser } from '@/queries/user.query';

type PageProps = {
  params: {
    fileId: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { fileId } = params;
  const { user } = await getLoddedInUser();

  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileId}`);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) {
    notFound();
  }

  return (
    <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'>
      <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
        <div className='flex-1 xl:flex'>
          <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
            <PDFRenderer fileURL={file.url} />
          </div>
        </div>

        <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
          <ChatWrapper fileId={file.id} />
        </div>
      </div>
    </div>
  );
}
