import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Shelf from '@/lib/models/Shelf';
import Book from '@/lib/models/Book';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookCard } from '@/components/shared/BookCard';

// Helper to serialize Mongoose documents
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

export default async function MyLibraryPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  await connectToDatabase();
  
  // Ensure Book model is registered
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = Book;

  const rawShelves = await Shelf.find({ user: user.id })
    .populate('book')
    .sort({ updatedAt: -1 })
    .lean();
    
  // Serialize for passing to potential Client Components (or just to be safe with Date objects)
  const shelves = serialize(rawShelves);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wantToRead = shelves.filter((s: any) => s.status === 'want-to-read');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentlyReading = shelves.filter((s: any) => s.status === 'currently-reading');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const read = shelves.filter((s: any) => s.status === 'read');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">My Library</h1>
        <p className="text-muted-foreground">Manage your reading collection.</p>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="current">Reading ({currentlyReading.length})</TabsTrigger>
          <TabsTrigger value="want">Want to Read ({wantToRead.length})</TabsTrigger>
          <TabsTrigger value="read">Read ({read.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="mt-6">
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
             {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
             {currentlyReading.map((entry: any) => (
               <BookCard 
                  key={entry._id} 
                  book={entry.book} 
                  progress={entry.progress} 
                  status="currently-reading"
               />
             ))}
             {currentlyReading.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                    No books currently being read. Time to start one!
                </div>
             )}
           </div>
        </TabsContent>
        
        <TabsContent value="want" className="mt-6">
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
             {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
             {wantToRead.map((entry: any) => (
               <BookCard 
                  key={entry._id} 
                  book={entry.book} 
                  status="want-to-read"
               />
             ))}
             {wantToRead.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                    Your reading list is empty. Browse books to add some!
                </div>
             )}
           </div>
        </TabsContent>

        <TabsContent value="read" className="mt-6">
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
             {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
             {read.map((entry: any) => (
               <BookCard 
                  key={entry._id} 
                  book={entry.book} 
                  status="read"
               />
             ))}
             {read.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                    You haven&apos;t finished any books yet. Keep reading!
                </div>
             )}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
