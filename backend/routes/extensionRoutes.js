import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  requestExtension,
  reviewExtension,
  getExtensions
} from "../controllers/extensionController.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getExtensions);
router.post(
  "/:id",
  protect,
  authorize("employee"),
  upload.single("file"), // allow optional file
  requestExtension
);
router.put("/:id", protect, authorize("admin"), reviewExtension);

export default router;
