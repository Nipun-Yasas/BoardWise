import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import Boarding from "@/models/Boarding";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

// GET: Fetch single room
export async function GET(
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
    const room = await Room.findById(id).lean();

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Verify boarding belongs to user
    const boarding = await Boarding.findOne({
      _id: room.boardingId,
      ownerId: session.userId,
    });

    if (!boarding) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(
      {
        id: room._id.toString(),
        boardingId: room.boardingId.toString(),
        name: room.name,
        capacity: room.capacity,
        price: room.price,
        description: room.description,
        images: room.images,
        isAvailable: room.isAvailable,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch room error:", error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 },
    );
  }
}

// PATCH: Update single room
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

    const body = await request.json();
    const { id } = await params;

    const room = await Room.findById(id);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Verify boarding belongs to user
    const boarding = await Boarding.findOne({
      _id: room.boardingId,
      ownerId: session.userId,
    });

    if (!boarding) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    return NextResponse.json(
      {
        success: true,
        room: {
          id: updatedRoom._id.toString(),
          boardingId: updatedRoom.boardingId.toString(),
          name: updatedRoom.name,
          capacity: updatedRoom.capacity,
          price: updatedRoom.price,
          description: updatedRoom.description,
          images: updatedRoom.images,
          isAvailable: updatedRoom.isAvailable,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update room error:", error);
    return NextResponse.json(
      { error: "Failed to update room" },
      { status: 500 },
    );
  }
}

// DELETE: Delete a room
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

    const room = await Room.findById(id);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Verify boarding belongs to user
    const boarding = await Boarding.findOne({
      _id: room.boardingId,
      ownerId: session.userId,
    });

    if (!boarding) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await Room.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Room deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete room error:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 },
    );
  }
}

export {};
