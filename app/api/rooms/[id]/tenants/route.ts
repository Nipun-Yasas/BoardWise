import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import Room from "@/models/Room";
import User from "@/models/User";
import { NextResponse } from "next/server";

// POST: Add or Remove tenant
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    await connectDB();
    try {
        const session = await getSession();

        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: roomId } = params;
        const body = await request.json();
        const { email, action } = body;

        if (!email || !action) {
            return NextResponse.json(
                { error: "Email and action are required" },
                { status: 400 }
            );
        }

        // Verify room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        // Verify user (tenant) exists
        const student = await User.findOne({ email });
        if (!student) {
            return NextResponse.json(
                { error: "Student not found with this email" },
                { status: 404 }
            );
        }

        if (action === "add") {
            // Check if room is full
            if (room.tenants.length >= room.capacity) {
                return NextResponse.json(
                    { error: "Room is already at full capacity" },
                    { status: 400 }
                );
            }

            // Check if student is already in the room
            if (room.tenants.includes(student._id)) {
                return NextResponse.json(
                    { error: "Student is already in this room" },
                    { status: 400 }
                );
            }

            // Add student
            room.tenants.push(student._id);
        } else if (action === "remove") {
            // Remove student
            room.tenants = room.tenants.filter(
                (tenantId: any) => tenantId.toString() !== student._id.toString()
            );
        } else {
            return NextResponse.json(
                { error: "Invalid action. Use 'add' or 'remove'" },
                { status: 400 }
            );
        }

        await room.save();

        // Populate tenants for response
        const populatedRoom = await Room.findById(roomId).populate(
            "tenants",
            "name email mobile_number"
        );

        return NextResponse.json(
            { success: true, tenants: populatedRoom.tenants },
            { status: 200 }
        );
    } catch (error) {
        console.error("Manage tenants error:", error);
        return NextResponse.json(
            { error: "Failed to update tenants" },
            { status: 500 }
        );
    }
}
