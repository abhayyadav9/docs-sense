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
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpiresAt: { type: Date },
    verificationToken: { type: String, select: false },
    verificationTokenExpiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Hash password before save


const User = mongoose.model("User", userSchema);

export default User;
