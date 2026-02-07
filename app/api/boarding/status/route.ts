import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth";
import BoardingProfile from "@/models/BoardingProfile";
import BoardingMonth from "@/models/BoardingMonth";

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let profile = await BoardingProfile.findOne({ user: session.userId });

    if (!profile) {
        // Create a default profile if one doesn't exist
        profile = await BoardingProfile.create({
            user: session.userId,
            baseRent: 15000, // Default rent, should be configurable
        });
    }

    return NextResponse.json({
        status: profile.currentStatus,
        baseRent: profile.baseRent,
        currency: profile.currency,
    });
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();

    if (!["boarding", "away"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();

    const profile = await BoardingProfile.findOneAndUpdate(
        { user: session.userId },
        { currentStatus: status },
        { new: true, upsert: true }
    );

    // If status is "boarding", ensure today is marked in the current month's record
    if (status === "boarding") {
        const now = new Date();
        const month = now.getMonth() + 1; // 1-12
        const year = now.getFullYear();
        const day = now.getDate();

        await BoardingMonth.findOneAndUpdate(
            { user: session.userId, month, year },
            {
                $addToSet: { stayedDates: day },
                $setOnInsert: { totalDays: 0, rentAmount: 0 },
            },
            { upsert: true, new: true }
        );
        // Recalculate total days? We might want to do this on fetch or a separate cron, 
        // but let's just do it here for simplicity or rely on the array length in UI.
    }

    return NextResponse.json({
        status: profile.currentStatus,
        message: "Status updated successfully",
    });
}
