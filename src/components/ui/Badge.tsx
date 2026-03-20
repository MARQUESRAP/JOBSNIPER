import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "success" | "danger" | "warning" | "info" | "neutral";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  success: "bg-success-bg text-success border-success/20",
  danger: "bg-danger-bg text-danger border-danger/20",
  warning: "bg-warning-bg text-warning border-warning/20",
  info: "bg-accent-primary/10 text-text-accent border-accent-primary/20",
  neutral: "bg-bg-tertiary text-text-tertiary border-border-subtle",
};

export default function Badge({
  variant = "neutral",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
