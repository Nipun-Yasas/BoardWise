"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/app/_components/dashboard/StatCard";
import { RevenueChart } from "@/app/_components/dashboard/RevenueChart";
import { Building2, CreditCard, DollarSign, Users } from "lucide-react";

interface DashboardStats {
  totalRevenue: number;
  revenueTrend: number;
  activeMembers: number;
  activeMembersTrend: number;
  totalRooms: number;
  operationalBills: number;
  operationalBillsTrend: number;
  chartData: { name: string; total: number }[];
}

export default function OwnerDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueTrend: 0,
    activeMembers: 0,
    activeMembersTrend: 0,
    totalRooms: 0,
    operationalBills: 0,
    operationalBillsTrend: 0,
    chartData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/owner-dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error("Failed to fetch dashboard stats");
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Monthly Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          trend={{
            value: stats.revenueTrend,
            label: "from last month",
            positive: stats.revenueTrend >= 0,
          }}
          description="from last month"
        />
        <StatCard
          title="Active Members"
          value={`+${stats.activeMembers}`}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          trend={{
            value: stats.activeMembersTrend,
            label: "from last month",
            positive: stats.activeMembersTrend >= 0,
          }}
          description="from last month"
        />
        <StatCard
          title="Boarding Rooms"
          value={stats.totalRooms.toString()}
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
          description="Total active rooms"
        />
        <StatCard
          title="Operational Bills"
          value={formatCurrency(stats.operationalBills)}
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          trend={{
            value: stats.operationalBillsTrend,
            label: "from last month",
            positive: stats.operationalBillsTrend <= 0, // Lower bills is usually positive, but let's stick to trend direction
          }}
          description="from last month"
        />
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RevenueChart data={stats.chartData} />
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
