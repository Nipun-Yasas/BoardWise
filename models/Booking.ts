import mongoose, { Schema, model, models } from "mongoose";

const BookingSchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // The student
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Pending", "Active", "Completed", "Cancelled"],
      default: "Pending",
    },
    totalAmount: Number,
  },
  { timestamps: true }
);

const Booking = models.Booking || model("Booking", BookingSchema);
export default Booking;