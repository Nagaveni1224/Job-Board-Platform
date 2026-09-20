import { useEffect, useState } from "react";
import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiCalendar,
  FiExternalLink,
  FiAlertCircle,
  FiClipboard,
  FiTrash2,
} from "react-icons/fi";
import API from "../services/api";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingApplicationId, setDeletingApplicationId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await API.get("/applications/my");
        setApplications(response.data.applications || []);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message || "Failed to fetch applications.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Selected":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900";

      case "Shortlisted":
        return "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900";

      case "Rejected":
        return "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900";

      default:
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Selected":
        return <FiCheckCircle size={15} />;

      case "Shortlisted":
        return <FiClock size={15} />;

      case "Rejected":
        return <FiAlertCircle size={15} />;

      default:
        return <FiClipboard size={15} />;
    }
  };

  const handleWithdrawApplication = async (applicationId, jobTitle) => {
    const confirmed = window.confirm(
      `Are you sure you want to withdraw your application for "${jobTitle}"?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingApplicationId(applicationId);
    setError("");

    try {
      await API.delete(`/applications/${applicationId}`);

      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) => application._id !== applicationId,
        ),
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Failed to withdraw application.",
      );
    } finally {
      setDeletingApplicationId(null);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin mx-auto mb-5"></div>

          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Loading applications
          </h2>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error && applications.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6 transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FiAlertCircle size={30} />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Unable to Load Applications
          </h2>

          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-950">
        <div className="absolute -top-28 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-sm">
              <FiClipboard size={28} />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                My Applications
              </h1>

              <p className="text-blue-100 mt-2">
                Track the jobs you have applied for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-2">
              <FiFileText size={17} />
              APPLICATION TRACKER
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Application History
            </h2>

            <p className="text-slate-500 dark:text-slate-400 mt-2">
              {applications.length} application
              {applications.length !== 1 ? "s" : ""} submitted
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
            <FiCheckCircle size={17} className="text-emerald-500" />
            Track your progress
          </div>
        </div>

        {/* Inline Error */}
        {error && applications.length > 0 && (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl px-5 py-4 mb-6">
            <FiAlertCircle size={19} />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {applications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-12 md:p-16 text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FiClipboard size={30} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              No Applications Yet
            </h2>

            <p className="text-slate-500 dark:text-slate-400 mt-2">
              You haven't applied for any jobs yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Application Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                        <FiBriefcase size={23} />
                      </div>

                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {application.job?.title}
                        </h2>

                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                          {application.job?.company}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <span
                      className={`inline-flex items-center gap-2 self-start border px-4 py-2 rounded-full text-sm font-bold ${getStatusStyle(
                        application.status,
                      )}`}
                    >
                      {getStatusIcon(application.status)}
                      {application.status}
                    </span>
                  </div>
                </div>

                {/* Application Body */}
                <div className="p-6">
                  {/* Job Information */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <FiMapPin size={16} />
                        <span className="text-xs uppercase font-bold">
                          Location
                        </span>
                      </div>

                      <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">
                        {application.job?.location}
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <FiClock size={16} />
                        <span className="text-xs uppercase font-bold">
                          Job Type
                        </span>
                      </div>

                      <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">
                        {application.job?.jobType}
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <FiDollarSign size={16} />
                        <span className="text-xs uppercase font-bold">
                          Salary
                        </span>
                      </div>

                      <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">
                        {application.job?.salary || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="mt-7">
                    <div className="flex items-center gap-2 mb-3">
                      <FiFileText
                        size={17}
                        className="text-blue-600 dark:text-blue-400"
                      />

                      <h3 className="font-bold text-slate-800 dark:text-slate-200">
                        Your Cover Letter
                      </h3>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 rounded-xl p-5">
                      <p className="text-slate-600 dark:text-slate-300 leading-7 whitespace-pre-line">
                        {application.coverLetter || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <FiCalendar size={16} />

                      <span>
                        Applied on{" "}
                        {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Resume */}
                      {application.resume && (
                        <a
                          href={application.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                        >
                          <FiFileText size={16} />
                          View Resume
                          <FiExternalLink size={14} />
                        </a>
                      )}

                      {/* Withdraw */}
                      <button
                        type="button"
                        onClick={() =>
                          handleWithdrawApplication(
                            application._id,
                            application.job?.title || "this job",
                          )
                        }
                        disabled={deletingApplicationId === application._id}
                        className="inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 px-4 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {deletingApplicationId === application._id ? (
                          <>
                            <span className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></span>
                            Withdrawing...
                          </>
                        ) : (
                          <>
                            <FiTrash2 size={16} />
                            Withdraw Application
                          </>
                        )}
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

export default MyApplications;
