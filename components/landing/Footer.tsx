import Link from "next/link";
import { BookOpen, Twitter, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t py-12">
      <div className="w-11/12 max-w-7xl mx-auto flex flex-col items-center text-center space-y-8">
        {/* Brand Section */}
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <span className="font-serif font-bold text-3xl tracking-tight">
              BookWorm
            </span>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
            Your digital sanctuary for all things books. Discover, track, and
            share your reading journey.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex gap-6">
          <Link
            href="#"
            className="p-3 rounded-full hover:bg-muted transition-all hover:scale-110 text-muted-foreground hover:text-primary"
          >
            <Twitter className="h-5 w-5" />
          </Link>
          <Link
            href="#"
            className="p-3 rounded-full hover:bg-muted transition-all hover:scale-110 text-muted-foreground hover:text-pink-600"
          >
            <Instagram className="h-5 w-5" />
          </Link>
          <Link
            href="#"
            className="p-3 rounded-full hover:bg-muted transition-all hover:scale-110 text-muted-foreground hover:text-blue-600"
          >
            <Facebook className="h-5 w-5" />
          </Link>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t w-full max-w-2xl text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-2">
          <p>
            &copy; {new Date().getFullYear()} BookWorm. All rights reserved.
          </p>
          <p>Made with ❤️ for readers anywhere.</p>
        </div>
      </div>
    </footer>
  );
}
