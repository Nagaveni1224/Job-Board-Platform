import User from "../models/User.js";

// Create or update jobseeker profile
export const updateProfile = async (req, res) => {
  try {
    // Only jobseekers can update this profile
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only jobseekers can update their profile",
      });
    }

    const { phone, skills, education, experience, resume } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.phone = phone || "";
    user.skills = skills || [];
    user.education = education || "";
    user.experience = experience || "";
    user.resume = resume || "";

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        skills: user.skills,
        education: user.education,
        experience: user.experience,
        resume: user.resume,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// Get logged-in jobseeker profile
export const getProfile = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only jobseekers can view this profile",
      });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      profile: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

// Upload jobseeker resume
export const uploadResume = async (req, res) => {
  try {
    // Only jobseekers can upload resumes
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only jobseekers can upload resumes",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.resume = req.file.path;

    await user.save();

    res.status(200).json({
      message: "Resume uploaded successfully",
      resume: user.resume,
    });
  } catch (error) {
    res.status(500).json({
      message: "Resume upload failed",
      error: error.message,
    });
  }
};
