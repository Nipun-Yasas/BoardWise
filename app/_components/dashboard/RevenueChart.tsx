"use client";

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface RevenueChartProps {
    data: {
        name: string;
        total: number;
    }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
    return (
        <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary text-textPrimary shadow col-span-4">
            <div className="p-6 flex flex-col gap-y-1.5 space-y-0">
                <h3 className="font-semibold leading-none tracking-tight">Overview</h3>
                <p className="text-sm text-textSecondary">
                    Monthly revenue for the current year
                </p>
            </div>
            <div className="p-6 pt-0 pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <Bar
                            dataKey="total"
                            fill="currentColor"
                            radius={[4, 4, 0, 0]}
                            className="fill-primary"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
