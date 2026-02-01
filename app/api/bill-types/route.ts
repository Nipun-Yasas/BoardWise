import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import BillType from "@/models/BillType";
import Room from "@/models/Room";
import Boarding from "@/models/Boarding";
import { NextResponse } from "next/server";

// GET: Fetch all bill types for a room
export async function GET(request: Request) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      );
    }

    // Verify room belongs to user's boarding
    const room = await Room.findById(roomId);
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

    const billTypes = await BillType.find({ roomId }).sort({ createdAt: 1 }).lean();

    const formattedBillTypes = billTypes.map((bt) => ({
      id: bt._id.toString(),
      name: bt.name,
    }));

    return NextResponse.json(formattedBillTypes, { status: 200 });
  } catch (error) {
    console.error("Fetch bill types error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bill types" },
      { status: 500 }
    );
  }
}

// POST: Create a new bill type
export async function POST(request: Request) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { roomId, name } = body;

    console.log("Creating bill type:", { roomId, name });

    if (!roomId || !name) {
      return NextResponse.json(
        { error: "Room ID and name are required" },
        { status: 400 }
      );
    }

    // Verify room belongs to user's boarding
    const room = await Room.findById(roomId);
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

    // Create bill type
    const billType = await BillType.create({
      roomId,
      name,
    });

    console.log("Created bill type:", billType);

    return NextResponse.json(
      {
        success: true,
        billType: {
          id: billType._id.toString(),
          name: billType.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create bill type error:", error);
    return NextResponse.json(
      { error: "Failed to create bill type" },
      { status: 500 }
    );
  }
}

export {};
