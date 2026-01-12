"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  TextReveal,
  ScaleOnHover,
} from "@/components/ui/motion";
import { motion } from "framer-motion";

function FloatingCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className: string;
  delay?: number;
}) {
  return (
    <div
      className={`animate-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Optimized Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 w-11/12 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-10">
        <div className="space-y-8 lg:space-y-10">
          <FadeIn
            delay={0.2}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/30 text-accent-foreground text-sm font-bold mb-2 border border-accent/40 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 fill-current animate-pulse" />
            <span>Reimagine Your Reading Life</span>
          </FadeIn>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-extrabold leading-[1.1] tracking-tighter text-foreground drop-shadow-sm">
            Curate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary relative inline-block pb-2">
              <TextReveal text="Literary Universe" delay={0.5} />
            </span>
          </h1>

          <FadeIn
            delay={0.8}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl font-light"
          >
            Stop forgetting what you read. Track your progress, discover
            tailored recommendations, and join a community of passionate readers
            with our modern dashboard.
          </FadeIn>

          <StaggerContainer
            delay={1}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <StaggerItem>
              <Link href="/register">
                <ScaleOnHover>
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 bg-gradient-to-r from-primary to-primary/90 rounded-full w-full sm:w-auto"
                  >
                    Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </ScaleOnHover>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link href="#how-it-works">
                <ScaleOnHover>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-lg rounded-full bg-background/50 backdrop-blur-md border-2 hover:bg-background/80 transition-colors w-full sm:w-auto"
                  >
                    How It Works
                  </Button>
                </ScaleOnHover>
              </Link>
            </StaggerItem>
          </StaggerContainer>

          <FadeIn
            delay={1.4}
            className="pt-6 flex flex-wrap items-center gap-6 text-sm font-medium text-foreground/70"
          >
            {["Free Forever", "No Ads", "Privacy Focused"].map((text, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="p-1 bg-green-500/10 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </FadeIn>
        </div>

        {/* Optimized Hero Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative hidden lg:block perspective-1000"
        >
          <div className="relative transform rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-3xl -z-10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero_dashboard_mockup.png"
              alt="Bookworm Dashboard"
              className="w-full h-auto rounded-xl shadow-2xl border border-white/10"
            />

            {/* Simplified Floating Elements */}
            <FloatingCard
              className="absolute -left-12 top-20 bg-background/80 backdrop-blur-xl p-4 rounded-xl shadow-2xl border border-white/20 flex items-center gap-4 w-52"
              delay={0}
            >
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                <TrendingUp className="text-orange-500 h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Streak
                </div>
                <div className="text-lg font-bold">12 Days 🔥</div>
              </div>
            </FloatingCard>

            <FloatingCard
              className="absolute -right-8 bottom-32 bg-background/80 backdrop-blur-xl p-4 rounded-xl shadow-2xl border border-white/20 flex items-center gap-4 w-48"
              delay={1.5}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <BarChart3 className="text-blue-500 h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Read
                </div>
                <div className="text-lg font-bold">24 Books</div>
              </div>
            </FloatingCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
