"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { DeleteTutorialDialog } from "@/components/admin/DeleteTutorialDialog";

export default function AdminTutorialsPage() {
  // const router = useRouter();
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/tutorials")
      .then((res) => res.json())
      .then((data) => setTutorials(data.data.tutorials));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/tutorials", {
        method: "POST",
        body: JSON.stringify({ title, videoUrl }),
      });
      if (res.ok) {
        toast.success("Tutorial added");
        setTitle("");
        setVideoUrl("");
        // Refresh list
        const newT = await res.json();
        setTutorials([newT.data.tutorial, ...tutorials]);
      }
    } catch {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Manage Tutorials</h1>

      <Card className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(_e) => setTitle(_e.target.value)}
              placeholder="Tutorial Title"
              required
            />
          </div>
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">YouTube URL</label>
            <Input
              value={videoUrl}
              onChange={(_e) => setVideoUrl(_e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </form>
      </Card>

      <div className="grid gap-4 lg:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tutorials.map((t) => (
          <Card key={t._id} className="overflow-hidden flex flex-col pt-0">
            <div className="aspect-video w-full relative group">
              <iframe
                width="100%"
                height="100%"
                src={t.videoUrl.replace("watch?v=", "embed/")}
                title={t.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DeleteTutorialDialog
                  tutorialId={t._id}
                  tutorialTitle={t.title}
                  onDelete={() =>
                    setTutorials(tutorials.filter((x) => x._id !== t._id))
                  }
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold line-clamp-1">{t.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {t.videoUrl}
              </p>
            </div>
          </Card>
        ))}
        {tutorials.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            No tutorials added yet.
          </p>
        )}
      </div>
    </div>
  );
}
