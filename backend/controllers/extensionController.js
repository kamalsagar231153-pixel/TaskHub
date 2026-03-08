import ExtensionRequest from "../models/ExtensionRequest.js";
import Task from "../models/Task.js";

/* =========================
   Employee - Request Extension
========================= */
export const requestExtension = async (req, res) => {
  try {
    const { requestedDate, reason } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const extension = await ExtensionRequest.create({
      task: task._id,
      employee: req.user._id,
      department: task.department,
      requestedDate,
      reason,
      status: "Pending",
      proofFile: req.file ? req.file.filename : null,
    });

    task.status = "Awaiting Approval";
    await task.save();

    res.status(201).json(extension);
  } catch (error) {
    console.log("REQUEST EXTENSION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Admin - Review Extension
========================= */
export const reviewExtension = async (req, res) => {
  try {
    const { status, newDueDate, adminInstruction } = req.body;

    if (!adminInstruction || adminInstruction.trim() === "") {
      return res.status(400).json({
        message: "Admin instruction is required.",
      });
    }

    const extension = await ExtensionRequest.findById(req.params.id);
    if (!extension) {
      return res.status(404).json({ message: "Extension not found" });
    }

    const task = await Task.findById(extension.task);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    extension.status = status;
    extension.adminInstruction = adminInstruction;

    if (status === "Approved") {
      task.status = "Pending";
      if (newDueDate) {
        task.dueDate = newDueDate;
      }
    }

    if (status === "Rejected") {
      task.status = "Failed";
    }

    await extension.save();
    await task.save();

    res.json({ message: `Extension ${status} successfully` });
  } catch (error) {
    console.log("REVIEW EXTENSION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   Admin - Get All Extensions
========================= */
export const getExtensions = async (req, res) => {
  try {

    const adminRoles = [
      "Admin",
      "Dean",
      "CEO",
      "Manager",
      "Director",
      "Boss",
      "HOD"
    ];

    let extensions = [];

    // Admin sees only extension requests for tasks they created
    if (adminRoles.includes(req.user.role)) {

      extensions = await ExtensionRequest.find()
        .populate("task")
        .sort({ createdAt: -1 });

      extensions = extensions.filter(
        ext => ext.task?.assignedBy?.adminEmail === req.user.email
      );

    }

    res.json(extensions);

  } catch (error) {

    console.log("EXTENSION FETCH ERROR:", error);
    res.status(500).json({ message: "Failed to fetch extensions" });

  }
};