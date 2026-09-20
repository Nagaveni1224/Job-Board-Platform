import express from "express";

import {
  updateProfile,
  getProfile,
  uploadResume,
} from "../controllers/profileController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.put("/", authMiddleware, updateProfile);

router.get("/", authMiddleware, getProfile);

router.post("/resume", authMiddleware, upload.single("resume"), uploadResume);

export default router;
