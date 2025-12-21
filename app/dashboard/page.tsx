import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import User from "@/models/User";
import connectDB from "@/lib/db";

export default async function DashboardPage() {
    await connectDB();
    const session = await getSession();

    if (!session || !session.userId) {
        redirect("/auth");
    }

    const user = await User.findById(session.userId);

    if (!user) {
        redirect("/auth");
    }

    if (user.role === "Student") {
        redirect("/student-dashboard");
    } else if (user.role === "Owner") {
        redirect("/owner-dashboard");
    } else {
        // Fallback or error page
        redirect("/");
    }
}
