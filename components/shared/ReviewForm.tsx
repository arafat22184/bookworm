'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function ReviewForm({ bookId }: { bookId: string }) {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return toast.error("Please select a rating");
        if (!comment.trim()) return toast.error("Please write a comment");
        
        setLoading(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                body: JSON.stringify({ bookId, rating, comment }),
            });
            const data = await res.json();
            
            if (res.status === 401) {
                toast.error("Please login to review");
                router.push('/login');
                return;
            }

            if (!res.ok) throw new Error(data.message);
            
            toast.success("Review submitted for approval");
            setRating(0);
            setComment('');
            router.refresh();
    } catch (error: any) {
            toast.error(error.message || "Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 border p-6 rounded-lg bg-card/50">
            <h3 className="font-bold text-lg">Write a Review</h3>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                        key={star}
                        className={`cursor-pointer w-6 h-6 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                        onClick={() => setRating(star)}
                    />
                ))}
            </div>
            <Textarea 
                placeholder="What did you think of this book?" 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
            />
            <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
        </div>
    );
}
