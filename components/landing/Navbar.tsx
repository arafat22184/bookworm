'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { ScaleOnHover } from '@/components/ui/motion';
import { motion } from 'framer-motion';

export function Navbar() {
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
  );
}
