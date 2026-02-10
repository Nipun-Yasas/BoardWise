import mongoose, { Schema, model, models } from "mongoose";

const BillTypeSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room ID is required"],
    },
    name: {
      type: String,
      required: [true, "Bill type name is required"],
    },
  },
  {
    timestamps: true,
  }
);

const BillType = models.BillType || model("BillType", BillTypeSchema);

export default BillType;