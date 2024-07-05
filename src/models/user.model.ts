import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "passsword is required"],
      unique: true,
      trim: true,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

export const userModel = mongoose.model("User", userSchema);
