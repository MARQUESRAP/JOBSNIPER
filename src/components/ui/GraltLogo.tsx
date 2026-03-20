import { cn } from "@/lib/utils";

interface GraltLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export default function GraltLogo({ size = "md", className }: GraltLogoProps) {
  return (
    <span
      className={cn(
        "font-display font-normal tracking-tight text-text-primary",
        sizeStyles[size],
        className
      )}
    >
      gralt
      <span className="text-accent-primary">.</span>
    </span>
  );
}
