'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Trophy } from 'lucide-react';

export function ReadingChallenge({ challenge }: { challenge: { goal: number, current: number, year: number } }) {
  const router = useRouter();
  const [goal, setGoal] = useState(challenge.goal || 0);
  const [isEditing, setIsEditing] = useState(challenge.goal === 0);

  const percentage = challenge.goal > 0 ? Math.min(100, Math.round((challenge.current / challenge.goal) * 100)) : 0;

  const handleUpdate = async () => {
    try {
        const res = await fetch('/api/user/challenge', {
            method: 'POST',
            body: JSON.stringify({ goal: Number(goal) }),
        });
        if (res.ok) {
            toast.success("Goal updated!");
            setIsEditing(false);
            router.refresh();
        }
    } catch (_e) {
        toast.error("Failed to update progress");
    }
  };

  return (
    <Card className="bg-linear-to-br from-primary/10 to-primary/5 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Reading Challenge {challenge.year}
            </CardTitle>
            <CardDescription>Track your progress for the year</CardDescription>
        </div>
        <div className="text-2xl font-bold font-serif text-primary">
            {challenge.current} / {challenge.goal > 0 ? challenge.goal : '?'}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {challenge.goal > 0 && !isEditing ? (
            <div className="space-y-2">
                <Progress value={percentage} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage}% Completed</span>
                    <button onClick={() => setIsEditing(true)} className="text-primary hover:underline">Edit Goal</button>
                </div>
            </div>
        ) : (
            <div className="flex gap-2">
                <Input 
                    type="number" 
                    value={goal} 
                    onChange={(e) => setGoal(Number(e.target.value))} 
                    placeholder="Enter Goal (e.g. 20)" 
                    className="flex-1"
                />
                <Button onClick={handleUpdate}>Set Goal</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
