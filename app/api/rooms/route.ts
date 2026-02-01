import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import BillType from "@/models/BillType";
import Boarding from "@/models/Boarding";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

// GET: Fetch all rooms for a boarding
export async function GET(request: Request) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const boardingId = searchParams.get("boardingId");

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
      return NextResponse.json(
        { error: "Boarding not found or unauthorized" },
        { status: 404 },
      );
    }

    const rooms = await Room.find({ boardingId })
      .sort({ createdAt: -1 })
      .lean();

    const formattedRooms = rooms.map((room) => ({
      id: room._id.toString(),
      boardingId: room.boardingId.toString(),
      name: room.name,
      capacity: room.capacity,
      price: room.price,
      description: room.description,
      images: room.images,
      isAvailable: room.isAvailable,
    }));

    return NextResponse.json(formattedRooms, { status: 200 });
  } catch (error) {
    console.error("Fetch rooms error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 },
    );
  }
}

// POST: Create a new room
export async function POST(request: Request) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { boardingId, name, capacity, price, description, images } = body;

    console.log("Creating room with data:", {
      boardingId,
      name,
      capacity,
      price,
      description,
      images,
    });

    // Verify boarding belongs to user
    const boarding = await Boarding.findOne({
      _id: boardingId,
      ownerId: session.userId,
    });

    if (!boarding) {
      return NextResponse.json(
        { error: "Boarding not found or unauthorized" },
        { status: 404 },
      );
    }

    // Create room
    const room = await Room.create({
      boardingId,
      name,
      capacity,
      price,
      description: description || "",
      images: images || [],
    });

    console.log("Created room:", room);

    // Create default bill types (Electricity and Water)
    const defaultBillTypes = ["Electricity", "Water"];
    const createdBillTypes = [];

    for (const billTypeName of defaultBillTypes) {
      const billType = await BillType.create({
        roomId: room._id,
        name: billTypeName,
      });
      createdBillTypes.push({
        id: billType._id.toString(),
        name: billType.name,
      });
    }

    console.log("Created default bill types:", createdBillTypes);

    return NextResponse.json(
      {
        success: true,
        room: {
          id: room._id.toString(),
          boardingId: room.boardingId.toString(),
          name: room.name,
          capacity: room.capacity,
          price: room.price,
          description: room.description,
          images: room.images,
          isAvailable: room.isAvailable,
          billTypes: createdBillTypes,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create room error:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 },
    );
  }
}

// PUT: Update multiple rooms
export async function PUT(request: Request) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { rooms } = body;

    console.log("Updating rooms:", rooms);

    if (!Array.isArray(rooms)) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 },
      );
    }

    const updatedRooms = [];

    for (const roomData of rooms) {
      const { id, boardingId, name, capacity, price, description, images } =
        roomData;

      // Verify boarding belongs to user
      const boarding = await Boarding.findOne({
        _id: boardingId,
        ownerId: session.userId,
      });

      if (!boarding) {
        console.log(`Skipping room ${id} - unauthorized`);
        continue;
      }

      const room = await Room.findByIdAndUpdate(
        id,
        {
          name,
          capacity,
          price,
          description,
          images,
        },
        { new: true, runValidators: true },
      ).lean();

      if (room) {
        updatedRooms.push({
          id: room._id.toString(),
          boardingId: room.boardingId.toString(),
          name: room.name,
          capacity: room.capacity,
          price: room.price,
          description: room.description,
          images: room.images,
          isAvailable: room.isAvailable,
        });
      }
    }

    console.log("Updated rooms:", updatedRooms);

    return NextResponse.json(
      { success: true, rooms: updatedRooms },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update rooms error:", error);
    return NextResponse.json(
      { error: "Failed to update rooms" },
      { status: 500 },
    );
  }
}

export {};
