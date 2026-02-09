import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import BillType from "@/models/BillType";
import Boarding from "@/models/Boarding";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

// GET: Fetch all boardings for logged-in owner
export async function GET(request: Request) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ObjectId } = require("mongoose").Types;

    const boardingsWithRooms = await Boarding.aggregate([
      {
        $match: { ownerId: new ObjectId(session.userId) },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "rooms",
          let: { boardingId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$boardingId", "$$boardingId"] } } },
            {
              $lookup: {
                from: "billtypes",
                localField: "_id",
                foreignField: "roomId",
                as: "billTypes",
              },
            },
            {
              $lookup: {
                from: "users", // Assuming 'users' collection for tenants
                localField: "tenants",
                foreignField: "_id",
                as: "tenantsData",
              },
            },
            {
              $project: {
                _id: 1,
                boardingId: 1,
                name: 1,
                capacity: 1,
                price: 1,
                description: 1,
                images: 1,
                isAvailable: { $ifNull: ["$isAvailable", true] },
                gender: { $ifNull: ["$gender", "Male"] },
                billTypes: {
                  $map: {
                    input: "$billTypes",
                    as: "bt",
                    in: { id: { $toString: "$$bt._id" }, name: "$$bt.name" },
                  },
                },
                tenants: {
                  $map: {
                    input: "$tenantsData",
                    as: "tenant",
                    in: {
                      _id: "$$tenant._id",
                      name: "$$tenant.name",
                      email: "$$tenant.email",
                      mobile_number: "$$tenant.mobile_number",
                    },
                  },
                },
              },
            },
          ],
          as: "rooms",
        },
      },
      {
        $project: {
          id: { $toString: "$_id" },
          name: 1,
          description: 1,
          mainImage: 1,
          totalRooms: { $ifNull: ["$totalRooms", 0] },
          isAvailable: { $ifNull: ["$isAvailable", true] },
          rooms: {
            $map: {
              input: "$rooms",
              as: "room",
              in: {
                id: { $toString: "$$room._id" },
                boardingId: { $toString: "$$room.boardingId" },
                name: "$$room.name",
                capacity: "$$room.capacity",
                price: "$$room.price",
                description: "$$room.description",
                images: "$$room.images",
                isAvailable: "$$room.isAvailable",
                gender: "$$room.gender",
                billTypes: "$$room.billTypes",
                tenants: "$$room.tenants",
              },
            },
          },
        },
      },
    ]);

    return NextResponse.json(boardingsWithRooms, { status: 200 });
  } catch (error) {
    console.error("Fetch boardings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch boardings" },
      { status: 500 },
    );
  }
}

// POST: Create new boarding
export async function POST(request: Request) {
  await connectDB();
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      mainImage,
      totalRooms,
      nearestUniversity,
      distanceFromUniversity,
    } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 },
      );
    }

    // Create boarding
    const boarding = await Boarding.create({
      ownerId: session.userId,
      name,
      description,
      mainImage: mainImage || null,
      totalRooms: totalRooms || 0,
      nearestUniversity: nearestUniversity || "",
      distanceFromUniversity: distanceFromUniversity || 0,
    });

    return NextResponse.json(
      {
        success: true,
        boarding: {
          id: boarding._id.toString(),
          name: boarding.name,
          description: boarding.description,
          mainImage: boarding.mainImage,
          totalRooms: boarding.totalRooms || 0,
          nearestUniversity: boarding.nearestUniversity || "",
          distanceFromUniversity: boarding.distanceFromUniversity || 0,
          rooms: [],
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create boarding error:", error);
    return NextResponse.json(
      { error: "Failed to create boarding" },
      { status: 500 },
    );
  }
}

export {};
