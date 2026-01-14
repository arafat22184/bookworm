"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().min(10, "Description needs to be longer"),
  coverImage: z.string().min(1, "Cover image is required"),
  genres: z.array(z.string()).min(1, "Select at least one genre"),
});

export type BookFormValues = z.infer<typeof bookSchema>;

interface BookFormProps {
  initialData?: BookFormValues;
  onSubmit: (data: BookFormValues) => Promise<void>;
  submitLabel?: string;
}

export function BookForm({
  initialData,
  onSubmit,
  submitLabel = "Create Book",
}: BookFormProps) {
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<Array<{ _id: string; name: string }>>(
    []
  );

  useEffect(() => {
    fetch("/api/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data.data.genres))
      .catch((err) => console.error(err));
  }, []);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: initialData || {
      title: "",
      author: "",
      description: "",
      coverImage: "",
      genres: [],
    },
  });

  const handleSubmit = async (data: BookFormValues) => {
    setLoading(true);
    try {
      await onSubmit(data);
      form.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value ? [field.value] : []}
                  onChange={(url) => field.onChange(url)}
                  onRemove={() => field.onChange("")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Book Title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Author Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  disabled={loading}
                  placeholder="Book description..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="genres"
          render={() => (
            <FormItem>
              <FormLabel>Genres</FormLabel>
              <ScrollArea
                className="h-36 w-full rounded-md border p-4"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <div className="flex flex-wrap gap-4">
                  {genres.map((genre) => (
                    <FormField
                      key={genre._id}
                      control={form.control}
                      name="genres"
                      render={({ field }) => (
                        <FormItem
                          key={genre._id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(genre._id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, genre._id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== genre._id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {genre.name}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </ScrollArea>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button disabled={loading} type="submit">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
