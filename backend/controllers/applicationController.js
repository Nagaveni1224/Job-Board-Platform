import Application from "../models/Application.js";
import Job from "../models/Job.js";
import cloudinary from "../config/cloudinary.js";

// Apply for Job
export const applyForJob = async (req, res) => {
  try {
    // Only job seekers can apply
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only job seekers can apply for jobs",
      });
    }

    const { jobId } = req.params;
    const { coverLetter, resume } = req.body;

    // Check whether the job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Only verified jobs can receive applications
    if (!job.isVerified) {
      return res.status(400).json({
        message: "This job is not verified yet",
      });
    }

    // Check whether the user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    let resumeUrl = resume || "";

    // If a resume file was uploaded, send it to Cloudinary
    if (req.file) {
      resumeUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "job-board-resumes",
            resource_type: "raw",
            public_id: `${Date.now()}-${req.user.id}`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          },
        );

        uploadStream.end(req.file.buffer);
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      resume: resumeUrl,
      coverLetter: coverLetter || "",
    });

    res.status(201).json({
      message: "Job application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply job error:", error);

    res.status(500).json({
      message: "Failed to apply for job",
      error: error.message,
    });
  }
};

// Get My Applications
export const getMyApplications = async (req, res) => {
  try {
    // Only job seekers can view their applications
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only job seekers can view applications",
      });
    }

    const applications = await Application.find({
      applicant: req.user.id,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

// Get Job Applications
export const getJobApplications = async (req, res) => {
  try {
    // Only employers can view job applications
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can view job applications",
      });
    }

    const { jobId } = req.params;

    // Check whether the job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Make sure this job belongs to the logged-in employer
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to view these applications",
      });
    }

    const applications = await Application.find({
      job: jobId,
    })
      .populate("applicant", "name email")
      .populate("job", "title company location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch job applications",
      error: error.message,
    });
  }
};

// Update Application Status
export const updateApplicationStatus = async (req, res) => {
  try {
    // Only employers can update application status
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can update application status",
      });
    }

    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Applied", "Shortlisted", "Rejected", "Selected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    const application =
      await Application.findById(applicationId).populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this application",
      });
    }

    application.status = status;

    await application.save();

    res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update application status",
      error: error.message,
    });
  }
};

// Delete Application
export const deleteApplication = async (req, res) => {
  try {
    // Only job seekers can withdraw applications
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only job seekers can withdraw applications",
      });
    }

    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this application",
      });
    }

    await Application.findByIdAndDelete(applicationId);

    res.status(200).json({
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to withdraw application",
      error: error.message,
    });
  }
};
