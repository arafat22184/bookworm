'use client';

import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function ReviewActions({ reviewId }: { reviewId: string }) {
    const router = useRouter();

    const updateStatus = async (status: string) => {
        try {
            const res = await fetch(`/api/reviews/${reviewId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error();
            toast.success(`Review ${status}`);
            router.refresh();
        } catch (_e) {
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="flex gap-2">
            <Button size="icon" variant="outline" className="text-green-600 hover:text-green-700" onClick={() => updateStatus('approved')}>
                <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => updateStatus('rejected')}>
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}
