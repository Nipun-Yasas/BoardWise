import mongoose, { Schema, model, models } from "mongoose";

const BoardingProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    currentStatus: {
      type: String,
      enum: ["boarding", "away"],
      default: "boarding",
    },
    baseRent: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: "LKR",
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const BoardingProfile =
  models.BoardingProfile || model("BoardingProfile", BoardingProfileSchema);

export default BoardingProfile;
