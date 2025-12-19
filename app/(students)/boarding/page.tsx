"use client";

import React, { useState } from "react";
import { differenceInDays, isSameDay } from "date-fns";
import { Button } from "../../_components/Button";
import {
    Calendar as CalendarIcon,
    CreditCard,
    DollarSign,
    History,
    LogIn,
    LogOut,
} from "lucide-react";
import BillingCard from "../../_components/boarding/BillingCard";
import StayStatusIndicator from "../../_components/boarding/StayStatusIndicator";
import BillingHistoryChart from "../../_components/boarding/BillingHistoryChart";
import { Calendar } from "../../_components/boarding/Calendar";

type BillingData = {
    month: string;
    amount: number;
};

type StayRecord = {
    start: Date;
    end?: Date;
};

const BILLING_HISTORY: BillingData[] = [
    { month: "Jan", amount: 15000 },
    { month: "Feb", amount: 15500 },
    { month: "Mar", amount: 15000 },
    { month: "Apr", amount: 16000 },
    { month: "May", amount: 15000 },
    { month: "Jun", amount: 14500 },
];

export default function BoardingPage() {
    const [isAtBoarding, setIsAtBoarding] = useState(false);
    const [lastArrival, setLastArrival] = useState<Date | null>(
        null as Date | null
    );


    const [stayHistory, setStayHistory] = useState<StayRecord[]>([
        { start: new Date(2025, 11, 1), end: new Date(2025, 11, 5) },
        { start: new Date(2025, 11, 10), end: new Date(2025, 11, 15) },
    ]);
    const handleToggleStay = () => {
        if (isAtBoarding) {
            if (lastArrival) {
                setStayHistory([
                    ...stayHistory,
                    { start: lastArrival, end: new Date() },
                ]);
            }
            setIsAtBoarding(false);
            setLastArrival(null);
        } else {
            setIsAtBoarding(true);
            setLastArrival(new Date());
        }
    };

    const currentStayDuration =
        isAtBoarding && lastArrival ? differenceInDays(new Date(), lastArrival) : 0;

    return (
        <div className="p-8 min-h-screen bg-background space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-textPrimary">
                        My Boarding
                    </h1>
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
                currentStayDuration={currentStayDuration}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <BillingCard
                    title="Next Payment"
                    value="Dec 15, 2025"
                    subtitle="5 days left"
                    icon={<CalendarIcon className="text-blue-600" size={24} />}
                    colorClass="border-borderPrimary"
                />
                <BillingCard
                    title="Upcoming Bill"
                    value="LKR 15,000"
                    icon={<DollarSign className="text-purple-600" size={24} />}
                    colorClass="border-borderPrimary"
                />
                <BillingCard
                    title="Previous Bill"
                    value="LKR 14,500"
                    subtitle="Paid"
                    icon={<History className="text-orange-600" size={24} />}
                    colorClass="border-borderPrimary"
                />
                <BillingCard
                    title="Total Due"
                    value="LKR 0.00"
                    icon={<CreditCard className="text-pink-600" size={24} />}
                    colorClass="border-borderPrimary"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Billing Chart */}
                <BillingHistoryChart data={BILLING_HISTORY} />

                {/* Stay Calendar */}

                <div className="bg-backgroundSecondary p-6 rounded-2xl border border-borderPrimary shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-textPrimary mb-6">
                        Stay Calendar
                    </h3>
                    <div className="flex justify-center">
                        <Calendar
                            defaultMonth={new Date()}
                            modifiers={{
                                range_start: [
                                    ...stayHistory.map((s) => s.start),
                                    ...(isAtBoarding && lastArrival ? [lastArrival] : []),
                                ],
                                range_end: [
                                    ...stayHistory.map((s) => s.end || s.start),
                                    ...(isAtBoarding && lastArrival ? [new Date()] : []),
                                ],
                                range_middle: [
                                    ...stayHistory.map((s) => ({
                                        after: s.start,
                                        before: s.end || s.start,
                                    })),
                                    ...(isAtBoarding && lastArrival
                                        ? [{ after: lastArrival, before: new Date() }]
                                        : []),
                                ],
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
