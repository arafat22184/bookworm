'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash } from 'lucide-react';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

export function ImageUpload({
  disabled,
  onChange,
  onRemove,
  value
}: ImageUploadProps) {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[300px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="object-cover w-full h-full" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget 
        uploadPreset="bookworm_preset" // User needs to configure this preset effectively or "unsigned" if allowed
        // Usually presets are needed. For now assume "ml_default" or similar standard
        // But prompt says "User provide...". I'll use a generic preset or assume environment variable/config.
        // Actually, we can pass options.
        // But for strictly "next-cloudinary" valid usage, we need a preset.
        // We can try to use signed uploads but that requires backend sig.
        // Simplest is Unsigned.
        // I'll assume the user has an unsigned preset or they created one.
        // I'll call it `bookworm_uploads` and document it.
        onSuccess={onUpload}
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button 
              type="button" 
              disabled={disabled} 
              variant="secondary" 
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload Cover Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
