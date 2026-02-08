import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import BillAmount from "@/models/BillAmount";
import Boarding from "@/models/Boarding";
import MonthlyBill from "@/models/MonthlyBill";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    await connectDB();
    try {
        const session = await getSession();

        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Get all boardings for the owner
        const boardings = await Boarding.find({ ownerId: session.userId }).lean();
        const boardingIds = boardings.map((b) => b._id);

        // 2. Get all rooms for these boardings
        const rooms = await Room.find({ boardingId: { $in: boardingIds } }).lean();
        const roomIds = rooms.map((r) => r._id);
        const totalRooms = rooms.length;

        // 3. Get monthly bills for the current month AND year for charts
        // For "Active Members", we currently don't have a student assignment model. 
        // We will use 0 for now or maybe count rooms that have bills as a proxy?
        // Let's stick to 0 to be accurate to the schema limits.
        const activeMembers = 0;

        // Current Month calculations
        const now = new Date();
        const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        // Find bills for current month
        const currentMonthBills = await MonthlyBill.find({
            roomId: { $in: roomIds },
            month: currentMonthStr
        }).lean();

        const currentMonthBillIds = currentMonthBills.map(b => b._id);

        const currentMonthAmounts = await BillAmount.find({
            monthlyBillId: { $in: currentMonthBillIds }
        }).lean();

        // Operational Bills: Sum of all bills generated this month
        const operationalBills = currentMonthAmounts.reduce((sum, amt) => sum + (amt.amount || 0), 0);

        // Total Monthly Revenue: Sum of PAID bills + Rent? 
        // Since we can't track paid rent easily without students, we'll sum paid bills only for now.
        // Ideally this would include rent from occupied rooms.
        const paidBillIds = currentMonthBills.filter(b => b.isPaid).map(b => b._id);

        const revenueFromBills = await BillAmount.find({
            monthlyBillId: { $in: paidBillIds }
        }).lean();

        const totalRevenue = revenueFromBills.reduce((sum, amt) => sum + (amt.amount || 0), 0);

        // 4. Chart Data (Revenue over the last 6-12 months)
        // We can aggregate bills by month.
        const allBillsForRooms = await MonthlyBill.find({
            roomId: { $in: roomIds }
        }).lean();

        const allBillIds = allBillsForRooms.map(b => b._id);
        const allAmounts = await BillAmount.find({
            monthlyBillId: { $in: allBillIds }
        }).lean();

        // Group by month
        const revenueByMonth: Record<string, number> = {};
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Initialize with 0
        months.forEach(m => revenueByMonth[m] = 0);

        // Calculate actuals
        for (const bill of allBillsForRooms) {
            // bill.month is "YYYY-MM"
            // We need to check if it's the current year for the chart
            const [year, monthStr] = bill.month.split('-');
            if (parseInt(year) === now.getFullYear()) {
                const monthIndex = parseInt(monthStr) - 1;
                const monthName = months[monthIndex];

                // Should revenue include unpaid bills? Usually Revenue = Paid.
                // But for "Overview" sometimes generated invoices are counted (Accrual basis).
                // Let's go with Total Billed for now as it looks better than 0.
                // Or stick to isPaid for strict "Revenue". 
                // Let's use isPaid for Revenue.
                if (bill.isPaid) {
                    const amounts = allAmounts.filter(a => a.monthlyBillId.toString() === bill._id.toString());
                    const sum = amounts.reduce((s, a) => s + (a.amount || 0), 0);
                    revenueByMonth[monthName] += sum;
                }
            }
        }

        const chartData = months.map(name => ({
            name,
            total: revenueByMonth[name]
        }));

        return NextResponse.json({
            totalRevenue,
            revenueTrend: 0, // Need previous month data to calculate literal trend, leaving as 0 or TODO
            activeMembers,
            activeMembersTrend: 0,
            totalRooms,
            operationalBills,
            operationalBillsTrend: 0,
            chartData
        }, { status: 200 });

    } catch (error) {
        console.error("Fetch dashboard stats error:", error);
        return NextResponse.json(
            { error: "Failed to fetch dashboard stats" },
            { status: 500 },
        );
    }
}
