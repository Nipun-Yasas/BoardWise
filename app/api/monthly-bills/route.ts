import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import BillAmount from "@/models/BillAmount";
import Boarding from "@/models/Boarding";
import MonthlyBill from "@/models/MonthlyBill";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

// GET: Fetch monthly bills for rooms
export async function GET(request: Request) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const boardingId = searchParams.get("boardingId");
    const month = searchParams.get("month");

    if (!boardingId) {
      return NextResponse.json(
        { error: "Boarding ID is required" },
        { status: 400 },
      );
    }

    // Verify boarding belongs to user
    const boarding = await Boarding.findOne({
      _id: boardingId,
      ownerId: session.userId,
    });

    if (!boarding) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get all rooms for this boarding
    const rooms = await Room.find({ boardingId }).lean();
    const roomIds = rooms.map((r) => r._id);

    // Build query
    const query: any = { roomId: { $in: roomIds } };
    if (month) {
      query.month = month;
    }

    // Fetch monthly bills
    const monthlyBills = await MonthlyBill.find(query).lean();

    // Fetch bill amounts for these monthly bills
    const monthlyBillIds = monthlyBills.map((mb) => mb._id);
    const billAmounts = await BillAmount.find({
      monthlyBillId: { $in: monthlyBillIds },
    }).lean();

    // Format response
    const formattedBills = monthlyBills.map((mb) => {
      const amounts = billAmounts.filter(
        (ba) => ba.monthlyBillId.toString() === mb._id.toString(),
      );

      const bills: Record<string, number> = {};
      amounts.forEach((amt) => {
        bills[amt.billTypeId.toString()] = amt.amount;
      });

      return {
        roomId: mb.roomId.toString(),
        month: mb.month,
        bills,
        dueDate: mb.dueDate.toISOString().split("T")[0],
        isPaid: mb.isPaid,
      };
    });

    return NextResponse.json(formattedBills, { status: 200 });
  } catch (error) {
    console.error("Fetch monthly bills error:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly bills" },
      { status: 500 },
    );
  }
}

// POST: Save monthly bills (create or update)
export async function POST(request: Request) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bills } = body;

    console.log("Saving monthly bills:", bills);

    if (!Array.isArray(bills)) {
      return NextResponse.json(
        { error: "Bills array is required" },
        { status: 400 },
      );
    }

    const savedBills = [];

    for (const billData of bills) {
      const { roomId, month, bills: billAmounts, dueDate } = billData;

      // Verify room belongs to user's boarding
      const room = await Room.findById(roomId);
      if (!room) continue;

      const boarding = await Boarding.findOne({
        _id: room.boardingId,
        ownerId: session.userId,
      });

      if (!boarding) continue;

      // Create or update monthly bill
      let monthlyBill = await MonthlyBill.findOne({ roomId, month });

      if (monthlyBill) {
        // Update existing
        monthlyBill.dueDate = new Date(dueDate);
        await monthlyBill.save();
      } else {
        // Create new
        monthlyBill = await MonthlyBill.create({
          roomId,
          month,
          dueDate: new Date(dueDate),
        });
      }

      // Update bill amounts
      for (const [billTypeId, amount] of Object.entries(billAmounts)) {
        await BillAmount.findOneAndUpdate(
          {
            monthlyBillId: monthlyBill._id,
            billTypeId,
          },
          {
            amount: amount as number,
          },
          {
            upsert: true,
            new: true,
          },
        );
      }

      savedBills.push({
        roomId: monthlyBill.roomId.toString(),
        month: monthlyBill.month,
        dueDate: monthlyBill.dueDate.toISOString().split("T")[0],
      });
    }

    console.log("Saved bills:", savedBills);

    return NextResponse.json(
      { success: true, bills: savedBills },
      { status: 200 },
    );
  } catch (error) {
    console.error("Save monthly bills error:", error);
    return NextResponse.json(
      { error: "Failed to save monthly bills" },
      { status: 500 },
    );
  }
}

export {};
