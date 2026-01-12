"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScaleOnHover } from "@/components/ui/motion";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-12 md:py-16 lg:py-24 relative overflow-hidden bg-gray-950 text-white text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:40px_40px] pointer-events-none" />
      <motion.div
        whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
        transition={{ duration: 0.8 }}
        className="w-11/12 max-w-4xl mx-auto space-y-8 md:space-y-10 relative z-10"
      >
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight px-4">
          Ready to start your chapter?
        </h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-xl md:max-w-2xl mx-auto px-4">
          Join thousands of readers who are building their dream library today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 md:pt-8 px-6">
          <Link href="/register" className="w-full sm:w-auto">
            <ScaleOnHover>
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 md:h-16 lg:h-20 px-8 md:px-12 lg:px-16 text-lg md:text-xl lg:text-2xl font-bold shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              >
                Get Started for Free
              </Button>
            </ScaleOnHover>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
