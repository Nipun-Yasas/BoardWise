import mongoose, { Schema, model, models } from "mongoose";

const MonthlyBillSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room ID is required"],
    },
    month: {
      type: String,
      required: [true, "Month is required"],
      // Format: "2026-01"
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one bill per room per month
MonthlyBillSchema.index({ roomId: 1, month: 1 }, { unique: true });

const MonthlyBill = models.MonthlyBill || model("MonthlyBill", MonthlyBillSchema);

export default MonthlyBill;