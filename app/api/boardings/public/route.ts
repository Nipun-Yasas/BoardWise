import connectDB from "@/lib/db";
import Boarding from "@/models/Boarding";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  try {
    // Optimized Aggregation Pipeline
    const boardingsWithStats = await Boarding.aggregate([
      // 1. Join with Rooms
      {
        $lookup: {
          from: "rooms",
          localField: "_id",
          foreignField: "boardingId",
          as: "rooms",
        },
      },
      // 2. Project only needed fields and calculate simple stats if possible,
      //    or just return the joined data for JS processing (easier for complex logic)
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          mainImage: 1,
          nearestUniversity: 1,
          city: 1,
          distanceFromUniversity: 1,
          address: 1,
          totalRooms: 1,
          rooms: {
            price: 1,
            capacity: 1,
            isAvailable: 1,
            tenants: 1,
            gender: 1,
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    // Process the results efficiently in memory (one pass)
    const formattedBoardings = boardingsWithStats.map((boarding) => {
      const rooms = boarding.rooms || [];

      // Logic: Filter manually available rooms
      const availableRooms = rooms.filter((r: any) => {
        const occupied = r.tenants?.length || 0;
        const capacity = r.capacity || 0;
        // Room is available AND has valid capacity > occupied
        return r.isAvailable !== false && occupied < capacity;
      });

      // Min Price calculation
      const prices = (availableRooms.length > 0 ? availableRooms : rooms).map(
        (r: any) => r.price,
      );
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

      // Total Available Slots calculation
      const totalAvailableSlots = rooms.reduce((acc: number, room: any) => {
        const occupied = room.tenants?.length || 0;
        const capacity = room.capacity || 0;
        const available =
          room.isAvailable !== false ? Math.max(0, capacity - occupied) : 0;
        return acc + available;
      }, 0);

      // Gender Logic
      const genders = rooms.map((r: any) => r.gender || "Male");
      const hasMale = genders.includes("Male");
      const hasFemale = genders.includes("Female");
      let gender = "Male";
      if (hasMale && hasFemale) {
        gender = "Mixed";
      } else if (hasFemale) {
        gender = "Female";
      }

      return {
        id: boarding._id.toString(),
        title: boarding.name,
        university: boarding.nearestUniversity || boarding.city || "Unknown",
        distance: boarding.distanceFromUniversity || 0,
        rental: minPrice,
        persons: totalAvailableSlots,
        imageUrl:
          boarding.mainImage ||
          "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: boarding.description,
        address: boarding.address,
        totalRooms: boarding.totalRooms,
        gender,
      };
    });

    return NextResponse.json(formattedBoardings, { status: 200 });
  } catch (error) {
    console.error("Fetch local boardings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch boardings" },
      { status: 500 },
    );
  }
}
