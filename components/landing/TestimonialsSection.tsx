'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from 'lucide-react';

function TestimonialCard({ quote, author, role, imageId }: { quote: string, author: string, role: string, imageId: number }) {
    return (
        <div className="h-full w-full p-px bg-linear-to-br from-transparent to-transparent hover:from-primary/20 hover:to-secondary/20 rounded-3xl transition-all duration-500 group">
            <div className="h-full bg-card/80 backdrop-blur-sm border border-border/40 p-8 rounded-3xl shadow-sm group-hover:shadow-2xl transition-all duration-500 flex flex-col justify-between gap-6">
                <div>
                    <Quote className="h-10 w-10 text-primary/10 mb-6" />
                    <p className="text-xl md:text-2xl font-serif leading-relaxed text-foreground/90">
                        {quote}
                    </p>
                </div>
                
                <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                    <Avatar className="h-14 w-14 border-2 border-background ring-2 ring-primary/5 shadow-md">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${imageId}`} />
                        <AvatarFallback>{author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-bold text-lg text-foreground">{author}</div>
                        <div className="text-sm font-medium text-muted-foreground/80">{role}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const TESTIMONIALS = [
    { quote: "BookWorm completely changed how I track my reading. The challenge feature pushes me to read one more chapter.", author: "Sarah J.", role: "Fiction Addict", imageId: 101 },
    { quote: "Finally, a reading app that looks beautiful and doesn't feel cluttered. I appreciate the focus on the books.", author: "Michael C.", role: "History Buff", imageId: 102 },
    { quote: "The recommendations are spot on. I've discovered three of my new favorite authors this month alone.", author: "Jessica L.", role: "Sci-Fi Fan", imageId: 103 },
    { quote: "I love seeing my yearly stats. It's so satisfying to watch the graph grow as I finish more books.", author: "David K.", role: "Non-Fiction Reader", imageId: 104 },
];

export function TestimonialsSection() {
  return (
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
             <div className="flex w-max animate-infinite-scroll hover:pause py-12">
                {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                    <div key={i} className="mx-4 w-[400px]">
                        <TestimonialCard quote={t.quote} author={t.author} role={t.role} imageId={t.imageId} />
                    </div>
                ))}
             </div>
          </div>
       </div>
    </section>
  );
}
