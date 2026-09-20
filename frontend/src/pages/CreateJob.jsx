import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const CreateJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
    jobType: "Full Time",
    skills: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const jobData = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
      };

      await API.post("/jobs", jobData);

      alert("Job created successfully!");

      navigate("/my-jobs");
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to create job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/my-jobs")}
          className="text-blue-600 hover:text-blue-700 font-semibold mb-6 transition"
        >
          ← Back to My Jobs
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-2xl px-8 py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
              ➕
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">
                Create New Job
              </h1>

              <p className="text-blue-100 mt-1">
                Add a new opportunity to your company.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-b-2xl border border-gray-200 border-t-0 shadow-lg p-8">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 mb-7">
              <p className="font-semibold">Unable to create job</p>

              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Job Title + Company */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-800 font-bold mb-2">
                  Job Title
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    💼
                  </span>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="MERN Stack Developer"
                    required
                    className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-800 font-bold mb-2">
                  Company
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    🏢
                  </span>

                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="ABC Technologies"
                    required
                    className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Location + Salary */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-800 font-bold mb-2">
                  Location
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    📍
                  </span>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Bangalore"
                    required
                    className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-800 font-bold mb-2">
                  Salary
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    💰
                  </span>

                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="5-8 LPA"
                    required
                    className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Job Type */}
            <div className="mb-6">
              <label className="block text-gray-800 font-bold mb-2">
                Job Type
                <span className="text-red-500 ml-1">*</span>
              </label>

              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="Full Time">Full Time</option>

                <option value="Part Time">Part Time</option>

                <option value="Internship">Internship</option>

                <option value="Contract">Contract</option>
              </select>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <label className="block text-gray-800 font-bold mb-2">
                Skills
                <span className="text-red-500 ml-1">*</span>
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🏷️
                </span>

                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                  required
                  className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Separate multiple skills with commas.
              </p>
            </div>

            {/* Description */}
            <div className="mb-7">
              <label className="block text-gray-800 font-bold mb-2">
                Job Description
                <span className="text-red-500 ml-1">*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job responsibilities, requirements and expectations..."
                rows="8"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

              <p className="text-xs text-gray-400 mt-2">
                Provide clear information about the role and its
                responsibilities.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3.5 rounded-xl font-bold transition shadow-md"
            >
              {loading ? "Creating Job..." : "Create Job →"}
            </button>
          </form>

          {/* Note */}
          <div className="flex items-center justify-center gap-2 mt-6 pt-5 border-t border-gray-100">
            <span>🔐</span>

            <p className="text-xs text-gray-500">
              New jobs require admin verification before appearing to job
              seekers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
