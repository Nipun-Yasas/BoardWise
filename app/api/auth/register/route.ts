// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { hashPassword, createSession } from "@/lib/auth";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { name, email, password, role } = body;

//     if (!name || !email || !password || !role) {
//       return NextResponse.json(
//         { error: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 409 }
//       );
//     }

//     const hashedPassword = await hashPassword(password);

//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         role,
//       },
//     });

//     await createSession(user.id);

//     return NextResponse.json({
//       success: true,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Registration error:", error);
//     return NextResponse.json(
//       { error: "An unexpected error occurred" },
//       { status: 500 }
//     );
//   }
// }
export {};
