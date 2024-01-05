'use client';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';
import Simplebar from 'simplebar-react';
import { z } from 'zod';

import PdfFullScreen from '@/components/PdfFullScreen';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type PDFRendererProps = {
  fileURL: string;
};

const PDFRenderer = ({ fileURL }: PDFRendererProps) => {
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numberOfPages),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: '1',
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const handleNextPage = () => {
    setCurrentPage((prev) =>
      prev + 1 > numberOfPages ? numberOfPages : prev + 1,
    );
    setValue('page', String(currentPage + 1));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
    setValue('page', String(currentPage - 1));
  };

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrentPage(Number(page));
    setValue('page', String(page));
  };

  return (
    <div className='w-full bg-white rounded-md shadow flex flex-col items-center'>
      <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
        <div className='flex items-center gap-1.5'>
          <Button
            disabled={currentPage <= 1}
            aria-label='previous page'
            variant='ghost'
            onClick={handlePreviousPage}
          >
            <ChevronDown className='h-4 w-4' />
          </Button>
          <div className='flex items-center gap-1.5'>
            <Input
              {...register('page')}
              className={cn(
                'w-12 h-8',
                errors.page && 'focus-visible:ring-red-500',
              )}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className='text-zinc-700 text-sm space-x-1'>
              <span>/</span>
              <span>{numberOfPages}</span>
            </p>
          </div>
          <Button
            disabled={
              numberOfPages === undefined || currentPage === numberOfPages
            }
            aria-label='next page'
            variant='ghost'
            onClick={handleNextPage}
          >
            <ChevronUp className='h-4 w-4' />
          </Button>
        </div>

        <div className='space-x-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='gap-1.5' variant='ghost' aria-label='zoom'>
                <Search className='h-4 w-4' />
                {scale * 100}%<ChevronDown className='h-3 w-3 opacity-50' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant='ghost'
            aria-label='rotate 90 deg'
            onClick={() => setRotation((prev) => prev + 90)}
          >
            <RotateCw className='h-4 w-4' />
          </Button>
          <PdfFullScreen fileURL={fileURL} />
        </div>
      </div>

      <div className='flex-1 w-full max-h-screen'>
        <Simplebar autoHide={false} className='max-h-[calc(100vh-10rem)]'>
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
              <Page
                width={width ? width : 1}
                pageNumber={currentPage}
                scale={scale}
                rotate={rotation}
              />
            </Document>
          </div>
        </Simplebar>
      </div>
    </div>
  );
};

export default PDFRenderer;
