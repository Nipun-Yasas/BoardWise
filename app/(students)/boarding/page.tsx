"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Button } from "../../_components/Button";
import {
    Calendar as CalendarIcon,
    CreditCard,
    DollarSign,
    History,
    LogIn,
    LogOut,
    Loader2,
} from "lucide-react";
import BillingCard from "../../_components/boarding/BillingCard";
import StayStatusIndicator from "../../_components/boarding/StayStatusIndicator";
import BillingHistoryChart from "../../_components/boarding/BillingHistoryChart";
import { Calendar } from "../../_components/boarding/Calendar";

export default function BoardingPage() {
    const [loading, setLoading] = useState(true);
    const [statusData, setStatusData] = useState<any>(null);
    const [summaryData, setSummaryData] = useState<any>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statusRes, summaryRes] = await Promise.all([
                axiosInstance.get("/boarding/status"),
                axiosInstance.get("/boarding/summary"),
            ]);
            setStatusData(statusRes.data);
            setSummaryData(summaryRes.data);
        } catch (error) {
            console.error("Failed to fetch boarding data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleStay = async () => {
        try {
            const newStatus =
                statusData?.status === "boarding" ? "away" : "boarding";
            await axiosInstance.post("/boarding/status", { status: newStatus });
            await fetchData();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    if (loading && !statusData) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="animate-spin text-zinc-500" size={32} />
            </div>
        );
    }

    const isAtBoarding = statusData?.status === "boarding";
    const currentMonthData = summaryData?.currentMonth || {};
    const previousMonthData = summaryData?.previousMonth;
    const profile = summaryData?.profile;

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: profile?.currency || "LKR",
        }).format(amount || 0);
    };

    // Convert chart data from API to Recharts format expected by BillingHistoryChart
    const chartData = summaryData?.chartData?.map((item: any) => ({
        month: item.month,
        amount: item.amount
    })) || [];

    // Prepare Calendar modifiers
    const stayedDates = currentMonthData.stayedDates || [];
    const year = currentMonthData.year || new Date().getFullYear();
    const month = currentMonthData.month || new Date().getMonth() + 1;

    const stayedDateObjects = stayedDates.map(
        (day: number) => new Date(year, month - 1, day)
    );

    // Determine Next Payment Date (Example: 5th of next month)
    const nextPaymentDate = new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    nextPaymentDate.setDate(5);

    return (
        <div className="p-8 min-h-screen bg-background space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-textPrimary">My Boarding</h1>
                    <p className="text-textSecondary mt-1">
                        Manage your stay and billing details
                    </p>
                </div>

                <Button
                    onClick={handleToggleStay}
                    frontIcon={isAtBoarding ? <LogOut size={20} /> : <LogIn size={20} />}
                >
                    {isAtBoarding ? "Check Out" : "Check In"}
                </Button>
            </div>

            <StayStatusIndicator
                isAtBoarding={isAtBoarding}
                currentStayDuration={stayedDates.length} // Showing total days this month as duration/usage
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <BillingCard
                    title="Next Payment"
                    value={nextPaymentDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                    subtitle="Estimated"
                    icon={<CalendarIcon className="text-blue-600" size={24} />}
                    colorClass="border-borderPrimary"
                />
                <BillingCard
                    title="Upcoming Bill"
                    value={formatCurrency(profile?.baseRent)} // Using base rent as estimate
                    icon={<DollarSign className="text-purple-600" size={24} />}
                    colorClass="border-borderPrimary"
                />
                <BillingCard
                    title="Previous Bill"
                    value={previousMonthData ? formatCurrency(previousMonthData.totalAmount) : "-"}
                    subtitle={previousMonthData ? "Recorded" : "No history"}
                    icon={<History className="text-orange-600" size={24} />}
                    colorClass="border-borderPrimary"
                />
                <BillingCard
                    title="Total Due"
                    value={formatCurrency(0)} // Placeholder, could be derived from pending payments
                    icon={<CreditCard className="text-pink-600" size={24} />}
                    colorClass="border-borderPrimary"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Billing Chart */}
                <BillingHistoryChart data={chartData} />

                {/* Stay Calendar */}
                <div className="bg-backgroundSecondary p-6 rounded-2xl border border-borderPrimary shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-textPrimary mb-6">
                        Stay Calendar
                    </h3>
                    <div className="flex justify-center">
                        <Calendar
                            defaultMonth={new Date()}
                            modifiers={{
                                booked: stayedDateObjects, // Using 'booked' styled in Calendar component or we can pass styles
                            }}
                            // If the Calendar component supports tailored modifiers, adaptation might be needed.
                            // The original file used range_start, range_end etc.
                            // Let's assume standard DayPicker behaviour or the custom component handles it.
                            // Inspecting Calendar.tsx would be ideal but for now we try standard modifiers.
                            // Actually, the original used specific modifiers for ranges. 
                            // I will pass 'booked' and hope generic styling applied or I might need to adjust Calendar.tsx if it's strict.
                            modifiersStyles={{
                                booked: {
                                    backgroundColor: 'var(--primary)', // Assuming CSS variable exists
                                    color: 'white',
                                    borderRadius: '50%'
                                }
                            }}
                            className="rounded-md border border-borderPrimary"
                        />
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-textSecondary">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span>Stayed Dates</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
