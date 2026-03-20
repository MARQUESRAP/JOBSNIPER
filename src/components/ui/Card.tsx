import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-subtle bg-bg-secondary p-6",
        hover &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-border-accent hover:shadow-lg hover:shadow-accent-primary/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
