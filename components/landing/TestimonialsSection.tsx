'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from 'lucide-react';

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
  );
}
