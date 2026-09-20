import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await API.get(`/applications/${jobId}`);

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
  }, [jobId]);

  const updateStatus = async (applicationId, status) => {
    try {
      const response = await API.put(`/applications/${applicationId}/status`, {
        status,
      });

      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status: response.data.application.status,
              }
            : application,
        ),
      );

      alert("Application status updated successfully!");
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);

      alert(
        error.response?.data?.message || "Failed to update application status.",
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Selected":
        return "bg-green-50 text-green-700 border-green-200";

      case "Shortlisted":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600 font-medium">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-8 text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Unable to Load Applications
          </h2>

          <p className="text-red-500 mb-6">{error}</p>

          <button
            onClick={() => navigate("/my-jobs")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition"
          >
            ← Back to My Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <button
            onClick={() => navigate("/my-jobs")}
            className="text-blue-100 hover:text-white mb-7 transition font-medium"
          >
            ← Back to My Jobs
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
              👥
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">
                Job Applications
              </h1>

              <p className="text-blue-100 mt-1">
                Review applicants and manage their application status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Summary */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Applicants</h2>

            <p className="text-gray-500 mt-1">
              {applications.length} applicant
              {applications.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="hidden sm:block bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">
            📌 Review applications
          </div>
        </div>

        {/* Empty State */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="text-6xl mb-5">📭</div>

            <h2 className="text-xl font-bold text-gray-800">
              No Applications Yet
            </h2>

            <p className="text-gray-500 mt-2">
              No applications have been received for this job yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* Applicant Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl shrink-0">
                        👤
                      </div>

                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                          {application.applicant?.name || "Applicant"}
                        </h2>

                        <p className="text-gray-600 mt-1">
                          📧{" "}
                          {application.applicant?.email ||
                            "Email not available"}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold border ${getStatusStyle(
                        application.status,
                      )}`}
                    >
                      {application.status === "Selected" && "✓ "}

                      {application.status === "Shortlisted" && "★ "}

                      {application.status === "Rejected" && "✕ "}

                      {application.status === "Applied" && "• "}

                      {application.status}
                    </span>
                  </div>
                </div>

                {/* Application Details */}
                <div className="p-6">
                  {/* Job */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                      Applied For
                    </p>

                    <p className="text-gray-900 font-bold">
                      💼 {application.job?.title}
                    </p>
                  </div>

                  {/* Status + Resume */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Update Status */}
                    <div className="bg-gray-50 rounded-xl p-5">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                        Application Status
                      </p>

                      <select
                        value={application.status}
                        onChange={(e) =>
                          updateStatus(application._id, e.target.value)
                        }
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      >
                        <option value="Applied">Applied</option>

                        <option value="Shortlisted">Shortlisted</option>

                        <option value="Rejected">Rejected</option>

                        <option value="Selected">Selected</option>
                      </select>

                      <p className="text-xs text-gray-500 mt-2">
                        Change the applicant's current status.
                      </p>
                    </div>

                    {/* Resume */}
                    <div className="bg-gray-50 rounded-xl p-5">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                        Resume
                      </p>

                      {application.resume ? (
                        <p className="text-blue-600 font-medium break-all">
                          📄 {application.resume}
                        </p>
                      ) : (
                        <p className="text-gray-500">Not provided</p>
                      )}
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="mt-6">
                    <h3 className="font-bold text-gray-800 mb-3">
                      Cover Letter
                    </h3>

                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                      <p className="text-gray-600 leading-7 whitespace-pre-line">
                        {application.coverLetter || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Applied Date */}
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      📅 Applied on{" "}
                      {new Date(application.createdAt).toLocaleDateString()}
                    </p>
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

export default JobApplications;
