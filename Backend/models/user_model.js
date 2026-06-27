import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
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

    photoUrl: {
      type: String,
      default: "",
    },

    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },

    provider: {
      type: String,
      enum: ["google", "github"],
      default: "google",
    },

    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);