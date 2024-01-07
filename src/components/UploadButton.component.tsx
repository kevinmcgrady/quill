'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button.component';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/Dialog.component';
import UploadDropzone from '@/components/UploadDropzone.component';

type UploadButtonProps = {
  isSubscribed: boolean;
};

const UploadButton = ({ isSubscribed }: UploadButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOnChange = (visible: boolean) => {
    if (!visible) {
      setIsOpen(visible);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOnChange}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>
        <UploadDropzone isSubscribed={isSubscribed} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
