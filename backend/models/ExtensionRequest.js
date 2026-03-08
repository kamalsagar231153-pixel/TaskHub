import mongoose from "mongoose";

const extensionSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    requestedDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    adminInstruction: {
      type: String,
    },
    proofFile: {
      type: String,
      default: null,
    },

    adminInstruction: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("ExtensionRequest", extensionSchema);
