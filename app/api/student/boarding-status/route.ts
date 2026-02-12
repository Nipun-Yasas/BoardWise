import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import Room from "@/models/Room";

export async function GET() {
  await connectDB();

  // Get current user from session
  const session = await getSession();
  if (!session || !session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.userId;

    // Check if user is a tenant in any room
    const room = await Room.findOne({ tenants: userId }).select("boardingId");

    if (room) {
      return NextResponse.json({
        hasBoarding: true,
        boardingId: room.boardingId,
      });
    }

    return NextResponse.json({
      hasBoarding: false,
      boardingId: null,
    });
  } catch (error) {
    console.error("Error checking boarding status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
