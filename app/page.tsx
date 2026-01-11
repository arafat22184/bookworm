import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  BookOpen, 
  Compass, 
  Heart, 
  Library, 
  Star, 
  Trophy, 
  Users, 
  CheckCircle2,
  Quote,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { getCurrentUser } from '@/lib/session';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. Navbar */}
      <header className="fixed w-full z-50 bg-background/90 backdrop-blur-md border-b">
        <div className="w-11/12 max-w-7xl mx-auto h-16 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight">BookWorm</span>
           </div>
           <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
              <a href="#testimonials" className="hover:text-foreground transition-colors">Stories</a>
              <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
           </nav>
           <div className="flex gap-4">
              <Link href="/login">
                <Button variant="ghost" className="font-medium">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="font-medium shadow-lg shadow-primary/20">Get Started</Button>
              </Link>
           </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        
        {/* 2. Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 z-0 select-none">
             <img 
               src="/hero-library.png" 
               alt="Cozy Library" 
               className="w-full h-full object-cover opacity-30 animate-in fade-in duration-1000"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
           </div>

           <div className="relative z-10 w-11/12 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
             <div className="space-y-8 animate-in slide-in-from-left-6 duration-700 fade-in fill-mode-backwards delay-200">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                   <Star className="h-3.5 w-3.5 fill-current" />
                   <span>The #1 Reading Tracker App</span>
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold leading-[1.1] tracking-tight">
                  Curate Your <span className="text-primary relative inline-block">
                    Literary Life
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Stop forgetting what you read. Track your progress, discover tailored recommendations, and join a community of passionate readers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                   <Link href="/register">
                      <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-primary/25 transition-transform hover:scale-105">
                        Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                   </Link>
                   <Link href="#how-it-works">
                      <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-background/50 backdrop-blur-sm border-2">
                        How It Works
                      </Button>
                   </Link>
                </div>
                <div className="pt-8 flex items-center gap-8 text-sm text-muted-foreground/80">
                   <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Free Forever</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>No Ads</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Privacy Focused</span>
                   </div>
                </div>
             </div>
           </div>
        </section>

        {/* 3. Social Proof / Stats */}
        <section className="py-12 border-y bg-muted/30">
           <div className="w-11/12 max-w-7xl mx-auto">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <StatItem label="Active Readers" value="10k+" />
                <StatItem label="Books Tracked" value="500k+" />
                <StatItem label="Reviews Written" value="250k+" />
                <StatItem label="Reading Goals Met" value="92%" />
             </div>
           </div>
        </section>

        {/* 4. Features Grid */}
        <section id="features" className="py-24 relative overflow-hidden">
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="w-11/12 max-w-7xl mx-auto space-y-16">
               <div className="text-center space-y-4 max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-5xl font-serif font-bold">Everything you need to read more</h2>
                  <p className="text-lg text-muted-foreground">Comprehensive tools designed to help you build a reading habit that sticks.</p>
               </div>

               <div className="grid md:grid-cols-3 gap-8">
                  <FeatureCard 
                     icon={<Library className="h-8 w-8 text-primary" />}
                     title="Virtual Shelves"
                     description="Organize your books into 'Want to Read', 'Currently Reading', and 'Read'. Custom shelves coming soon."
                  />
                  <FeatureCard 
                     icon={<TrendingUp className="h-8 w-8 text-primary" />}
                     title="Insightful Stats"
                     description="Visualize your reading habits with beautiful charts. Track pages read, genres, and monthly progress."
                  />
                  <FeatureCard 
                     icon={<BookOpen className="h-8 w-8 text-primary" />}
                     title="Smart Discovery"
                     description="Get personalized recommendations based on your reading history and favorite genres."
                  />
                  <FeatureCard 
                     icon={<Trophy className="h-8 w-8 text-primary" />}
                     title="Reading Challenges"
                     description="Set annual goals and track your streak. Gamify your reading to stay motivated."
                  />
                  <FeatureCard 
                     icon={<Users className="h-8 w-8 text-primary" />}
                     title="Community Reviews"
                     description="Share your thoughts and see what others are saying. Join discussions on your favorite titles."
                  />
                  <FeatureCard 
                     icon={<Compass className="h-8 w-8 text-primary" />}
                     title="Curated Lists"
                     description="Browse hand-picked collections by our editorial team and top community members."
                  />
               </div>
            </div>
        </section>

        {/* 5. How It Works (Steps) */}
        <section id="how-it-works" className="py-24 bg-card border-y">
           <div className="w-11/12 max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-16 items-center">
                 <div className="lg:w-1/2 space-y-8">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
                       Your journey from <br/>
                       <span className="text-muted-foreground">"What should I read?"</span> to <br/>
                       <span className="text-primary">"I loved that book!"</span>
                    </h2>
                    <div className="space-y-8">
                       <StepItem 
                          number="01" 
                          title="Create your Profile" 
                          text="Sign up in seconds and select your favorite genres to jumpstart recommendations." 
                       />
                       <StepItem 
                          number="02" 
                          title="Build your Library" 
                          text="Add books you've read or want to read. Populate your virtual shelves." 
                       />
                       <StepItem 
                          number="03" 
                          title="Track & Discover" 
                          text="Log your progress as you read. Receive tailored suggestions for your next adventure." 
                       />
                    </div>
                 </div>
                 <div className="lg:w-1/2 relative">
                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8 rotate-3 transition-transform hover:rotate-0 duration-500">
                       <img src="/empty-state.png" alt="App Preview" className="w-full h-full object-contain shadow-2xl rounded-xl bg-background border" />
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 6. Testimonials */}
        <section id="testimonials" className="py-24 overflow-hidden">
           <div className="w-11/12 max-w-7xl mx-auto space-y-16">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-center">Loved by Readers</h2>
              <div className="grid md:grid-cols-3 gap-8">
                 <TestimonialCard 
                    quote="BookWorm completely changed how I track my reading. The challenge feature pushes me to read one more chapter every night."
                    author="Sarah J."
                    role="Fiction Addict"
                 />
                 <TestimonialCard 
                    quote="Finally, a reading app that looks beautiful and doesn't feel cluttered. I appreciate the focus on the books."
                    author="Michael C."
                    role="History Buff"
                 />
                 <TestimonialCard 
                    quote="The recommendations are spot on. I've discovered three of my new favorite authors this month alone."
                    author="Jessica L."
                    role="Sci-Fi Fan"
                 />
              </div>
           </div>
        </section>

        {/* 7. FAQ */}
        <section id="faq" className="py-24 bg-muted/30">
           <div className="w-11/12 max-w-3xl mx-auto space-y-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-center">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                 <AccordionItem value="item-1">
                    <AccordionTrigger>Is BookWorm really free?</AccordionTrigger>
                    <AccordionContent>
                       Yes! BookWorm is completely free to use. We believe reading tools should be accessible to everyone.
                    </AccordionContent>
                 </AccordionItem>
                 <AccordionItem value="item-2">
                    <AccordionTrigger>Can I import my library from other apps?</AccordionTrigger>
                    <AccordionContent>
                       Currently, we are working on an import feature. Stay tuned for updates!
                    </AccordionContent>
                 </AccordionItem>
                 <AccordionItem value="item-3">
                    <AccordionTrigger>How are recommendations calculated?</AccordionTrigger>
                    <AccordionContent>
                       We analyze the genres of books you've rated highly and suggest similar titles from our extensive database.
                    </AccordionContent>
                 </AccordionItem>
                 <AccordionItem value="item-4">
                    <AccordionTrigger>Is there a mobile app?</AccordionTrigger>
                    <AccordionContent>
                       BookWorm is a fully responsive web application that works great on any mobile device browser.
                    </AccordionContent>
                 </AccordionItem>
              </Accordion>
           </div>
        </section>

        {/* 8. CTA / Final Footer */}
        <section className="py-32 bg-primary/5 border-t">
           <div className="w-11/12 max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-6xl font-serif font-bold">Ready to start your chapter?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                 Join thousands of readers who are building their dream library today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                 <Link href="/register">
                    <Button size="lg" className="h-14 px-12 text-lg shadow-xl shadow-primary/25">
                       Get Started for Free
                    </Button>
                 </Link>
              </div>
           </div>
        </section>

      </main>

      <footer className="bg-background border-t py-12">
         <div className="w-11/12 max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1 space-y-4">
               <div className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span className="font-serif font-bold text-xl">BookWorm</span>
               </div>
               <p className="text-sm text-muted-foreground">
                  Your digital sanctuary for all things books. Read, track, and discover.
               </p>
            </div>
            <div>
               <h4 className="font-bold mb-4">Product</h4>
               <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="#features">Features</Link></li>
                  <li><Link href="#pricing">Pricing</Link></li>
                  <li><Link href="#faq">FAQ</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold mb-4">Company</h4>
               <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/about">About</Link></li>
                  <li><Link href="/blog">Blog</Link></li>
                  <li><Link href="/careers">Careers</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold mb-4">Legal</h4>
               <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/privacy">Privacy</Link></li>
                  <li><Link href="/terms">Terms</Link></li>
               </ul>
            </div>
         </div>
         <div className="w-11/12 max-w-7xl mx-auto mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BookWorm Inc. All rights reserved.
         </div>
      </footer>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-2">
            <div className="text-4xl font-serif font-bold text-primary">{value}</div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
   return (
       <div className="group p-8 rounded-2xl bg-card border hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1">
           <div className="mb-6 p-4 bg-primary/5 rounded-2xl w-fit group-hover:bg-primary/10 transition-colors">
               {icon}
           </div>
           <h3 className="font-bold text-xl mb-3 font-serif">{title}</h3>
           <p className="text-muted-foreground leading-relaxed">{description}</p>
       </div>
   );
}

function StepItem({ number, title, text }: { number: string, title: string, text: string }) {
    return (
        <div className="flex gap-6">
            <div className="font-serif text-4xl font-bold text-primary/20">{number}</div>
            <div className="space-y-2">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{text}</p>
            </div>
        </div>
    );
}

function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
    return (
        <div className="p-8 rounded-2xl bg-muted/30 border space-y-6">
            <Quote className="h-8 w-8 text-primary/30" />
            <p className="text-lg italic text-muted-foreground">"{quote}"</p>
            <div>
                <div className="font-bold">{author}</div>
                <div className="text-sm text-muted-foreground">{role}</div>
            </div>
        </div>
    );
}
