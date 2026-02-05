import mongoose, { Schema, model, models } from "mongoose";

const BoardingHouseSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    description: String,
    images: [String],
  },
  { timestamps: true }
);

const BoardingHouse = models.BoardingHouse || model("BoardingHouse", BoardingHouseSchema);
export default BoardingHouse;