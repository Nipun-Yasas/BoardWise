import mongoose, { Schema, model, models } from "mongoose";

const RoomSchema = new Schema(
  {
    boardingHouse: {
      type: Schema.Types.ObjectId,
      ref: "BoardingHouse",
      required: true,
    },
    roomNumber: { type: String, required: true },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Available", "Full", "Maintenance"],
      default: "Available",
    },
  },
  { timestamps: true }
);

const Room = models.Room || model("Room", RoomSchema);
export default Room;