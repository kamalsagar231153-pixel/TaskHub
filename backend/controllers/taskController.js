import Task from "../models/Task.js";
import ExtensionRequest from "../models/ExtensionRequest.js";

/*
|--------------------------------------------------------------------------
| Assign Task (Admin)
|--------------------------------------------------------------------------
*/
export const assignTask = async (req, res) => {
  try {
    console.log("Uploaded files:", req.files);

    const {
      employeeEmail,
      department,
      startDate,
      dueDate,
      description,
    } = req.body;

    if (!employeeEmail || !department || !startDate || !dueDate || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Admin not authenticated" });
    }

    const newTask = await Task.create({
      employeeEmail,
      department,
      startDate,
      dueDate,
      description,

      assignedBy: {
        adminEmail: req.user.email,
        designation: req.user.role, // ✅ FIX HERE
      },

      status: "Pending",
      adminFiles: req.files ? req.files.map(file => file.filename) : [],
    });

    console.log("Saved adminFile:", newTask.adminFile);

    res.status(201).json(newTask);

  } catch (error) {
    console.log("ASSIGN ERROR:", error);
    res.status(500).json({ message: "Task assignment failed" });
  }
};

/*
|--------------------------------------------------------------------------
| Get Tasks
|--------------------------------------------------------------------------
*/
export const getTasks = async (req, res) => {
  try {

    let tasks = [];

    const adminRoles = [
      "Admin",
      "Dean",
      "CEO",
      "Manager",
      "Director",
      "Boss",
      "HOD"
    ];

    // Admin roles see only their own tasks
    if (adminRoles.includes(req.user.role)) {

      tasks = await Task.find({
        "assignedBy.adminEmail": req.user.email
      }).sort({ createdAt: -1 });

    }

    // Employee sees only assigned tasks
    else if (req.user.role === "Employee") {

      tasks = await Task.find({
        employeeEmail: req.user.email
      }).sort({ createdAt: -1 });

    }

    const tasksWithExtension = await Promise.all(
      tasks.map(async (task) => {

        const extension = await ExtensionRequest.findOne({
          task: task._id
        })
        .sort({ createdAt: -1 })
        .lean();

        return {
          ...task.toObject(),
          extension: extension || null
        };

      })
    );

    res.json(tasksWithExtension);

  } catch (error) {

    console.log("GET TASK ERROR:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });

  }
};

export const reviewExtension = async (req, res) => {
  try {
    const { status, newDueDate, instruction } = req.body;

    const extension = await ExtensionRequest.findById(req.params.id);
    if (!extension) {
      return res.status(404).json({ message: "Extension not found" });
    }

    const task = await Task.findById(extension.task);

    extension.status = status;
    extension.adminInstruction = instruction || "";

    if (status === "Approved") {
      task.status = "Pending";
      task.dueDate = newDueDate;
    } else {
      task.status = "Failed";
    }

    await extension.save();
    await task.save();

    res.json({ message: "Extension reviewed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Extension review failed" });
  }
};

/*
|--------------------------------------------------------------------------
| Complete Task (Employee)
|--------------------------------------------------------------------------
*/
export const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    

    if (req.files && req.files.length > 0) {
  task.employeeSubmissions = req.files.map(file => file.filename);
}
    task.status = "Completed";
    await task.save();

    res.json({ message: "Task completed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to complete task" });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Task (Admin)
|--------------------------------------------------------------------------
*/
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
