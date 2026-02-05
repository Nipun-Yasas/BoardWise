"use server";

import connectDB from "@/lib/db";
import BoardingHouse from "@/models/BoardingHouse";
import Room from "@/models/Room";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import Expense from "@/models/Expense";
import { getSession } from "@/lib/auth";

export async function getOwnerDashboardData() {
  await connectDB();
  const session = await getSession();

  if (!session || !session.userId) {
    throw new Error("Unauthorized");
  }

  const userId = session.userId;

  // 1. Get Boarding Houses owned by the user
  const boardingHouses = await BoardingHouse.find({ owner: userId });
  const boardingHouseIds = boardingHouses.map((bh) => bh._id);

  // 2. Count Total Rooms
  const roomCount = await Room.countDocuments({
    boardingHouse: { $in: boardingHouseIds },
  });

  // 3. Count Active Members (Active Bookings)
  const rooms = await Room.find({ boardingHouse: { $in: boardingHouseIds } });
  const roomIds = rooms.map((r) => r._id);

  const activeMembersCount = await Booking.countDocuments({
    room: { $in: roomIds },
    status: "Active",
  });

  // 4. Calculate Current Month Revenue
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Find bookings related to these rooms
  const bookings = await Booking.find({ room: { $in: roomIds } });
  const bookingIds = bookings.map((b) => b._id);

  const currentMonthRevenueResult = await Payment.aggregate([
    {
      $match: {
        booking: { $in: bookingIds },
        status: "Completed",
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const currentMonthRevenue = currentMonthRevenueResult[0]?.total || 0;

  // 5. Calculate Operational Bills (Expenses)
  const currentMonthExpensesResult = await Expense.aggregate([
    {
      $match: {
        boardingHouse: { $in: boardingHouseIds },
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const currentMonthExpenses = currentMonthExpensesResult[0]?.total || 0;

  // 6. Get Revenue Chart Data (Last 6 Months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const revenueChartData = await Payment.aggregate([
    {
      $match: {
        booking: { $in: bookingIds },
        status: "Completed",
        date: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$date" }, year: { $year: "$date" } },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Format friendly data for the chart
  const formattedChartData = revenueChartData.map((item) => {
    const date = new Date(item._id.year, item._id.month - 1);
    return {
      name: date.toLocaleString("default", { month: "short" }),
      total: item.total,
    };
  });

  return {
    roomCount,
    activeMembersCount,
    currentMonthRevenue,
    currentMonthExpenses,
    revenueChartData: formattedChartData,
  };
}