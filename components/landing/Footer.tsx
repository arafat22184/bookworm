

import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t py-20">
       <div className="w-11/12 max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1 space-y-6">
             <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/20 rounded-xl">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <span className="font-serif font-bold text-xl">BookWorm</span>
             </div>
             <p className="text-sm text-muted-foreground leading-relaxed">
                Your digital sanctuary for all things books. Read, track, and discover your next great adventure.
             </p>
          </div>
          <div>
             <h4 className="font-bold mb-6 text-foreground">Product</h4>
             <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
             </ul>
          </div>
          <div>
             <h4 className="font-bold mb-6 text-foreground">Company</h4>
             <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
             </ul>
          </div>
          <div>
             <h4 className="font-bold mb-6 text-foreground">Legal</h4>
             <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
             </ul>
          </div>
       </div>
       <div className="w-11/12 max-w-7xl mx-auto mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BookWorm Inc. All rights reserved.
       </div>
    </footer>
  );
}
