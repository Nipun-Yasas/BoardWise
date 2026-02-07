import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth";
import BoardingProfile from "@/models/BoardingProfile";
import BoardingMonth from "@/models/BoardingMonth";

export async function GET(req: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const now = new Date();
    const currentMonth = parseInt(searchParams.get("month") || (now.getMonth() + 1).toString());
    const currentYear = parseInt(searchParams.get("year") || now.getFullYear().toString());

    // Fetch Profile for base rent
    const profile = await BoardingProfile.findOne({ user: session.userId });
    if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Fetch Current Month Data
    let currentMonthData = await BoardingMonth.findOne({
        user: session.userId,
        month: currentMonth,
        year: currentYear,
    });

    // Calculate upcoming bill (Current Month)
    // Logic: Base Rent + Bills. 
    // If we want detailed daily calculation, we'd multiply days * daily_rate.
    // For now, assuming fixed monthly rent, or we can do pro-rated.
    // Let's assume pro-rated based on days stayed if needed, but the prompt says "Total days stayed on the month should be stored".
    // Let's return the raw data and let UI or a helper calculate defaults.

    let currentMonthObj;
    if (!currentMonthData) {
        currentMonthObj = {
            month: currentMonth,
            year: currentYear,
            stayedDates: [],
            extraBills: [],
            paymentStatus: 'pending'
        };
    } else {
        currentMonthObj = currentMonthData.toObject ? currentMonthData.toObject() : currentMonthData;
    }

    // Previous Bill (Last Month)
    const lastMonthDate = new Date(currentYear, currentMonth - 2, 1);
    const lastMonth = lastMonthDate.getMonth() + 1;
    const lastYear = lastMonthDate.getFullYear();

    const previousMonthData = await BoardingMonth.findOne({
        user: session.userId,
        month: lastMonth,
        year: lastYear
    });

    // Chart Data (Last 6 months)
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
        // current month - i
        // if i=0, current month
        // if i=5, 5 months ago
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const m = d.getMonth() + 1;
        const y = d.getFullYear();

        const monData = await BoardingMonth.findOne({ user: session.userId, month: m, year: y });
        chartData.push({
            month: d.toLocaleString('default', { month: 'short' }),
            amount: monData ? monData.totalAmount : 0,
            days: monData ? (monData.stayedDates || []).length : 0
        });
    }

    return NextResponse.json({
        profile: {
            baseRent: profile.baseRent,
            currency: profile.currency
        },
        currentMonth: {
            ...currentMonthObj,
            monthName: new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' })
        },
        previousMonth: previousMonthData ? {
            ...(previousMonthData.toObject ? previousMonthData.toObject() : previousMonthData),
            monthName: new Date(lastYear, lastMonth - 1).toLocaleString('default', { month: 'long' })
        } : null,
        chartData
    });
}
