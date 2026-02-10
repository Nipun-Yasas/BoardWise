import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    mobile_number: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
    },
    university: {
      type: String,
      default: "",
    },
    faculty: {
      type: String,
      default: "",
    },
    academicYear: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = models.User || model("User", UserSchema);

export default User;
