import Task from "../models/Task.js";

/**
 * 📊 Overview Analytics
 */
export const getOverviewAnalytics = async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const completed = await Task.countDocuments({ status: "Completed" });
    const failed = await Task.countDocuments({ status: "Failed" });
    const pending = await Task.countDocuments({ status: "Pending" });
    const awaiting = await Task.countDocuments({ status: "Awaiting Approval" });

    res.json({
      total,
      completed,
      failed,
      pending,
      awaiting
    });
  } catch (error) {
    res.status(500);
    throw new Error("Overview analytics error");
  }
};

/**
 * 🏢 Department Analytics
 */
export const departmentAnalytics = async (req, res) => {
  try {
    const data = await Task.aggregate([
      {
        $group: {
          _id: "$department",
          totalTasks: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json(data);
  } catch (error) {
    res.status(500);
    throw new Error("Department analytics error");
  }
};

/**
 * 📈 Department Performance (Advanced)
 */
export const departmentPerformance = async (req, res) => {
  try {
    const data = await Task.aggregate([
      {
        $group: {
          _id: "$department",
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, 1, 0]
            }
          },
          failed: {
            $sum: {
              $cond: [{ $eq: ["$status", "Failed"] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json(data);
  } catch (error) {
    res.status(500);
    throw new Error("Department performance error");
  }
};

/**
 * 📄 Report Data (For PDF)
 */
export const getReportData = async (req, res) => {
  try {
    const tasks = await Task.find();

    const report = tasks.map(task => ({
      employee: task.employeeName,
      department: task.department,
      status: task.status,
      dueDate: task.dueDate
    }));

    res.json(report);
  } catch (error) {
    res.status(500);
    throw new Error("Report generation error");
  }
};
