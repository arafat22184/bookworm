'use client';

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
  HelpCircle,
  Sparkles,
  Zap,
  Bookmark
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem, TextReveal, ScaleOnHover } from '@/components/ui/motion';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function LandingPage() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-primary/20 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 z-[-1] opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url(/pattern.png)', backgroundSize: '300px' }} />

      {/* 1. Navbar (Glassmorphism) */}
      <header className="fixed w-full z-50 bg-background/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="w-11/12 max-w-7xl mx-auto h-20 flex items-center justify-between">
           <Link href="/" className="flex items-center gap-3 group cursor-pointer" aria-label="BookWorm Home">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="p-2.5 bg-linear-to-br from-primary to-secondary rounded-xl shadow-lg"
              >
                <BookOpen className="h-6 w-6 text-white" />
              </motion.div>
              <span className="font-serif font-bold text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">BookWorm</span>
           </Link>
           <nav className="hidden md:flex gap-10 text-sm font-medium text-muted-foreground/80">
              {['Features', 'How it Works', 'Stories', 'FAQ'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary transition-colors hover:underline decoration-2 decoration-secondary underline-offset-4">{item}</a>
              ))}
           </nav>
           <div className="flex gap-4">
              <Link href="/login">
                <Button variant="ghost" className="font-medium hover:bg-primary/5 hover:text-primary">Sign In</Button>
              </Link>
              <Link href="/register">
                <ScaleOnHover>
                    <Button className="font-medium shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all rounded-full px-6">Get Started</Button>
                </ScaleOnHover>
              </Link>
           </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        
        {/* 2. Hero Section (Parallax & Reveal) */}
        <section ref={targetRef} className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
           {/* Abstract Background Shapes - Animated */}
           <motion.div 
             animate={{ rotate: 360, scale: [1, 1.2, 1] }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10" 
           />
           <motion.div 
             animate={{ x: [-50, 50, -50], y: [-50, 50, -50] }}
             transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
             className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px] -z-10" 
           />

           <div className="absolute inset-0 z-0">
             <motion.img 
               style={{ opacity, scale, y }}
               src="/hero-library.png" 
               alt="Cozy Library" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background" />
           </div>

           <div className="relative z-10 w-11/12 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
             <div className="space-y-10">
                <FadeIn delay={0.2} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/30 text-accent-foreground text-sm font-bold mb-2 border border-accent/40 shadow-sm backdrop-blur-md">
                   <Sparkles className="h-4 w-4 fill-current animate-pulse" />
                   <span>Reimagine Your Reading Life</span>
                </FadeIn>
                
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-serif font-extrabold leading-none tracking-tighter text-foreground drop-shadow-sm">
                  Curate Your <br/>
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary relative inline-block">
                    <TextReveal text="Literary Universe" delay={0.5} />
                  </span>
                </h1>
                
                <FadeIn delay={0.8} className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl font-light">
                  Stop forgetting what you read. Track your progress, discover tailored recommendations, and join a community of passionate readers.
                </FadeIn>
                
                <StaggerContainer delay={1} className="flex flex-col sm:flex-row gap-5 pt-4">
                   <StaggerItem>
                       <Link href="/register">
                          <ScaleOnHover>
                              <Button size="lg" className="h-16 px-10 text-xl font-bold shadow-2xl shadow-primary/40 bg-linear-to-r from-primary to-primary/80 rounded-full">
                                Start Your Journey <ArrowRight className="ml-2 h-6 w-6" />
                              </Button>
                          </ScaleOnHover>
                       </Link>
                   </StaggerItem>
                   <StaggerItem>
                       <Link href="#how-it-works">
                          <ScaleOnHover>
                              <Button size="lg" variant="outline" className="h-16 px-10 text-xl rounded-full bg-white/50 backdrop-blur-md border-2 hover:bg-white/80 transition-colors">
                                How It Works
                              </Button>
                          </ScaleOnHover>
                       </Link>
                   </StaggerItem>
                </StaggerContainer>

                <FadeIn delay={1.4} className="pt-8 flex items-center gap-8 text-sm font-medium text-foreground/70">
                   {['Free Forever', 'No Ads', 'Privacy Focused'].map((text, i) => (
                       <div key={i} className="flex items-center gap-2">
                          <div className="p-1 bg-green-500/10 rounded-full"><CheckCircle2 className="h-4 w-4 text-green-600" /></div>
                          <span>{text}</span>
                       </div>
                   ))}
                </FadeIn>
             </div>
             
             {/* Hero Image / Illustration Parallax */}
             <motion.div 
               initial={{ opacity: 0, x: 100, rotate: 10 }}
               animate={{ opacity: 1, x: 0, rotate: 0 }}
               transition={{ duration: 1, delay: 0.5, type: "spring" }}
               className="relative hidden lg:block"
             >
                <div className="absolute inset-0 bg-linear-to-tr from-primary/30 to-secondary/30 rounded-full blur-[80px] -z-10" />
                <motion.img 
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    src="/banner.jpg" 
                    alt="Reading Illustration" 
                    className="w-full h-auto max-h-[700px] object-cover drop-shadow-2xl" 
                />
                
                {/* Floating Elements */}
                <FloatingCard className="absolute top-10 left-0 bg-white/90 backdrop-blur p-4 rounded-xl shadow-xl flex items-center gap-3 w-48 animate-float-slow">
                     <div className="bg-orange-100 p-2 rounded-lg"><BookOpen className="text-orange-500 h-6 w-6" /></div>
                     <div className="text-sm font-bold">Currently Reading<br/><span className="text-muted-foreground font-normal text-xs">The Great Gatsby</span></div>
                </FloatingCard>
                
                <FloatingCard className="absolute bottom-20 -right-10 bg-white/90 backdrop-blur p-4 rounded-xl shadow-xl flex items-center gap-3 w-40 animate-float-delayed">
                     <div className="bg-green-100 p-2 rounded-lg"><Trophy className="text-green-500 h-6 w-6" /></div>
                     <div className="text-sm font-bold">Goal Met!<br/><span className="text-muted-foreground font-normal text-xs">50 Books</span></div>
                </FloatingCard>
             </motion.div>
           </div>
        </section>

        {/* 3. Social Proof / Stats (Glassmorphism) */}
        <section className="py-12 relative z-20 -mt-16">
           <div className="w-11/12 max-w-6xl mx-auto bg-white/80 dark:bg-card/80 backdrop-blur-xl border shadow-2xl rounded-3xl p-8">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/40">
                <StatItem label="Active Readers" value="10k+" delay={0} />
                <StatItem label="Books Tracked" value="500k+" delay={0.1} />
                <StatItem label="Reviews Written" value="250k+" delay={0.2} />
                <StatItem label="Reading Goals Met" value="92%" delay={0.3} />
             </div>
           </div>
        </section>

        {/* 4. Features Bento Grid */}
        <section id="features" className="py-24 relative overflow-hidden">
            <div className="w-11/12 max-w-7xl mx-auto space-y-16">
               <div className="text-center space-y-4 max-w-3xl mx-auto">
                  <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary uppercase tracking-wider">Features</div>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Everything you need to <span className="text-secondary italic decoration-wavy underline">read more</span></h2>
                  <p className="text-xl text-muted-foreground">Comprehensive tools designed to help you build a reading habit that sticks.</p>
               </div>

               {/* Bento Grid Layout */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                  
                  {/* Large Card 1 */}
                  <BentoCard className="md:col-span-2 bg-linear-to-br from-primary/10 to-primary/20 border-primary/20" delay={0}>
                      <div className="h-full flex flex-col justify-between p-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                          <div className="z-10 space-y-4">
                              <div className="p-3 bg-white rounded-xl w-fit shadow-md"><Library className="h-8 w-8 text-primary" /></div>
                              <h3 className="text-3xl font-bold font-serif">Virtual Shelves</h3>
                              <p className="text-foreground/80 text-lg max-w-md">Organize your entire physical library digitally. Create custom shelves, track status, and never buy a duplicate again.</p>
                          </div>
                          <div className="absolute bottom-4 right-4 opacity-50"><BookOpen size={120} className="text-primary/10" /></div>
                      </div>
                  </BentoCard>

                  {/* Small Card 1 */}
                  <BentoCard className="bg-card border-border" delay={0.1}>
                      <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-6">
                           <div className="p-4 bg-secondary/10 rounded-full"><TrendingUp className="h-10 w-10 text-secondary" /></div>
                           <div>
                               <h3 className="text-xl font-bold mb-2">Insightful Stats</h3>
                               <p className="text-muted-foreground text-sm">Visualize your reading habits with beautiful charts.</p>
                           </div>
                      </div>
                  </BentoCard>

                  {/* Small Card 2 */}
                  <BentoCard className="bg-card border-border" delay={0.2}>
                       <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-6">
                           <div className="p-4 bg-accent/20 rounded-full"><Trophy className="h-10 w-10 text-accent-foreground" /></div>
                           <div>
                               <h3 className="text-xl font-bold mb-2">Gamification</h3>
                               <p className="text-muted-foreground text-sm">Set annual goals, earn badges, and keep your streak alive.</p>
                           </div>
                      </div>
                  </BentoCard>

                   {/* Large Card 2 */}
                   <BentoCard className="md:col-span-2 bg-linear-to-br from-secondary/10 to-secondary/20 border-secondary/20" delay={0.3}>
                       <div className="h-full flex flex-col justify-between p-8 relative overflow-hidden">
                          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                           <div className="z-10 space-y-4">
                              <div className="p-3 bg-white rounded-xl w-fit shadow-md"><Compass className="h-8 w-8 text-secondary" /></div>
                              <h3 className="text-3xl font-bold font-serif">Smart Discovery</h3>
                              <p className="text-foreground/80 text-lg max-w-md">Advanced algorithms that analyze your reading history to suggest books you'll actually love, not just bestsellers.</p>
                          </div>
                      </div>
                  </BentoCard>

                   {/* Wide Card 3 */}
                   <BentoCard className="md:col-span-3 bg-primary text-primary-foreground overflow-hidden" delay={0.4}>
                       <div className="h-full flex flex-col md:flex-row items-center p-8 gap-8">
                           <div className="space-y-4 md:w-1/2 relative z-10">
                               <div className="p-3 bg-white/20 backdrop-blur rounded-xl w-fit"><Users className="h-8 w-8 text-white" /></div>
                               <h3 className="text-3xl font-bold font-serif">Community & Reviews</h3>
                               <p className="text-primary-foreground/90 text-lg">Join a community of readers. Share your thoughts, write detailed reviews, and discuss your favorite plot twists without spoilers.</p>
                           </div>
                           <div className="md:w-1/2 h-full relative">
                               {/* Abstract community visual */}
                               <div className="absolute inset-0 bg-linear-to-l from-black/20 to-transparent z-10" />
                               <div className="grid grid-cols-3 gap-4 opacity-50 rotate-6 scale-110">
                                   {[1,2,3,4,5,6].map(i => (
                                       <div key={i} className="h-32 bg-white/20 rounded-xl animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />
                                   ))}
                               </div>
                           </div>
                       </div>
                   </BentoCard>
               </div>
            </div>
        </section>

        {/* 5. How It Works (Steps with Stickiness) */}
        <section id="how-it-works" className="py-24 bg-card border-y relative">
           <div className="w-11/12 max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col lg:flex-row gap-20">
                 <div className="lg:w-1/2 space-y-16">
                    <div className="sticky top-32">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-8">
                        Your journey from <br/>
                        <span className="text-muted-foreground opacity-50">"What next?"</span> to <br/>
                        <span className="text-primary decoration-wavy underline decoration-secondary">"I loved it!"</span>
                        </h2>
                        <div className="aspect-square rounded-3xl bg-muted relative overflow-hidden shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-700">
                             <img src="/empty-state.png" alt="App Preview" className="w-full h-full object-cover rounded-xl scale-110 hover:scale-100 transition-transform duration-700" />
                        </div>
                    </div>
                 </div>
                 <div className="lg:w-1/2 space-y-24 pt-10">
                    <StepItem 
                       number="01" 
                       title="Create your Profile" 
                       text="Sign up in seconds. Select your favorite genres to jumpstart our recommendation engine. We support everything from Sci-Fi to Romance." 
                    />
                    <StepItem 
                       number="02" 
                       title="Build your Library" 
                       text="Search for books or scan barcodes (coming soon). Add them to your shelves. Mark them as Read, Currently Reading, or Want to Read." 
                    />
                    <StepItem 
                       number="03" 
                       title="Track & Discover" 
                       text="Log your daily progress. Update page counts. When you finish, rate and review to unlock even better recommendations for your next adventure." 
                    />
                     <div className="h-24" /> {/* Spacer */}
                 </div>
              </div>
           </div>
        </section>

        {/* 6. Testimonials (Infinite Marquee) */}
        <section id="testimonials" className="py-24 overflow-hidden bg-background">
           <div className="space-y-16">
              <div className="text-center space-y-4">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Loved by <span className="text-primary">Readers</span></h2>
                  <p className="text-muted-foreground">Don't just take our word for it.</p>
              </div>

              <div className="relative w-full overflow-hidden mask-linear-fade">
                 <div className="absolute left-0 top-0 w-32 h-full z-10 bg-linear-to-r from-background to-transparent" />
                 <div className="absolute right-0 top-0 w-32 h-full z-10 bg-linear-to-l from-background to-transparent" />
                 
                 {/* Infinite Scroll Container */}
                 <div className="flex w-max animate-infinite-scroll hover:pause">
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                        <div key={i} className="mx-4 w-[400px]">
                            <TestimonialCard quote={t.quote} author={t.author} role={t.role} />
                        </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* 7. FAQ (Clean Accordion) */}
        <section id="faq" className="py-24 bg-muted/40 backdrop-blur">
           <div className="w-11/12 max-w-3xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground">Got questions? We've got answers.</p>
               </div>
               <div className="bg-card rounded-3xl border shadow-sm p-2">
                 <Accordion type="single" collapsible className="w-full">
                     {FAQS.map((faq, i) => (
                         <AccordionItem value={`item-${i}`} key={i} className="px-6 border-b last:border-0 hover:bg-muted/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                             <AccordionTrigger className="text-lg font-medium hover:text-primary hover:no-underline py-6">{faq.q}</AccordionTrigger>
                             <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                                 {faq.a}
                             </AccordionContent>
                         </AccordionItem>
                     ))}
                 </Accordion>
               </div>
            </div>
         </section>
 
         {/* 8. CTA / Final Footer */}
         <section className="py-32 relative overflow-hidden bg-gray-950 text-white text-center">
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 invert filter" />
            <motion.div 
                whileInView={{ scale: [0.9, 1], opacity: [0, 1] }} 
                transition={{ duration: 0.8 }}
                className="w-11/12 max-w-4xl mx-auto space-y-10 relative z-10"
             >
               <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tight">Ready to start your chapter?</h2>
               <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Join thousands of readers who are building their dream library today.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                  <Link href="/register">
                     <ScaleOnHover>
                         <Button size="lg" className="h-20 px-16 text-2xl font-bold shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                         Get Started for Free
                         </Button>
                     </ScaleOnHover>
                  </Link>
               </div>
            </motion.div>
         </section>

      </main>

      <footer className="bg-background border-t py-20">
         <div className="w-11/12 max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1 space-y-6">
               <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/20 rounded-xl">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-serif font-bold text-xl">BookWorm</span>
               </div>
               <p className="text-sm text-muted-foreground leading-relaxed">
                  Your digital sanctuary for all things books. Read, track, and discover your next great adventure.
               </p>
            </div>
            <div>
               <h4 className="font-bold mb-6 text-foreground">Product</h4>
               <ul className="space-y-4 text-sm text-muted-foreground">
                  <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                  <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                  <li><Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold mb-6 text-foreground">Company</h4>
               <ul className="space-y-4 text-sm text-muted-foreground">
                  <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                  <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold mb-6 text-foreground">Legal</h4>
               <ul className="space-y-4 text-sm text-muted-foreground">
                  <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
               </ul>
            </div>
         </div>
         <div className="w-11/12 max-w-7xl mx-auto mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BookWorm Inc. All rights reserved.
         </div>
      </footer>
    </div>
  );
}

// -- Animation Components & Data --

function FloatingCard({ children, className }: { children: React.ReactNode, className: String }) {
    return (
        <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={className as string}
        >
            {children}
        </motion.div>
    )
}

function StatItem({ label, value, delay }: { label: string, value: string, delay: number }) {
    return (
        <FadeIn delay={delay} className="space-y-2 group cursor-default">
            <div className="text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-linear-to-br from-primary to-secondary group-hover:scale-110 transition-transform duration-300 ease-out">{value}</div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</div>
        </FadeIn>
    );
}

function BentoCard({ children, className, delay }: { children: React.ReactNode, className?: string, delay: number }) {
    return (
        <FadeIn delay={delay} className={`rounded-3xl border border-transparent hover:border-border/50 transition-all duration-500 hover:shadow-2xl overflow-hidden group ${className}`}>
            {children}
        </FadeIn>
    );
}

function StepItem({ number, title, text }: { number: string, title: string, text: string }) {
    return (
        <FadeIn className="flex gap-8 group">
            <div className="font-serif text-6xl font-bold text-primary/20 group-hover:text-primary transition-colors duration-500">{number}</div>
            <div className="space-y-3 pt-3">
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">{title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{text}</p>
            </div>
        </FadeIn>
    );
}

function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
    return (
        <Card className="h-full border border-border/50 shadow-sm bg-card/50 hover:bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6">
            <CardContent className="space-y-6 pt-2">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                </div>
                <Quote className="h-8 w-8 text-primary/20" />
                <p className="text-lg italic text-foreground/80 leading-relaxed font-serif">"{quote}"</p>
                <div>
                    <div className="font-bold text-primary">{author}</div>
                    <div className="text-sm text-muted-foreground">{role}</div>
                </div>
            </CardContent>
        </Card>
    );
}

const TESTIMONIALS = [
    { quote: "BookWorm completely changed how I track my reading. The challenge feature pushes me to read one more chapter.", author: "Sarah J.", role: "Fiction Addict" },
    { quote: "Finally, a reading app that looks beautiful and doesn't feel cluttered. I appreciate the focus on the books.", author: "Michael C.", role: "History Buff" },
    { quote: "The recommendations are spot on. I've discovered three of my new favorite authors this month alone.", author: "Jessica L.", role: "Sci-Fi Fan" },
    { quote: "I love seeing my yearly stats. It's so satisfying to watch the graph grow as I finish more books.", author: "David K.", role: "Non-Fiction Reader" },
];

const FAQS = [
    { q: "Is BookWorm really free?", a: "Yes! BookWorm is completely free to use. We believe reading tools should be accessible to everyone." },
    { q: "Can I import my library from other apps?", a: "Currently, we are working on an import feature. Stay tuned for updates!" },
    { q: "How are recommendations calculated?", a: "We analyze the genres of books you've rated highly and suggest similar titles from our extensive database." },
    { q: "Is there a mobile app?", a: "BookWorm is a fully responsive web application that works great on any mobile device browser." },
];
