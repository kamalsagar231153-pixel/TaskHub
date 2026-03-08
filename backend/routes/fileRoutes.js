import express from "express";
import protect from "../middleware/authMiddleware.js";
import Task from "../models/Task.js";
import path from "path";

const router = express.Router();

router.get("/:filename", protect, async (req, res) => {
  const { filename } = req.params;

  const task = await Task.findOne({
    $or: [
      { adminFile: filename },
      { employeeSubmission: filename }
    ]
  });

  if (!task) {
    return res.status(404).json({ message: "File not found" });
  }

  // Admin can access all
  if (req.user.role === "admin") {
    return res.sendFile(path.resolve(`uploads/${filename}`));
  }

  // Employee can access only their task files
  if (
    req.user.role === "employee" &&
    task.employeeEmail === req.user.email
  ) {
    return res.sendFile(path.resolve(`uploads/${filename}`));
  }

  res.status(403).json({ message: "Unauthorized access" });
});

export default router;
