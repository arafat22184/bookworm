'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScaleOnHover } from '@/components/ui/motion';
import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden bg-gray-950 text-white text-center">
       <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 invert filter" />
       <motion.div 
           whileInView={{ scale: [0.9, 1], opacity: [0, 1] }} 
           transition={{ duration: 0.8 }}
           className="w-11/12 max-w-4xl mx-auto space-y-10 relative z-10"
        >
          <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tight">Ready to start your chapter?</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
             Join thousands of readers who are building their dream library today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
             <Link href="/register">
                <ScaleOnHover>
                    <Button size="lg" className="h-20 px-16 text-2xl font-bold shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full">
                    Get Started for Free
                    </Button>
                </ScaleOnHover>
             </Link>
          </div>
       </motion.div>
    </section>
  );
}
