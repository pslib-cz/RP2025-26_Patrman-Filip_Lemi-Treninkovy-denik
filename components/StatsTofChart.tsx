"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: { date: string; time: number }[];
  title: string;
  color?: string;
}

export default function StatsTofChart({ data, title, color = "#ea580c" }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col bg-white rounded-xl p-5 shadow-sm border border-slate-100 col-span-2 min-h-[300px] justify-center items-center">
        <p className="text-muted-foreground text-sm">
          No 10-jump data available for this period.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-xl p-5 shadow-sm border border-slate-100 col-span-2">
      <h3 className="text-black font-bold mb-6">
        {title}
      </h3>

      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}

          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />

            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 0.5", "dataMax + 0.5"]}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{
                color: "#0f172a",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
              itemStyle={{ color: "#ea580c", fontWeight: "bold" }}
              formatter={(value) => {
                if (typeof value === "number") return [`${value}s`, "TOF"];
                return [`${value}s`, "TOF"];
              }}
            />

            <Line
              type="monotone"
              dataKey="time"
              stroke={color}
              strokeWidth={4}
              dot={{ r: 4, fill: color, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
