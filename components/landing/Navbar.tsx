'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { ScaleOnHover } from '@/components/ui/motion';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  return (
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
              <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary transition-colors hover:underline decoration-2 decoration-secondary underline-offset-4">{item}</Link>
            ))}
         </nav>
        {
          isLoading ? (
            <div className="flex gap-4">
              <div className="w-20 h-10 bg-muted/20 animate-pulse rounded-md" />
              <div className="w-28 h-10 bg-muted/20 animate-pulse rounded-full" />
            </div>
          ) : isAuthenticated ? (
            <div className='flex gap-4'>
            <Link href="/dashboard"><ScaleOnHover>
                  <Button className="font-medium shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all rounded-full px-6">Dashboard</Button>
              </ScaleOnHover></Link>
              <Button variant="ghost" className="font-medium hover:bg-red-500 hover:text-white" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
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
          )
         }
      </div>
    </header>
  );
}
