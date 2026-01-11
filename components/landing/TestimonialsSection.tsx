

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from 'lucide-react';
import connectToDatabase from "@/lib/db";
import Review from "@/lib/models/Review";
import User from "@/lib/models/User";

function TestimonialCard({ quote, author, role, imageId, userImage }: { quote: string, author: string, role: string, imageId: string, userImage?: string }) {
    return (
        <div className="h-full w-full p-px bg-linear-to-br from-transparent to-transparent hover:from-primary/20 hover:to-secondary/20 rounded-3xl transition-all duration-500 group">
            <div className="h-full bg-card/80 backdrop-blur-sm border border-border/40 p-8 rounded-3xl shadow-sm group-hover:shadow-2xl transition-all duration-500 flex flex-col justify-between gap-6">
                <div>
                    <Quote className="h-10 w-10 text-primary/10 mb-6" />
                    <p className="text-xl md:text-2xl font-serif leading-relaxed text-foreground/90 line-clamp-4">
                        {quote}
                    </p>
                </div>
                
                <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                    <Avatar className="h-14 w-14 border-2 border-background ring-2 ring-primary/5 shadow-md">
                        <AvatarImage src={userImage || `https://i.pravatar.cc/150?u=${imageId}`} />
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

async function getTestimonials() {
  try {
    await connectToDatabase();
    // Ensure User model is registered before population
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = User; 
    
    const reviews = await Review.find({ rating: 5 })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('user', 'name image')
      .lean();

    if (!reviews) return [];

    return reviews.map((review) => ({
      quote: review.comment,
      author: (review.user as any)?.name || "Anonymous Reader",
      role: "Verified Reader",
      imageId: (review.user as any)?._id?.toString() || Math.random().toString(),
      userImage: (review.user as any)?.image
    }));
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
}

export async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  return (
    <section id="testimonials" className="py-24 overflow-hidden bg-background">
       <div className="space-y-16">
          <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Loved by <span className="text-primary">Readers</span></h2>
              <p className="text-muted-foreground">Don't just take our word for it.</p>
          </div>

          {testimonials.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-3xl w-11/12 max-w-4xl mx-auto border border-dashed border-border">
                <p className="text-xl font-medium text-muted-foreground">No reviews yet. Be the first to share your journey!</p>
            </div>
          ) : testimonials.length < 4 ? (
            /* Static Display for few reviews */
            <div className="flex flex-wrap justify-center gap-8 px-4">
                {testimonials.map((t, i) => (
                    <div key={i} className="w-[400px] max-w-full">
                        <TestimonialCard 
                            quote={t.quote} 
                            author={t.author} 
                            role={t.role} 
                            imageId={t.imageId} 
                            userImage={'userImage' in t ? t.userImage : undefined}
                        />
                    </div>
                ))}
            </div>
          ) : (
            /* Infinite Scroll for many reviews */
            <div className="relative w-full overflow-hidden mask-linear-fade">
                <div className="absolute left-0 top-0 w-32 h-full z-10 bg-linear-to-r from-background to-transparent" />
                <div className="absolute right-0 top-0 w-32 h-full z-10 bg-linear-to-l from-background to-transparent" />
                
                <div className="flex w-max animate-infinite-scroll hover:pause py-12">
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div key={i} className="mx-4 w-[400px]">
                            <TestimonialCard 
                                quote={t.quote} 
                                author={t.author} 
                                role={t.role} 
                                imageId={t.imageId} 
                                userImage={'userImage' in t ? t.userImage : undefined}
                            />
                        </div>
                    ))}
                </div>
            </div>
          )}
       </div>
    </section>
  );
}
