"use client";

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const data = [
    {
        name: "Jan",
        total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
        name: "Feb",
        total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
        name: "Mar",
        total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
        name: "Apr",
        total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
        name: "May",
        total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
        name: "Jun",
        total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
        name: "Jul",
        total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
        name: "Aug",
        total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
        name: "Sep",
        total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
        name: "Oct",
        total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
        name: "Nov",
        total: Math.floor(Math.random() * 500000) + 100000,
    },
    {
        name: "Dec",
        total: Math.floor(Math.random() * 500000) + 100000,
    },
];

export function RevenueChart() {
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
