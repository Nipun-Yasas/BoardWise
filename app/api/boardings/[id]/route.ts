import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import BillAmount from "@/models/BillAmount";
import BillType from "@/models/BillType";
import Boarding from "@/models/Boarding";
import MonthlyBill from "@/models/MonthlyBill";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

// PUT: Update boarding
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, mainImage, totalRooms } = body;

    console.log("Updating boarding:", id, "with data:", {
      name,
      description,
      mainImage,
      totalRooms,
    });
    console.log("User ID:", session.userId);

    // Find and update boarding
    const boarding = await Boarding.findOneAndUpdate(
      { _id: id, ownerId: session.userId },
      { name, description, mainImage, totalRooms: totalRooms || 0 },
      { new: true, runValidators: true },
    );

    console.log("Found boarding:", boarding);

    if (!boarding) {
      return NextResponse.json(
        { error: "Boarding not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        boarding: {
          id: boarding._id.toString(),
          name: boarding.name,
          description: boarding.description,
          mainImage: boarding.mainImage,
          totalRooms: boarding.totalRooms || 0,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update boarding error:", error);
    return NextResponse.json(
      { error: "Failed to update boarding" },
      { status: 500 },
    );
  }
}

// DELETE: Delete boarding (cascade delete rooms, bill types, bills)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find boarding
    const boarding = await Boarding.findOne({
      _id: id,
      ownerId: session.userId,
    });

    if (!boarding) {
      return NextResponse.json(
        { error: "Boarding not found" },
        { status: 404 },
      );
    }

    // Get all rooms in this boarding
    const rooms = await Room.find({ boardingId: id });
    const roomIds = rooms.map((room) => room._id);

    // Delete all bill types for these rooms
    const billTypes = await BillType.find({ roomId: { $in: roomIds } });
    const billTypeIds = billTypes.map((bt) => bt._id);

    // Delete all monthly bills for these rooms
    const monthlyBills = await MonthlyBill.find({ roomId: { $in: roomIds } });
    const monthlyBillIds = monthlyBills.map((mb) => mb._id);

    // Delete all bill amounts
    await BillAmount.deleteMany({ monthlyBillId: { $in: monthlyBillIds } });

    // Delete all monthly bills
    await MonthlyBill.deleteMany({ roomId: { $in: roomIds } });

    // Delete all bill types
    await BillType.deleteMany({ roomId: { $in: roomIds } });

    // Delete all rooms
    await Room.deleteMany({ boardingId: id });

    // Finally delete the boarding
    await Boarding.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Boarding deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete boarding error:", error);
    return NextResponse.json(
      { error: "Failed to delete boarding" },
      { status: 500 },
    );
  }
}

export {};
