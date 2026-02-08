import connectDB from "@/lib/db";
import Boarding from "@/models/Boarding";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  try {
    // Fetch all boardings
    const boardings = await Boarding.find({}).sort({ createdAt: -1 }).lean();

    // Fetch rooms for each boarding to calculate stats
    const boardingsWithStats = await Promise.all(
      boardings.map(async (boarding) => {
        const rooms = await Room.find({ boardingId: boarding._id }).lean();

        // Calculate stats
        // Filter available rooms (manually available AND has space)
        const availableRooms = rooms.filter(
          (r) =>
            r.isAvailable !== false && (r.tenants?.length || 0) < r.capacity,
        );

        const minPrice =
          availableRooms.length > 0
            ? Math.min(...availableRooms.map((r) => r.price))
            : rooms.length > 0
              ? Math.min(...rooms.map((r) => r.price))
              : 0; // Fallback to any room if none available

        // Capacity = Total available slots
        const totalAvailableSlots = rooms.reduce((acc, room) => {
          const occupied = room.tenants?.length || 0;
          const capacity = room.capacity || 0;
          const available =
            room.isAvailable !== false ? Math.max(0, capacity - occupied) : 0;
          return acc + available;
        }, 0);

        return {
          id: boarding._id.toString(),
          title: boarding.name,
          university: boarding.nearestUniversity || boarding.city || "Unknown", // Fallback to city as university
          distance: boarding.distanceFromUniversity || 0,
          rental: minPrice,
          persons: totalAvailableSlots, // Use AVAILABLE slots instead of total capacity
          imageUrl:
            boarding.mainImage ||
            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Default image if missing
          // keeping original fields just in case
          description: boarding.description,
          address: boarding.address,
          totalRooms: boarding.totalRooms,
        };
      }),
    );

    return NextResponse.json(boardingsWithStats, { status: 200 });
  } catch (error) {
    console.error("Fetch local boardings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch boardings" },
      { status: 500 },
    );
  }
}
