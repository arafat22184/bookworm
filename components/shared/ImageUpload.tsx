"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";

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
  value,
}: ImageUploadProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUpload = (result: any) => {
    if (result.info && result.info.secure_url) {
      onChange(result.info.secure_url);
    }
  };

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!uploadPreset) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-destructive/50 rounded-md bg-destructive/5 text-destructive gap-2 text-center">
        <div className="font-bold">Missing Configuration</div>
        <div className="text-sm text-muted-foreground">
          Please add{" "}
          <code className="bg-muted px-1 py-0.5 rounded">
            NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
          </code>{" "}
          to your .env.local file.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[300px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="object-cover w-full h-full" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget uploadPreset={uploadPreset} onSuccess={onUpload}>
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
