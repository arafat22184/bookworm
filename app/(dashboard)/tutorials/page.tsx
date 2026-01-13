import connectToDatabase from "@/lib/db";
import Tutorial from "@/lib/models/Tutorial";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

export const revalidate = 3600; // Revalidate every hour
// Removed force-static to prevent auth issues

export default async function TutorialsPage() {
  await connectToDatabase();
  const rawTutorials = await Tutorial.find().sort({ createdAt: -1 });
  const tutorials = serialize(rawTutorials);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Tutorials</h1>
        <p className="text-muted-foreground">
          Learn how to make the most of BookWorm.
        </p>
      </div>

      <div className="grid gap-4 lg:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {tutorials.map((tutorial: any) => (
          <Card key={tutorial._id} className="overflow-hidden pt-0">
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={tutorial.videoUrl.replace("watch?v=", "embed/")}
                title={tutorial.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{tutorial.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {tutorial.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
        {tutorials.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            No tutorials available yet.
          </p>
        )}
      </div>
    </div>
  );
}
