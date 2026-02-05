import React from "react";
import { StatCard } from "@/app/_components/dashboard/StatCard";
import { RevenueChart } from "@/app/_components/dashboard/RevenueChart";
import { Building2, CreditCard, DollarSign, Users } from "lucide-react";
import { getOwnerDashboardData } from "@/app/actions/owner-dashboard";

export default async function OwnerDashboard() {
  // Fetch the data
  const {
    roomCount,
    activeMembersCount,
    currentMonthRevenue,
    currentMonthExpenses,
    revenueChartData,
  } = await getOwnerDashboardData();

  // Helper to format currency
  const formatter = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Monthly Revenue"
          value={formatter.format(currentMonthRevenue)}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="Current month revenue"
        />
        <StatCard
          title="Active Members"
          value={activeMembersCount.toString()}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Total active members"
        />
        <StatCard
          title="Boarding Rooms"
          value={roomCount.toString()}
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
          description="Total active rooms"
        />
        <StatCard
          title="Operational Bills"
          value={formatter.format(currentMonthExpenses)}
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          description="Current month expenses"
        />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RevenueChart data={revenueChartData} />
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