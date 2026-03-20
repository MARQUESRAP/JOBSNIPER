"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: "accent" | "success" | "danger" | "warning";
  showPercentage?: boolean;
  className?: string;
}

const colorStyles = {
  accent: "bg-accent-primary",
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
};

export default function ProgressBar({
  value,
  max,
  label,
  color = "accent",
  showPercentage = true,
  className,
}: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const percentage = Math.round((value / max) * 100);

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-text-secondary">{label}</span>
          {showPercentage && (
            <span className="font-mono text-sm font-bold text-text-accent">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-bg-tertiary">
        <motion.div
          className={cn("h-full rounded-full", colorStyles[color])}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
