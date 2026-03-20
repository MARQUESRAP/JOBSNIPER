import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export default function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <div className={cn("group relative inline-flex", className)}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-bg-elevated px-3 py-1.5 text-xs text-text-secondary opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        {content}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-bg-elevated" />
      </span>
    </div>
  );
}
