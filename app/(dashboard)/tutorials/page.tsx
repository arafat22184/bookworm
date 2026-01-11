import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Tutorial from '@/lib/models/Tutorial';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

export default async function TutorialsPage() {
  await connectToDatabase();
  const rawTutorials = await Tutorial.find().sort({ createdAt: -1 });
  const tutorials = serialize(rawTutorials);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Tutorials</h1>
        <p className="text-muted-foreground">Learn how to make the most of BookWorm.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tutorials.map((tutorial: any) => (
          <Card key={tutorial._id} className="overflow-hidden">
            <div className="aspect-video w-full">
              <iframe 
                width="100%" 
                height="100%" 
                src={tutorial.videoUrl.replace('watch?v=', 'embed/')} 
                title={tutorial.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-1">{tutorial.title}</CardTitle>
              <CardDescription className="line-clamp-2">{tutorial.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
        {tutorials.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">No tutorials available yet.</p>
        )}
      </div>
    </div>
  );
}
