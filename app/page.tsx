import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Compass, Heart } from 'lucide-react';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  const user = await getCurrentUser();
  if (user) redirect('/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 h-16 flex items-center justify-between border-b backdrop-blur-sm bg-background/80 fixed w-full z-50">
        <div className="flex items-center gap-2">
           <BookOpen className="h-6 w-6 text-primary" />
           <span className="font-serif font-bold text-xl">BookWorm</span>
        </div>
        <div className="flex gap-4">
           <Link href="/login">
             <Button variant="ghost">Login</Button>
           </Link>
           <Link href="/register">
             <Button>Get Started</Button>
           </Link>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 z-0">
             <img 
               src="/hero-library.png" 
               alt="Cozy Library" 
               className="w-full h-full object-cover opacity-90"
             />
             <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
             <div className="absolute inset-0 bg-linear-to-r from-background via-transparent to-transparent" />
           </div>

           <div className="relative z-10 container px-4 md:px-6">
             <div className="max-w-2xl space-y-6">
                <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                  Your Personal Literary <span className="text-primary">Sanctuary</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Track your reading journey, discover your next favorite book, and build the digital library you've always dreamed of.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                   <Link href="/register">
                      <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8">
                        Start Tracking <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                   </Link>
                </div>
             </div>
           </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/50">
           <div className="container px-4 md:px-6">
              <div className="text-center mb-16 space-y-4">
                 <h2 className="text-3xl font-serif font-bold">Why BookWorm?</h2>
                 <p className="text-muted-foreground max-w-lg mx-auto">
                    More than just a list. It's a home for your reading life.
                 </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                 <FeatureCard 
                    icon={<Compass className="h-10 w-10 text-primary" />}
                    title="Discover"
                    description="Find books tailored to your taste with our curated browse section."
                 />
                 <FeatureCard 
                    icon={<BookOpen className="h-10 w-10 text-primary" />}
                    title="Track"
                    description="Organize your reading into shelves: Want to Read, Reading, and Read."
                 />
                 <FeatureCard 
                    icon={<Heart className="h-10 w-10 text-primary" />}
                    title="Love"
                    description="Rate and review books, and keep track of your favorites forever."
                 />
              </div>
           </div>
        </section>
      </main>

      <footer className="py-6 border-t text-center text-sm text-muted-foreground">
         &copy; {new Date().getFullYear()} BookWorm. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
            <div className="mb-4 p-3 bg-primary/10 rounded-full">
                {icon}
            </div>
            <h3 className="font-bold text-xl mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
