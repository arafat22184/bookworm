'use client';

import React from 'react';
import { Library, BookOpen, TrendingUp, Trophy, Compass, Users } from 'lucide-react';
import { FadeIn } from '@/components/ui/motion';

function BentoCard({ children, className, delay }: { children: React.ReactNode, className?: string, delay: number }) {
    return (
        <FadeIn delay={delay} className={`rounded-3xl border border-transparent hover:border-border/50 transition-all duration-500 hover:shadow-2xl overflow-hidden group ${className}`}>
            {children}
        </FadeIn>
    );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
        <div className="w-11/12 max-w-7xl mx-auto space-y-16">
           <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary uppercase tracking-wider">Features</div>
                <p className="text-xl md:text-2xl font-serif text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Everything you need to take your reading life to the next level. No clutter, just books.
                </p>
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
  );
}
