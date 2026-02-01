import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import BillType from "@/models/BillType";
import Boarding from "@/models/Boarding";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

// DELETE: Delete a bill type
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
    console.log("Deleting bill type:", id);

    const billType = await BillType.findById(id);

    if (!billType) {
      return NextResponse.json(
        { error: "Bill type not found" },
        { status: 404 },
      );
    }

    // Verify room belongs to user's boarding
    const room = await Room.findById(billType.roomId);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const boarding = await Boarding.findOne({
      _id: room.boardingId,
      ownerId: session.userId,
    });

    if (!boarding) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await BillType.findByIdAndDelete(id);

    console.log("Deleted bill type:", id);

    return NextResponse.json(
      { success: true, message: "Bill type deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete bill type error:", error);
    return NextResponse.json(
      { error: "Failed to delete bill type" },
      { status: 500 },
    );
  }
}

export {};
