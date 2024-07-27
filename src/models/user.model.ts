import mongoose, { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  email: string;
  phoneNumber: string;
  password: string; // Password is optional because it won't be present for Google OAuth users
  token?: string;
  googleId?: string; // Add googleId field for Google OAuth
}

const userSchema = new Schema<IUser>(
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
      trim: true,
    },
    token: {
      type: String,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allow this field to be optional and unique
    },
  },
  { timestamps: true }
);

export const userModel = model<IUser>("User", userSchema);
