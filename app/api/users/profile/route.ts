import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.userId).select("-password").lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university || "",
        faculty: user.faculty || "",
        academicYear: user.academicYear || "",
        mobile_number: user.mobile_number || "",
        image: user.image || null,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, university, faculty, academicYear, mobile_number, image } =
      body;

    const updatedUser = await User.findByIdAndUpdate(
      session.userId,
      {
        name,
        university,
        faculty,
        academicYear,
        mobile_number,
        image,
      },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        university: updatedUser.university || "",
        faculty: updatedUser.faculty || "",
        academicYear: updatedUser.academicYear || "",
        mobile_number: updatedUser.mobile_number || "",
        image: updatedUser.image || null,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
