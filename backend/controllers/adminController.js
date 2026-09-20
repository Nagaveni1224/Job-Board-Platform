import User from "../models/User.js";
import Job from "../models/Job.js";

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
