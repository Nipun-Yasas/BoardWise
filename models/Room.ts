import mongoose, { Schema, model, models } from "mongoose";

const RoomSchema = new Schema(
  {
    boardingId: {
      type: Schema.Types.ObjectId,
      ref: "Boarding",
      required: [true, "Boarding ID is required"],
    },
    name: {
      type: String,
      required: [true, "Room name is required"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
      required: [true, "Gender is required"],
    },
    description: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    tenants: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Room = models.Room || model("Room", RoomSchema);

export default Room;
