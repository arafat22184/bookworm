'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, CheckCircle2, BookOpen, Trophy } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem, TextReveal, ScaleOnHover } from '@/components/ui/motion';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

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

export function HeroSection() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
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
  );
}
