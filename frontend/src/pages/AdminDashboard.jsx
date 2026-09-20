import { useEffect, useState } from "react";
import API from "../services/api";

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await API.get("/jobs/employer");

      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const verifyJob = async (jobId) => {
    try {
      await API.put(`/jobs/${jobId}/verify`);

      alert("Job verified successfully!");

      fetchJobs();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to verify job.");
    }
  };

  const verifiedJobs = jobs.filter((job) => job.isVerified).length;

  const pendingJobs = jobs.filter((job) => !job.isVerified).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
              🛡️
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">
                Admin Dashboard
              </h1>

              <p className="text-blue-100 mt-1">
                Manage and verify job listings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Dashboard Summary */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-semibold">
                  Total Jobs
                </p>

                <p className="text-3xl font-extrabold text-gray-900 mt-2">
                  {jobs.length}
                </p>
              </div>

              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                💼
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-semibold">
                  Verified Jobs
                </p>

                <p className="text-3xl font-extrabold text-green-600 mt-2">
                  {verifiedJobs}
                </p>
              </div>

              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                ✓
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-semibold">
                  Pending Jobs
                </p>

                <p className="text-3xl font-extrabold text-yellow-600 mt-2">
                  {pendingJobs}
                </p>
              </div>

              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                ⏳
              </div>
            </div>
          </div>
        </div>

        {/* Management Information */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="text-3xl mb-4">💼</div>

            <h2 className="text-xl font-bold text-gray-900">Manage Jobs</h2>

            <p className="text-gray-500 mt-2 leading-6">
              Review job listings submitted by employers.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="text-3xl mb-4">✓</div>

            <h2 className="text-xl font-bold text-gray-900">Verify Jobs</h2>

            <p className="text-gray-500 mt-2 leading-6">
              Verify job postings before they become visible to job seekers.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="text-3xl mb-4">👥</div>

            <h2 className="text-xl font-bold text-gray-900">Manage Users</h2>

            <p className="text-gray-500 mt-2 leading-6">
              Monitor the jobseekers and employers using the platform.
            </p>
          </div>
        </div>

        {/* Job Listings */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Job Listings</h2>

            <p className="text-gray-500 mt-1">
              Review and verify employer job postings.
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-gray-600 font-medium">Loading job listings...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Unable to Load Jobs
            </h2>

            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="text-6xl mb-5">📭</div>

            <h2 className="text-xl font-bold text-gray-800">No Jobs Found</h2>

            <p className="text-gray-500 mt-2">
              There are currently no job listings to review.
            </p>
          </div>
        )}

        {/* Job Cards */}
        {!loading && !error && jobs.length > 0 && (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                        💼
                      </div>

                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                          {job.title}
                        </h3>

                        <p className="text-gray-600 font-medium mt-1">
                          🏢 {job.company}
                        </p>
                      </div>
                    </div>

                    {/* Verification */}
                    {job.isVerified ? (
                      <span className="inline-flex items-center justify-center bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-full text-sm font-bold">
                        ✓ Verified
                      </span>
                    ) : (
                      <button
                        onClick={() => verifyJob(job._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-sm"
                      >
                        ✓ Verify Job
                      </button>
                    )}
                  </div>
                </div>

                {/* Job Details */}
                <div className="p-6">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                        Location
                      </p>

                      <p className="text-gray-800 font-semibold">
                        📍 {job.location}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                        Job Type
                      </p>

                      <p className="text-gray-800 font-semibold">
                        💼 {job.jobType}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                        Salary
                      </p>

                      <p className="text-gray-800 font-semibold">
                        💰 {job.salary || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-6">
                    <h3 className="font-bold text-gray-800 mb-2">
                      Job Description
                    </h3>

                    <p className="text-gray-600 leading-7">{job.description}</p>
                  </div>

                  {/* Skills */}
                  {job.skills?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-bold text-gray-800 mb-3">
                        Required Skills
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full text-sm font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
