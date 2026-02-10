import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import Boarding from "@/models/Boarding";
import Room from "@/models/Room";
import RentPayment from "@/models/RentPayment";
import { NextResponse } from "next/server";

// GET: Fetch rent payments for a room by month
export async function GET(request: Request) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");
    const month = searchParams.get("month");

    if (!roomId || !month) {
      return NextResponse.json(
        { error: "Room ID and month are required" },
        { status: 400 },
      );
    }

    // Verify ownership
    const room = await Room.findById(roomId).populate("boardingId");
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const boarding = await Boarding.findOne({
      _id: room.boardingId,
      ownerId: session.userId,
    });

    if (!boarding) {
      return NextResponse.json(
        { error: "Unauthorized to access this room" },
        { status: 403 },
      );
    }

    // Fetch rent payments for this room and month
    const rentPayments = await RentPayment.find({
      roomId,
      month,
    }).populate({
      path: "tenantId",
      select: "name email mobile_number",
      strictPopulate: false,
    });

    return NextResponse.json({ rentPayments }, { status: 200 });
  } catch (error) {
    console.error("Fetch rent payments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rent payments" },
      { status: 500 },
    );
  }
}

// POST: Create or update rent payments for a room
export async function POST(request: Request) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId, month } = await request.json();

    if (!roomId || !month) {
      return NextResponse.json(
        { error: "Room ID and month are required" },
        { status: 400 },
      );
    }

    // Verify ownership
    const room = await Room.findById(roomId).populate("boardingId");
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const boarding = await Boarding.findOne({
      _id: room.boardingId,
      ownerId: session.userId,
    });

    if (!boarding) {
      return NextResponse.json(
        { error: "Unauthorized to access this room" },
        { status: 403 },
      );
    }

    // Check if tenants exist
    if (!room.tenants || room.tenants.length === 0) {
      return NextResponse.json(
        { error: "Add tenants first" },
        { status: 400 },
      );
    }

    // Calculate rent per tenant
    const rentPerTenant = room.price / room.tenants.length;

    // Create or update rent payment records
    for (const tenantId of room.tenants) {
      const existingPayment = await RentPayment.findOne({
        roomId,
        tenantId,
        month,
      });

      if (!existingPayment) {
        const newPayment = new RentPayment({
          roomId: roomId,
          tenantId: tenantId,
          month,
          rentAmount: rentPerTenant,
          isPaid: false,
        });
        await newPayment.save();
      }
    }

    // Fetch populated records with better error handling
    const populatedRecords = await RentPayment.find({
      roomId,
      month,
    }).populate({
      path: "tenantId",
      select: "name email mobile_number",
      strictPopulate: false,
    });

    if (!populatedRecords || populatedRecords.length === 0) {
      return NextResponse.json(
        { success: true, rentPayments: [] },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: true, rentPayments: populatedRecords },
      { status: 200 },
    );
  } catch (error) {
    console.error("Create rent payments error:", error);
    return NextResponse.json(
      { error: "Failed to create rent payments" },
      { status: 500 },
    );
  }
}
