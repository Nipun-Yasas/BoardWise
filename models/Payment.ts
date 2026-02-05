import mongoose, { Schema, model, models } from "mongoose";

const PaymentSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Completed",
    },
    type: {
      type: String,
      enum: ["Rent", "Deposit", "Other"],
      default: "Rent",
    },
  },
  { timestamps: true }
);

const Payment = models.Payment || model("Payment", PaymentSchema);
export default Payment;