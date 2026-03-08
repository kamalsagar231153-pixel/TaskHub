import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
  getOverviewAnalytics,
  departmentAnalytics,
  departmentPerformance,
  getReportData
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/overview", protect, authorize("admin"), getOverviewAnalytics);
router.get("/departments", protect, authorize("admin"), departmentAnalytics);
router.get("/performance", protect, authorize("admin"), departmentPerformance);
router.get("/report", protect, authorize("admin"), getReportData);

export default router;
