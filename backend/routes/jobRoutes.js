import express from "express";

import {
  createJob,
  verifyJob,
  getVerifiedJobs,
  searchJobs,
  getJobById,
  getMyJobs,
  getEmployerJobs,
  deleteJob,
} from "../controllers/jobController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createJob);

router.put("/:jobId/verify", authMiddleware, verifyJob);

router.get("/verified", getVerifiedJobs);

router.get("/search", authMiddleware, searchJobs);

// Admin: view all job listings
router.get("/employer", authMiddleware, getEmployerJobs);

// Employer: view own jobs
router.get("/my", authMiddleware, getMyJobs);

router.get("/:jobId", getJobById);

router.delete("/:jobId", authMiddleware, deleteJob);

export default router;
