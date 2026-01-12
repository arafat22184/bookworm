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
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-background px-4 lg:px-0">
      {/* Modern Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Spotlight / Radial Gradient Top */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 via-primary/5 to-transparent pointer-events-none blur-3xl opacity-50" />

      {/* Accent Glow Blooms */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-40 animate-pulse" />
      <div
        className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none opacity-40 animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-6 lg:pt-0">
        <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
          <FadeIn
            delay={0.2}
            className="inline-flex mx-auto lg:mx-0 items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2 border border-primary/20 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="h-3 w-3 fill-current" />
            <span>Reimagine Your Reading Life</span>
          </FadeIn>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] tracking-tight text-foreground drop-shadow-sm">
            Curate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-secondary relative inline-block pb-1">
              <TextReveal text="Literary Universe" delay={0.5} />
            </span>
          </h1>

          <FadeIn
            delay={0.8}
            className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium tracking-wide"
          >
            Stop forgetting what you read. Track your progress, discover
            tailored recommendations, and join a community of passionate readers
            with our modern, intelligent dashboard.
          </FadeIn>

          <StaggerContainer
            delay={1}
            className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start"
          >
            <StaggerItem>
              <Link href="/register" className="w-full sm:w-auto">
                <ScaleOnHover>
                  <Button
                    size="lg"
                    className="h-12 px-8 text-base font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] bg-primary text-primary-foreground rounded-full w-full sm:w-auto transition-all duration-300"
                  >
                    Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </ScaleOnHover>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link href="#how-it-works" className="w-full sm:w-auto">
                <ScaleOnHover>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-8 text-base rounded-full bg-background/50 backdrop-blur-md border-2 hover:bg-background/80 transition-colors w-full sm:w-auto font-semibold"
                  >
                    How It Works
                  </Button>
                </ScaleOnHover>
              </Link>
            </StaggerItem>
          </StaggerContainer>

          <FadeIn
            delay={1.4}
            className="pt-4 flex flex-wrap justify-center lg:justify-start items-center gap-4 text-xs font-semibold text-muted-foreground"
          >
            {["Free Forever", "No Ads", "Privacy Focused"].map((text, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="flex items-center justify-center w-4 h-4 bg-green-500/10 rounded-full">
                  <CheckCircle2 className="h-2.5 w-2.5 text-green-600" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </FadeIn>
        </div>

        {/* Optimized Hero Image */}
        <motion.div
          initial={{ opacity: 0, x: 50, rotateY: 30 }}
          animate={{ opacity: 1, x: 0, rotateY: -5 }}
          transition={{
            duration: 1,
            delay: 0.6,
            type: "spring",
            stiffness: 50,
          }}
          className="relative hidden lg:block perspective-[2000px] w-full max-w-[600px] mx-auto"
        >
          <div className="relative transform-style-3d hover:rotate-y-0 transition-transform duration-700 ease-out group">
            {/* Glow behind image */}
            <div className="absolute inset-4 bg-primary/30 rounded-[30px] blur-[60px] -z-10 group-hover:bg-primary/40 transition-colors duration-500" />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero_dashboard_mockup.png"
              alt="Bookworm Dashboard"
              className="w-full h-auto rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/10 backdrop-blur-sm"
            />

            {/* Glassmorphism Floating Elements - Fixed Contrast */}
            <FloatingCard
              className="absolute -left-8 top-12 bg-white/10 dark:bg-black/60 backdrop-blur-xl p-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3 w-52 z-20"
              delay={0}
            >
              <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2.5 rounded-xl shadow-lg">
                <TrendingUp className="text-white h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-gray-200 uppercase font-bold tracking-wider mb-0.5">
                  Current Streak
                </div>
                <div className="text-lg font-bold text-white">12 Days 🔥</div>
              </div>
            </FloatingCard>

            <FloatingCard
              className="absolute -right-4 bottom-20 bg-white/10 dark:bg-black/60 backdrop-blur-xl p-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3 w-48 z-20"
              delay={1.5}
            >
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-2.5 rounded-xl shadow-lg">
                <BarChart3 className="text-white h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-gray-200 uppercase font-bold tracking-wider mb-0.5">
                  Total Read
                </div>
                <div className="text-lg font-bold text-white">24 Books</div>
              </div>
            </FloatingCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
