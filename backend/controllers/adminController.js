import User from "../models/User.js";
import Job from "../models/Job.js";
import bcrypt from "bcryptjs";

// Get all registered job seekers
export const getJobSeekers = async (req, res) => {
  try {
    // Only admin can access this
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can view job seeker details",
      });
    }

    const jobSeekers = await User.find({ role: "jobseeker" }, "-password").sort(
      { createdAt: -1 },
    );

    res.status(200).json({
      count: jobSeekers.length,
      jobSeekers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get job seekers",
      error: error.message,
    });
  }
};

// Get all employer job listings
export const getEmployerJobs = async (req, res) => {
  try {
    // Only admin can access this
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can view employer job listings",
      });
    }

    const jobs = await Job.find()
      .populate("employer", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get employer job listings",
      error: error.message,
    });
  }
};

// Create employer account - Admin only
export const createEmployer = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can create employer accounts",
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employer = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "employer",
      isVerified: true,
    });

    res.status(201).json({
      message: "Employer account created successfully",
      employer: {
        id: employer._id,
        name: employer.name,
        email: employer.email,
        role: employer.role,
        isVerified: employer.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create employer account",
      error: error.message,
    });
  }
};