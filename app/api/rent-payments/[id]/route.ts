import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import Boarding from "@/models/Boarding";
import Room from "@/models/Room";
import RentPayment from "@/models/RentPayment";
import { NextResponse } from "next/server";

// PATCH: Update rent payment status
export async function PATCH(
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
    const { isPaid, paidDate, notes } = await request.json();

    // Find rent payment
    const rentPayment = await RentPayment.findById(id).populate("roomId");

    if (!rentPayment) {
      return NextResponse.json(
        { error: "Rent payment not found" },
        { status: 404 },
      );
    }

    // Verify ownership
    const room = await Room.findById(rentPayment.roomId).populate("boardingId");
    const boarding = await Boarding.findOne({
      _id: room.boardingId,
      ownerId: session.userId,
    });

    if (!boarding) {
      return NextResponse.json(
        { error: "Unauthorized to update this payment" },
        { status: 403 },
      );
    }

    // Update payment
    rentPayment.isPaid = isPaid;
    if (isPaid) {
      rentPayment.paidDate = paidDate || new Date();
    } else {
      rentPayment.paidDate = null;
    }
    if (notes !== undefined) {
      rentPayment.notes = notes;
    }

    await rentPayment.save();

    const updated = await rentPayment.populate(
      "tenantId",
      "name email mobile_number",
    );

    return NextResponse.json(
      { success: true, rentPayment: updated },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update rent payment error:", error);
    return NextResponse.json(
      { error: "Failed to update rent payment" },
      { status: 500 },
    );
  }
}
