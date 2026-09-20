import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiLock,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import API from "../services/api";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkingApplication, setCheckingApplication] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchJobAndApplication = async () => {
      try {
        const jobResponse = await API.get(`/jobs/${id}`);

        setJob(jobResponse.data.job);

        if (user?.role === "jobseeker") {
          setCheckingApplication(true);

          try {
            const applicationResponse = await API.get("/applications/my");

            const applications = applicationResponse.data.applications || [];

            const alreadyApplied = applications.some(
              (application) => application.job?._id === id,
            );

            setHasApplied(alreadyApplied);
          } catch (applicationError) {
            console.error(
              "Unable to check application status:",
              applicationError,
            );
          } finally {
            setCheckingApplication(false);
          }
        }
      } catch (error) {
        console.error("JOB DETAILS ERROR:", error);

        setError(
          error.response?.data?.message || "Unable to fetch job details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplication();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin mx-auto mb-5"></div>

          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Loading job details
          </h2>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6 transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FiAlertCircle size={30} />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            Unable to Load Job
          </h2>

          <p className="text-red-500 dark:text-red-400 mb-6">{error}</p>

          <button
            onClick={() => navigate("/jobs")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition"
          >
            <FiArrowLeft size={17} />
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  // Job not found
  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <div className="text-center">
          <FiBriefcase size={42} className="mx-auto text-slate-400 mb-4" />

          <p className="text-slate-600 dark:text-slate-300 font-medium">
            Job not found.
          </p>

          <button
            onClick={() => navigate("/jobs")}
            className="mt-5 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-950">
        {/* Decorative shapes */}
        <div className="absolute -top-32 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-6 py-10 md:py-14">
          {/* Back button */}
          <button
            onClick={() => navigate("/jobs")}
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white font-semibold transition mb-8"
          >
            <FiArrowLeft size={18} />
            Back to Jobs
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-3xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-300/30 text-emerald-100 px-3 py-1.5 rounded-full text-sm font-bold">
                  <FiCheckCircle size={15} />
                  Verified Job
                </span>

                <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                  <FiClock size={15} />
                  {job.jobType}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                {job.title}
              </h1>

              <div className="flex items-center gap-2 mt-4 text-blue-100 text-lg">
                <FiBriefcase size={19} />
                <span>{job.company}</span>
              </div>
            </div>

            {/* Job Icon */}
            <div className="hidden md:flex w-24 h-24 bg-white/10 border border-white/20 rounded-3xl items-center justify-center text-white backdrop-blur-sm">
              <FiBriefcase size={42} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-7">
            {/* Overview */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <FiBriefcase size={20} />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Job Overview
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Location */}
                <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <FiMapPin size={17} />
                    <span className="text-sm">Location</span>
                  </div>

                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {job.location}
                  </p>
                </div>

                {/* Job Type */}
                <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <FiClock size={17} />
                    <span className="text-sm">Job Type</span>
                  </div>

                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {job.jobType}
                  </p>
                </div>

                {/* Salary */}
                <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <FiDollarSign size={17} />
                    <span className="text-sm">Salary</span>
                  </div>

                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {job.salary || "Not specified"}
                  </p>
                </div>

                {/* Company */}
                <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <FiBriefcase size={17} />
                    <span className="text-sm">Company</span>
                  </div>

                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {job.company}
                  </p>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <FiFileText size={20} />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Job Description
                </h2>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-8 whitespace-pre-line">
                {job.description}
              </p>
            </section>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                    <FiCheckCircle size={20} />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Required Skills
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900 px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Application Card */}
          <div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-7 sticky top-24">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-5">
                <FiFileText size={23} />
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Interested in this job?
              </h2>

              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-6 leading-relaxed">
                Take the next step and submit your application to
                {` ${job.company}`}.
              </p>

              {/* Employer/Admin */}
              {user?.role !== "jobseeker" ? (
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl p-4 text-sm font-medium">
                  <div className="flex items-center gap-2 mb-1">
                    <FiLock size={16} />
                    <span className="font-bold">Application Restricted</span>
                  </div>

                  <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">
                    Only job seeker accounts can apply for jobs.
                  </p>
                </div>
              ) : checkingApplication ? (
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl p-4 text-sm">
                  Checking application status...
                </div>
              ) : hasApplied ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 rounded-xl p-5">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-3">
                    <FiCheckCircle size={22} />
                  </div>

                  <p className="font-bold">Application Submitted</p>

                  <p className="text-sm mt-1">
                    You have already applied for this job.
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => navigate(`/jobs/${job._id}/apply`)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Apply Now
                  <FiArrowRight size={18} />
                </button>
              )}

              {/* Verification */}
              <div className="border-t border-slate-100 dark:border-slate-800 mt-6 pt-5">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <FiCheckCircle size={15} className="text-emerald-500" />

                  <span>Verified by JobsPlatform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;
