import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import BillType from "@/models/BillType";
import Boarding from "@/models/Boarding";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

// GET: Fetch all boardings for logged-in owner
export async function GET(request: Request) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch boardings with rooms
    const boardings = await Boarding.find({ ownerId: session.userId })
      .sort({ createdAt: -1 })
      .lean();

    // Fetch rooms for each boarding with bill types
    const boardingsWithRooms = await Promise.all(
      boardings.map(async (boarding) => {
        const rooms = await Room.find({ boardingId: boarding._id })
          .populate("tenants", "name email mobile_number")
          .lean();

        const roomsWithBillTypes = await Promise.all(
          rooms.map(async (room) => {
            const billTypes = await BillType.find({ roomId: room._id }).lean();
            return {
              id: room._id.toString(),
              boardingId: room.boardingId.toString(),
              name: room.name,
              capacity: room.capacity,
              price: room.price,
              description: room.description,
              images: room.images,
              tenants: room.tenants, // Return tenants
              billTypes: billTypes.map((bt) => ({
                id: bt._id.toString(),
                name: bt.name,
              })),
            };
          }),
        );

        return {
          id: boarding._id.toString(),
          name: boarding.name,
          description: boarding.description,
          mainImage: boarding.mainImage,
          totalRooms: boarding.totalRooms || 0,
          nearestUniversity: boarding.nearestUniversity || "",
          distanceFromUniversity: boarding.distanceFromUniversity || 0,
          rooms: roomsWithBillTypes,
        };
      }),
    );

    return NextResponse.json(boardingsWithRooms, { status: 200 });
  } catch (error) {
    console.error("Fetch boardings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch boardings" },
      { status: 500 },
    );
  }
}

// POST: Create new boarding
export async function POST(request: Request) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      mainImage,
      totalRooms,
      nearestUniversity,
      distanceFromUniversity,
    } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 },
      );
    }

    // Create boarding
    const boarding = await Boarding.create({
      ownerId: session.userId,
      name,
      description,
      mainImage: mainImage || null,
      totalRooms: totalRooms || 0,
      nearestUniversity: nearestUniversity || "",
      distanceFromUniversity: distanceFromUniversity || 0,
    });

    return NextResponse.json(
      {
        success: true,
        boarding: {
          id: boarding._id.toString(),
          name: boarding.name,
          description: boarding.description,
          mainImage: boarding.mainImage,
          totalRooms: boarding.totalRooms || 0,
          nearestUniversity: boarding.nearestUniversity || "",
          distanceFromUniversity: boarding.distanceFromUniversity || 0,
          rooms: [],
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create boarding error:", error);
    return NextResponse.json(
      { error: "Failed to create boarding" },
      { status: 500 },
    );
  }
}

export {};
