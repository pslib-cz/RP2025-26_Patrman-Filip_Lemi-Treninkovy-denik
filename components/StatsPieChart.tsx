'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
    data: { name: string; value: number; color: string }[];
}

export default function StatsPieChart({ data }: Props) {
    return (
        <ResponsiveContainer width="100%" height={200} >
            <PieChart style={{ userSelect: "none", WebkitTapHighlightColor: "transparent" }} >
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius="80%"
                    outerRadius="100%"
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={index} className={`${entry.color}`} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
}