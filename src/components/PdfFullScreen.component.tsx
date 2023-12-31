'use client';

import { Expand, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';
import SimpleBar from 'simplebar-react';

import { Button } from '@/components/ui/Button.component';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/Dialog.component';
import { useToast } from '@/hooks/use-toast.hook';

type PdfFullScreenProps = {
  fileURL: string;
};

const PdfFullScreen = ({ fileURL }: PdfFullScreenProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const { width, ref } = useResizeDetector();
  const { toast } = useToast();

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button aria-label='fullscreen' variant='ghost' className='gap-1.5'>
          <Expand className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-7xl w-full'>
        <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)] mt-6'>
          <div ref={ref}>
            <Document
              loading={
                <div className='flex justify-center'>
                  <Loader2 className='my-24 h-6 w-6 animate-spin' />
                </div>
              }
              onLoadSuccess={({ numPages }) => {
                setNumberOfPages(numPages);
              }}
              onLoadError={() => {
                toast({
                  title: 'Error loading PDF',
                  description: 'Please try again later.',
                  variant: 'destructive',
                });
              }}
              file={fileURL}
              className='max-h-full'
            >
              {new Array(numberOfPages).fill(0).map((_, index) => (
                <Page
                  width={width ? width : 1}
                  pageNumber={index + 1}
                  key={index}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullScreen;
