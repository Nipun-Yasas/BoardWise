import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    description?: string;
    trend?: {
        value: number;
        label: string;
        positive?: boolean;
    };
    className?: string;
}

export const StatCard = ({
    title,
    value,
    icon,
    description,
    trend,
    className,
}: StatCardProps) => {
    return (
        <div
            className={cn(
                "rounded-xl border border-borderPrimary bg-backgroundSecondary text-textPrimary shadow p-6",
                className
            )}
        >
            <div className="flex items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-textPrimary">{title}</h3>
                {icon && <div className="h-4 w-4 text-textSecondary">{icon}</div>}
            </div>
            <div>
                <div className="text-2xl font-bold">{value}</div>
                {(description || trend) && (
                    <p className="text-xs text-textPrimary mt-1">
                        {trend && (
                            <span
                                className={cn(
                                    "mr-1 font-medium",
                                    trend.positive ? "text-green-500" : "text-red-500"
                                )}
                            >
                                {trend.positive ? "+" : ""}
                                {trend.value}%
                            </span>
                        )}
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};
