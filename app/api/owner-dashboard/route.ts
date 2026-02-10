import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import Boarding from "@/models/Boarding";
import MonthlyBill from "@/models/MonthlyBill";
import RentPayment from "@/models/RentPayment";
import Room from "@/models/Room";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerId = new mongoose.Types.ObjectId(session.userId as string);

    // 1. Get Boarding IDs and Room IDs in parallel
    const boardings = await Boarding.find({ ownerId: session.userId })
      .select("_id")
      .lean();
    const boardingIds = boardings.map((b) => b._id);

    const rooms = await Room.find({ boardingId: { $in: boardingIds } })
      .select("_id")
      .lean();
    const roomIds = rooms.map((r) => r._id);
    const totalRooms = rooms.length;

    // 2. Define time ranges
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth(); // 0-11

    // Month string format: "YYYY-MM"
    const currentMonthStr = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, "0")}`;

    // Previous Month for Trend Calculation
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, "0")}`;

    // 3. Aggregation for Active Members (Proxy: Occupied Rooms? Or just 0 as before)
    // Sticking to 0 as per previous logic for now
    const activeMembers = 0;

    // 4. Parallel Aggregations for Financials
    // We need:
    // - Total Revenue (Current Month) - from both MonthlyBill AND RentPayment
    // - Total Revenue (Previous Month) -> for Trend
    // - Operational Bills (Current Month)
    // - Operational Bills (Previous Month) -> for Trend
    // - Yearly Revenue Chart Data

    const [financialStats, rentPaymentStats, chartDataRaw, chartDataRent] =
      await Promise.all([
        // Aggregation 1: Current & Previous Month Stats (MonthlyBill)
        MonthlyBill.aggregate([
          {
            $match: {
              roomId: { $in: roomIds },
              month: { $in: [currentMonthStr, prevMonthStr] },
            },
          },
          {
            $lookup: {
              from: "billamounts",
              localField: "_id",
              foreignField: "monthlyBillId",
              as: "amounts",
            },
          },
          {
            $unwind: {
              path: "$amounts",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: {
                month: "$month",
                isPaid: "$isPaid",
              },
              totalAmount: { $sum: "$amounts.amount" },
            },
          },
        ]),

        // Aggregation 2: RentPayment Stats (Current & Previous Month)
        RentPayment.aggregate([
          {
            $match: {
              roomId: { $in: roomIds },
              month: { $in: [currentMonthStr, prevMonthStr] },
              isPaid: true,
            },
          },
          {
            $group: {
              _id: "$month",
              totalRentRevenue: { $sum: "$rentAmount" },
            },
          },
        ]),

        // Aggregation 3: Yearly Revenue Chart (MonthlyBill)
        MonthlyBill.aggregate([
          {
            $match: {
              roomId: { $in: roomIds },
              isPaid: true, // Revenue only counts paid bills
              month: { $regex: `^${currentYear}-` }, // Starts with YYYY-
            },
          },
          {
            $lookup: {
              from: "billamounts",
              localField: "_id",
              foreignField: "monthlyBillId",
              as: "amounts",
            },
          },
          {
            $unwind: "$amounts",
          },
          {
            $group: {
              _id: "$month", // Group by YYYY-MM
              totalRevenue: { $sum: "$amounts.amount" },
            },
          },
        ]),

        // Aggregation 4: Yearly Rent Revenue Chart (RentPayment)
        RentPayment.aggregate([
          {
            $match: {
              roomId: { $in: roomIds },
              isPaid: true,
              month: { $regex: `^${currentYear}-` }, // Starts with YYYY-
            },
          },
          {
            $group: {
              _id: "$month",
              totalRentRevenue: { $sum: "$rentAmount" },
            },
          },
        ]),
      ]);

    // Process Financial Stats
    let currentRev = 0;
    let prevRev = 0;
    let currentOps = 0;
    let prevOps = 0;

    financialStats.forEach((stat) => {
      const isCurrent = stat._id.month === currentMonthStr;
      const isPrev = stat._id.month === prevMonthStr;
      const amount = stat.totalAmount || 0;

      if (isCurrent) {
        currentOps += amount; // All bills generated are operational costs/receivables
        if (stat._id.isPaid) currentRev += amount;
      } else if (isPrev) {
        prevOps += amount;
        if (stat._id.isPaid) prevRev += amount;
      }
    });

    // Add RentPayment Revenue (current and previous month)
    rentPaymentStats.forEach((stat) => {
      if (stat._id === currentMonthStr) {
        currentRev += stat.totalRentRevenue || 0;
      } else if (stat._id === prevMonthStr) {
        prevRev += stat.totalRentRevenue || 0;
      }
    });

    // Calculate Trends
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const revenueTrend = calculateTrend(currentRev, prevRev);
    const operationalBillsTrend = calculateTrend(currentOps, prevOps);

    // Process Chart Data (combine MonthlyBill + RentPayment revenue)
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const chartData = months.map((name, index) => {
      const monthStr = `${currentYear}-${String(index + 1).padStart(2, "0")}`;
      const billRevenue =
        chartDataRaw.find((d) => d._id === monthStr)?.totalRevenue || 0;
      const rentRevenue =
        chartDataRent.find((d) => d._id === monthStr)?.totalRentRevenue || 0;
      return {
        name,
        total: billRevenue + rentRevenue,
      };
    });

    return NextResponse.json(
      {
        totalRevenue: currentRev,
        revenueTrend,
        activeMembers,
        activeMembersTrend: 0,
        totalRooms,
        operationalBills: currentOps,
        operationalBillsTrend,
        chartData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}
