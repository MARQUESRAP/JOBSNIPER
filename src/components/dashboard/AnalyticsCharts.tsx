"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface WeeklyData {
  week: string;
  sent: number;
  opened: number;
  visited: number;
  booked: number;
}

interface AnalyticsChartsProps {
  data: WeeklyData[];
}

export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-secondary p-6">
      <h3 className="mb-6 text-sm font-medium uppercase tracking-wider text-text-tertiary">
        Tendances hebdomadaires
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
          <XAxis
            dataKey="week"
            stroke="#71717A"
            fontSize={12}
            tickLine={false}
          />
          <YAxis stroke="#71717A" fontSize={12} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0E0E14",
              border: "1px solid #2A2A3C",
              borderRadius: "8px",
              color: "#F5F5F7",
              fontSize: "13px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "#A1A1AA" }}
          />
          <Line
            type="monotone"
            dataKey="sent"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={false}
            name="Envoy\u00e9s"
          />
          <Line
            type="monotone"
            dataKey="opened"
            stroke="#60A5FA"
            strokeWidth={2}
            dot={false}
            name="Ouverts"
          />
          <Line
            type="monotone"
            dataKey="visited"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            name="Visit\u00e9s"
          />
          <Line
            type="monotone"
            dataKey="booked"
            stroke="#22C55E"
            strokeWidth={2}
            dot={false}
            name="Book\u00e9s"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
