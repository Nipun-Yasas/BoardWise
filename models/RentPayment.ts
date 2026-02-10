import mongoose, { Schema, model, models } from "mongoose";

const RentPaymentSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room ID is required"],
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Tenant ID is required"],
    },
    month: {
      type: String, // Format: YYYY-MM
      required: [true, "Month is required"],
    },
    rentAmount: {
      type: Number,
      required: [true, "Rent amount is required"],
      min: [0, "Rent amount cannot be negative"],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
RentPaymentSchema.index({ roomId: 1, month: 1 });
RentPaymentSchema.index({ roomId: 1, tenantId: 1, month: 1 }, { unique: true });

const RentPayment =
  models.RentPayment || model("RentPayment", RentPaymentSchema);

export default RentPayment;
