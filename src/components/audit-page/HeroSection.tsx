"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { HeroContent } from "@/lib/supabase/types";

interface HeroSectionProps {
  hero: HeroContent;
}

export default function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Blue glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent-primary/[0.04] blur-[120px]" />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 flex items-center justify-center gap-3"
        >
          <span className="h-px w-8 bg-text-tertiary" />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-text-tertiary">
            Audit personnalis&eacute;
          </span>
          <span className="h-px w-8 bg-text-tertiary" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl lg:text-[56px]"
        >
          {hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary md:text-xl"
        >
          {hero.subtitle}
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-6 w-6 text-text-tertiary" />
      </motion.div>
    </section>
  );
}
