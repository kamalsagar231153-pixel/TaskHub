import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    employeeEmail: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    assignedBy: {
  adminEmail: {
    type: String,
  },
  designation: {
    type: String, // Dean / CEO / Director
  },
},

    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Awaiting Approval"],
      default: "Pending",
    },

employeeSubmissions: {
  type: [String],
  default: []
},

adminFiles: [
  {
    type: String
  }
],
    completionProof: {
      type: String,
    },

    file: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Task", taskSchema);
