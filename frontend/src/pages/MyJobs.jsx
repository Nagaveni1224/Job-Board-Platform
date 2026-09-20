import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiPlus,
  FiArrowRight,
  FiAlertCircle,
  FiFileText,
  FiTrash2,
} from "react-icons/fi";
import API from "../services/api";

const MyJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingJobId, setDeletingJobId] = useState(null);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const response = await API.get("/jobs/my");
        setJobs(response.data.jobs || []);
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.message || "Failed to fetch your jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  const handleDeleteJob = async (jobId, jobTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${jobTitle}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingJobId(jobId);

      await API.delete(`/jobs/${jobId}`);

      setJobs((currentJobs) => currentJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      window.alert(
        error.response?.data?.message ||
          "Failed to delete the job. Please try again.",
      );
    } finally {
      setDeletingJobId(null);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-slate-600 dark:text-slate-300 font-medium">
            Loading your jobs...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
            <FiAlertCircle className="text-red-500 text-2xl" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Unable to Load Jobs
          </h2>

          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_35%)]"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <FiBriefcase className="text-2xl" />
              </div>

              <div>
                <p className="text-blue-100 text-sm font-semibold mb-1">
                  Employer Dashboard
                </p>

                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  My Jobs
                </h1>

                <p className="text-blue-100 mt-2">
                  Manage your job postings and applicants.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/create-job")}
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-5 py-3 rounded-xl font-bold transition shadow-lg"
            >
              <FiPlus />
              Create Job
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Job Listings
              </h2>

              <span className="inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-sm font-bold">
                {jobs.length}
              </span>
            </div>

            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage the positions you have posted.
            </p>
          </div>

          <button
            onClick={() => navigate("/create-job")}
            className="sm:hidden inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition shadow-sm"
          >
            <FiPlus />
            Create Job
          </button>
        </div>

        {/* Empty State */}
        {jobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-10 md:p-14 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
              <FiFileText className="text-blue-600 dark:text-blue-400 text-3xl" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              No Jobs Yet
            </h2>

            <p className="text-slate-500 dark:text-slate-400 mt-2 mb-7 max-w-md mx-auto">
              You haven't created any job listings yet. Create your first
              listing and start finding candidates.
            </p>

            <button
              onClick={() => navigate("/create-job")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-sm"
            >
              <FiPlus />
              Create Your First Job
            </button>
          </div>
        ) : (
          /* Job Cards */
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
              >
                {/* Card Top */}
                <div className="p-5 sm:p-6 md:p-7 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                    {/* Job Title */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center shrink-0">
                        <FiBriefcase className="text-blue-600 dark:text-blue-400 text-xl sm:text-2xl" />
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white break-words">
                          {job.title}
                        </h2>

                        <p className="text-slate-600 dark:text-slate-300 font-medium mt-1">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    {/* Verification Status */}
                    <span
                      className={`inline-flex items-center gap-2 self-start px-4 py-2 rounded-full text-sm font-bold border ${
                        job.isVerified
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
                          : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900"
                      }`}
                    >
                      {job.isVerified ? (
                        <>
                          <FiCheckCircle />
                          Verified
                        </>
                      ) : (
                        <>
                          <FiClock />
                          Pending Verification
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 md:p-7">
                  {/* Job Info */}
                  <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 p-4">
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-2">
                        <FiMapPin />
                        <span className="text-xs uppercase tracking-wide font-bold">
                          Location
                        </span>
                      </div>

                      <p className="text-slate-800 dark:text-slate-200 font-semibold">
                        {job.location}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 p-4">
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-2">
                        <FiBriefcase />
                        <span className="text-xs uppercase tracking-wide font-bold">
                          Job Type
                        </span>
                      </div>

                      <p className="text-slate-800 dark:text-slate-200 font-semibold">
                        {job.jobType}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 p-4">
                      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-2">
                        <FiDollarSign />
                        <span className="text-xs uppercase tracking-wide font-bold">
                          Salary
                        </span>
                      </div>

                      <p className="text-slate-800 dark:text-slate-200 font-semibold">
                        {job.salary || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-7">
                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
                      <FiFileText />
                      Job Description
                    </h3>

                    <p className="text-slate-600 dark:text-slate-300 leading-7">
                      {job.description}
                    </p>
                  </div>

                  {/* Skills */}
                  {job.skills?.length > 0 && (
                    <div className="mt-7">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
                        Required Skills
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900 px-3 py-1.5 rounded-lg text-sm font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-7 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <FiUsers />
                      <span>
                        Review and manage applicants for this position.
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() =>
                          navigate(`/jobs/${job._id}/applications`)
                        }
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-sm hover:shadow-md"
                      >
                        View Applicants
                        <FiArrowRight />
                      </button>

                      <button
                        onClick={() => handleDeleteJob(job._id, job.title)}
                        disabled={deletingJobId === job._id}
                        className="inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/70 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 px-6 py-3 rounded-xl font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <FiTrash2 />
                        {deletingJobId === job._id
                          ? "Deleting..."
                          : "Delete Job"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyJobs;
