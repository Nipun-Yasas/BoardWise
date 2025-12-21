import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

export async function GET() {
  await connectDB();
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ user: null });
    }

    const user = await User.findById(session.userId).select("name email role");

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
export {};
