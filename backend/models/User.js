import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "Admin",
        "Dean",
        "CEO",
        "Manager",
        "Director",
        "Boss",
        "Employee",
        "HOD",
      ],
      default: "Employee",
    },
    designation: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "General",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
