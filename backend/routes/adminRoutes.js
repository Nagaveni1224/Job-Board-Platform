import express from "express";

import {
  getJobSeekers,
  getEmployerJobs,
  createEmployer,
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/jobseekers", authMiddleware, getJobSeekers);
router.get("/jobs", authMiddleware, getEmployerJobs);
router.post("/employers", authMiddleware, createEmployer);

export default router;
