interface StatItem {
  label: string;
  value: string | number;
  trend?: string;
}

interface StatsCardsProps {
  stats: StatItem[];
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border-subtle bg-bg-secondary p-4"
        >
          <div className="font-mono text-2xl font-bold text-text-primary">
            {stat.value}
          </div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">
            {stat.label}
          </div>
          {stat.trend && (
            <div className="mt-1 text-xs text-text-accent">{stat.trend}</div>
          )}
        </div>
      ))}
    </div>
  );
}
