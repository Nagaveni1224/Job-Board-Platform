import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    // Only employers can create jobs
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can create job listings",
      });
    }

    const { title, description, company, location, salary, jobType, skills } =
      req.body;

    if (!title || !description || !company || !location || !salary) {
      return res.status(400).json({
        message: "Please provide all required job details",
      });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      jobType,
      skills,
      employer: req.user.id,
      isVerified: false,
    });

    res.status(201).json({
      message: "Job created successfully and is waiting for admin verification",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create job",
      error: error.message,
    });
  }
};

export const verifyJob = async (req, res) => {
  try {
    // Only admin can verify jobs
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can verify job listings",
      });
    }

    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    job.isVerified = true;

    await job.save();

    res.status(200).json({
      message: "Job verified successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to verify job",
      error: error.message,
    });
  }
};

export const getVerifiedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isVerified: true })
      .populate("employer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get verified jobs",
      error: error.message,
    });
  }
};

export const searchJobs = async (req, res) => {
  try {
    const { keyword, location, jobType } = req.query;

    const filter = {
      isVerified: true,
    };

    // Keyword search
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } },
        { skills: { $regex: keyword, $options: "i" } },
      ];
    }

    // Location search
    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Job type filter
    if (jobType) {
      filter.jobType = jobType;
    }

    const jobs = await Job.find(filter)
      .populate("employer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error searching jobs",
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

// Get a single verified job by ID
export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findOne({
      _id: jobId,
      isVerified: true,
    }).populate("employer", "name email");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get job details",
      error: error.message,
    });
  }
};

// Get jobs created by the logged-in employer
export const getMyJobs = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can view their own jobs",
      });
    }

    const jobs = await Job.find({
      employer: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get your jobs",
      error: error.message,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can delete jobs",
      });
    }

    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Make sure the employer owns this job
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this job",
      });
    }

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete job",
      error: error.message,
    });
  }
};
