"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@/lib/validations/profile";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Upload, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>(user.image || "");

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      image: user.image || "",
    },
  });

  async function onSubmit(data: UpdateProfileFormValues) {
    setIsLoading(true);

    try {
      // Create FormData for server action
      const formData = new FormData();
      if (data.name) formData.append("name", data.name);
      if (data.image) formData.append("image", data.image);

      // Call server action
      const { updateProfile } = await import("@/lib/actions/profile");
      const result = await updateProfile(formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);
      router.refresh();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Picture */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <div className="flex items-center gap-6">
                  {/* Image Preview */}
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted">
                    {uploadedImage || field.value ? (
                      <Image
                        src={uploadedImage || field.value || ""}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-muted-foreground/50" />
                    )}
                  </div>

                  {/* Upload Button */}
                  <CldUploadWidget
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                      "bookworm"
                    }
                    onSuccess={(result) => {
                      if (
                        typeof result.info === "object" &&
                        "secure_url" in result.info
                      ) {
                        const url = result.info.secure_url;
                        setUploadedImage(url);
                        field.onChange(url);
                      }
                    }}
                  >
                    {({ open }) => (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => open()}
                        disabled={isLoading}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                    )}
                  </CldUploadWidget>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email (Read-only) */}
        <div className="space-y-2">
          <FormLabel>Email</FormLabel>
          <Input value={user.email} disabled className="bg-muted" />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed
          </p>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
