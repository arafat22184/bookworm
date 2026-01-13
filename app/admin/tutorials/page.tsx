"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminTutorialsPage() {
  // const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      <div className="grid gap-4">
        {tutorials.map((t) => (
          <div
            key={t._id}
            className="flex items-center justify-between p-4 border rounded-md"
          >
            <div>
              <p className="font-bold">{t.title}</p>
              <p className="text-sm text-muted-foreground">{t.videoUrl}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                if (!confirm("Are you sure?")) return;
                try {
                  const res = await fetch(`/api/tutorials?id=${t._id}`, {
                    method: "DELETE",
                  });
                  if (res.ok) {
                    toast.success("Tutorial deleted");
                    setTutorials(tutorials.filter((x) => x._id !== t._id));
                  } else {
                    toast.error("Failed to delete");
                  }
                } catch {
                  toast.error("Error deleting tutorial");
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
