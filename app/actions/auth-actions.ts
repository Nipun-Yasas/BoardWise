// "use server";

// import { redirect } from "next/navigation";
// import prisma from "@/lib/prisma";
// import { hashPassword, verifyPassword, createSession } from "@/lib/auth";

// export async function registerUser(formData: FormData) {
//   const name = formData.get("name") as string;
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;
//   const role = formData.get("role") as string;

//   if (!name || !email || !password || !role) {
//     return { error: "All fields are required" };
//   }

//   // Check if user exists
//   const existingUser = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (existingUser) {
//     return { error: "User already exists" };
//   }

//   const hashedPassword = await hashPassword(password);

//   const user = await prisma.user.create({
//     data: {
//       name,
//       email,
//       password: hashedPassword,
//       role,
//     },
//   });

//   await createSession(user.id);
//   redirect("/dashboard");
// }

// export async function loginUser(formData: FormData) {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   if (!email || !password) {
//     return { error: "Email and password are required" };
//   }

//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!user) {
//     return { error: "Invalid credentials" };
//   }

//   const isValid = await verifyPassword(password, user.password);

//   if (!isValid) {
//     return { error: "Invalid credentials" };
//   }

//   await createSession(user.id);
//   redirect("/dashboard");
// }
