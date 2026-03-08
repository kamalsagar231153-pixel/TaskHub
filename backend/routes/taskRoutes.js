import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  assignTask,
  getTasks,
  completeTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Admin - Assign Task
|--------------------------------------------------------------------------
*/
router.post(
  "/assign",
  protect,
  authorize("admin"),
  upload.array("files", 10), // allow up to 10 files
  assignTask
);

/*
|--------------------------------------------------------------------------
| Get Tasks (Admin & Employee)
|--------------------------------------------------------------------------
*/
router.get(
  "/",
  protect,
  getTasks
);

/*
|--------------------------------------------------------------------------
| Employee - Mark Task Completed
|--------------------------------------------------------------------------
*/
router.put(
  "/complete/:id",
  protect,
  authorize("employee"),
  upload.array("files", 5),
  completeTask
);

/*
|--------------------------------------------------------------------------
| Admin - Delete Task
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteTask
);

export default router;
