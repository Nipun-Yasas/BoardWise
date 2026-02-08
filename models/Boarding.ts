import { Schema, model, models } from "mongoose";

const BoardingSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner ID is required"],
    },
    name: {
      type: String,
      required: [true, "Boarding name is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    mainImage: {
      type: String,
      default: null,
    },
    totalRooms: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    nearestUniversity: {
      type: String,
      default: "",
    },
    distanceFromUniversity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Delete the cached model to ensure schema changes are applied
if (models.Boarding) {
  delete models.Boarding;
}

const Boarding = models.Boarding || model("Boarding", BoardingSchema);

export default Boarding;
