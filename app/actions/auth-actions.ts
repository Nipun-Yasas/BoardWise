"use server";

import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { hashPassword, verifyPassword, createSession } from "@/lib/auth";

export async function registerUser(formData: FormData) {
  await connectDB();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const mobile_number = formData.get("mobile_number") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !password || !mobile_number || !role) {
    return { error: "All fields are required" };
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return { error: "User already exists" };
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    mobile_number,
    role,
  });

  await createSession(user._id.toString());

  if (user.role === "Student") {
    redirect("/student-dashboard");
  } else if (user.role === "Owner") {
    redirect("/owner-dashboard");
  } else {
    redirect("/dashboard");
  }
}

export async function loginUser(formData: FormData) {
  await connectDB();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await User.findOne({ email });

  if (!user) {
    return { error: "Invalid credentials" };
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    return { error: "Invalid credentials" };
  }

  await createSession(user._id.toString());

  if (user.role === "Student") {
    redirect("/student-dashboard");
  } else if (user.role === "Owner") {
    redirect("/owner-dashboard");
  } else {
    redirect("/dashboard");
  }
}
