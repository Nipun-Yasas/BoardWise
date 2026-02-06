import connectDB from "@/lib/db";
import Boarding from "@/models/Boarding";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectDB();
    try {
        const { id } = await params;

        const boarding = await Boarding.findById(id).lean();

        if (!boarding) {
            return NextResponse.json(
                { error: "Boarding not found" },
                { status: 404 }
            );
        }

        const rooms = await Room.find({ boardingId: id }).lean();

        const boardingWithRooms = {
            id: boarding._id.toString(),
            title: boarding.name,
            description: boarding.description,
            university: boarding.city || "Unknown",
            address: boarding.address,
            mainImage: boarding.mainImage || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            totalRooms: boarding.totalRooms,
            rooms: rooms.map((room) => ({
                id: room._id.toString(),
                name: room.name,
                price: room.price,
                capacity: room.capacity,
                description: room.description,
                isAvailable: room.isAvailable,
                images: room.images || [],
            })),
        };

        return NextResponse.json(boardingWithRooms, { status: 200 });
    } catch (error) {
        console.error("Fetch boarding details error:", error);
        return NextResponse.json(
            { error: "Failed to fetch boarding details" },
            { status: 500 }
        );
    }
}
