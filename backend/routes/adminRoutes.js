import express from "express";

import {
  getJobSeekers,
  getEmployerJobs,
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/jobseekers", authMiddleware, getJobSeekers);
router.get("/jobs", authMiddleware, getEmployerJobs);

export default router;
