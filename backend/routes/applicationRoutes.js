import express from "express";
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/applicationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/:jobId", authMiddleware, upload.single("resume"), applyForJob);

router.get("/my", authMiddleware, getMyApplications);

router.get("/:jobId", authMiddleware, getJobApplications);

router.put("/:applicationId/status", authMiddleware, updateApplicationStatus);

router.delete("/:applicationId", authMiddleware, deleteApplication);

export default router;
