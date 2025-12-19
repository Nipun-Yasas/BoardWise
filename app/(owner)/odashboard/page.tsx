import React from "react";
import { StatCard } from "@/app/_components/dashboard/StatCard";
import { RevenueChart } from "@/app/_components/dashboard/RevenueChart";
import { Building2, CreditCard, DollarSign, Users } from "lucide-react";

export default function GenericDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Monthly Revenue"
          value="LKR 45,231.89"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          trend={{
            value: 20.1,
            label: "from last month",
            positive: true,
          }}
          description="from last month"
        />
        <StatCard
          title="Active Members"
          value="+2350"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          trend={{
            value: 180.1,
            label: "from last month",
            positive: true,
          }}
          description="from last month"
        />
        <StatCard
          title="Boarding Rooms"
          value="12"
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
          description="Total active rooms"
        />
        <StatCard
          title="Operational Bills"
          value="LKR 12,234"
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          trend={{
            value: 19,
            label: "from last month",
            positive: false,
          }}
          description="from last month"
        />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RevenueChart />
        </div>
        <div className="col-span-4 lg:col-span-3">
          <div className="rounded-xl border border-borderPrimary bg-backgroundSecondary text-textPrimary shadow h-full p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-textPrimary">
                Recent Activity
              </h3>
            </div>
            <div className="space-y-4 mt-4">
              <p className="text-sm text-textSecondary">
                No recent activity to display.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
