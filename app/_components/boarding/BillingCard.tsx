import React from "react";

export type BillingCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  colorClass: string;
};

const BillingCard = ({
  title,
  value,
  subtitle,
  icon,
  colorClass,
}: BillingCardProps) => (
  <div
    className={`p-6 rounded-2xl border bg-backgroundSecondary shadow-sm hover:shadow-md transition-all duration-300 ${colorClass}`}
  >
    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-3 rounded-xl bg-opacity-20 ${colorClass
          .replace("border-", "bg-")
          .replace("dark:border-", "dark:bg-")}`}
      >
        {icon}
      </div>
      {subtitle && (
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-textSecondary">
          {subtitle}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-sm font-medium text-textSecondary mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold text-textPrimary">
        {value}
      </p>
    </div>
  </div>
);

export default BillingCard;
