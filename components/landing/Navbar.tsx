"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { ScaleOnHover } from "@/components/ui/motion";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import React from "react";

export function Navbar() {
  const { isAuthenticated, isLoading, logout: handleLogout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router]);

  // Prevent scrolling when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Auth buttons component to avoid duplication
  const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {isLoading ? (
        <div className={`flex gap-4 ${mobile ? "flex-col w-full" : ""}`}>
          <div className="w-20 h-10 bg-muted/20 animate-pulse rounded-md" />
          <div className="w-28 h-10 bg-muted/20 animate-pulse rounded-full" />
        </div>
      ) : isAuthenticated ? (
        <div className={`flex gap-4 ${mobile ? "flex-col w-full" : ""}`}>
          <Link href="/dashboard" className={mobile ? "w-full" : ""}>
            <ScaleOnHover>
              <Button
                className={`font-medium shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all rounded-full px-6 ${
                  mobile ? "w-full h-12 text-lg" : ""
                }`}
              >
                Dashboard
              </Button>
            </ScaleOnHover>
          </Link>
          <Button
            variant="ghost"
            className={`font-medium hover:bg-red-500 hover:text-white ${
              mobile ? "w-full h-12 text-lg text-red-500 hover:bg-red-50" : ""
            }`}
            onClick={() => {
              handleLogout();
              if (mobile) setIsMobileMenuOpen(false);
            }}
          >
            Logout
          </Button>
        </div>
      ) : (
        <div className={`flex gap-4 ${mobile ? "flex-col w-full" : ""}`}>
          <Link href="/login" className={mobile ? "w-full" : ""}>
            <Button
              variant="ghost"
              className={`font-medium hover:bg-primary/5 hover:text-primary ${
                mobile ? "w-full h-12 text-lg border-2" : ""
              }`}
            >
              Sign In
            </Button>
          </Link>
          <Link href="/register" className={mobile ? "w-full" : ""}>
            <ScaleOnHover>
              <Button
                className={`font-medium shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all rounded-full px-6 ${
                  mobile ? "w-full h-12 text-lg" : ""
                }`}
              >
                Get Started
              </Button>
            </ScaleOnHover>
          </Link>
        </div>
      )}
    </>
  );

  return (
    <>
      <header className="fixed w-full z-50 bg-background/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="w-11/12 max-w-7xl mx-auto h-16 md:h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group cursor-pointer relative z-50"
            aria-label="BookWorm Home"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="p-2.5 bg-linear-to-br from-primary to-secondary rounded-xl shadow-lg"
            >
              <BookOpen className="h-6 w-6 text-white" />
            </motion.div>
            <span className="font-serif font-bold text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              BookWorm
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-10 text-sm font-medium text-muted-foreground/80">
            {["Features", "How it Works", "Stories", "FAQ"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:text-primary transition-colors hover:underline decoration-2 decoration-secondary underline-offset-4"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex gap-4">
            <AuthButtons />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden z-50 p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col items-end gap-1.5">
              <motion.span
                animate={
                  isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                }
                className="w-full h-0.5 bg-current block origin-center transition-transform"
              />
              <motion.span
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-4 h-0.5 bg-current block transition-opacity"
              />
              <motion.span
                animate={
                  isMobileMenuOpen
                    ? { rotate: -45, y: -8, width: "100%" }
                    : { rotate: 0, y: 0 }
                }
                className="w-3/4 h-0.5 bg-current block origin-center transition-transform"
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-3xl z-40 md:hidden flex flex-col pt-24 px-6 overflow-y-auto"
          >
            <nav className="flex flex-col items-center gap-8 text-2xl font-serif font-medium text-foreground mb-8">
              {["Features", "How it Works", "Stories", "FAQ"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </nav>

            <div className="w-full max-w-sm mx-auto space-y-6 border-t border-border/50 pt-8">
              <AuthButtons mobile />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
