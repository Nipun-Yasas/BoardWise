import mongoose, { Schema, model, models } from "mongoose";

const BillAmountSchema = new Schema(
  {
    monthlyBillId: {
      type: Schema.Types.ObjectId,
      ref: "MonthlyBill",
      required: [true, "Monthly bill ID is required"],
    },
    billTypeId: {
      type: Schema.Types.ObjectId,
      ref: "BillType",
      required: [true, "Bill type ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one amount per bill type per monthly bill
BillAmountSchema.index({ monthlyBillId: 1, billTypeId: 1 }, { unique: true });

const BillAmount = models.BillAmount || model("BillAmount", BillAmountSchema);

export default BillAmount;