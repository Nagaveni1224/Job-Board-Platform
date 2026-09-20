import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiCheckCircle,
  FiArrowRight,
  FiSearch,
  FiAlertCircle,
  FiClock,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import API from "../services/api";

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  // Read search values from Home page URL
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );

  const [locationTerm, setLocationTerm] = useState(
    searchParams.get("location") || "",
  );

  // Fetch verified jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await API.get("/jobs/verified");

        if (Array.isArray(response.data)) {
          setJobs(response.data);
        } else if (Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.message || "Unable to fetch jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Keep search inputs synchronized with URL
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setLocationTerm(searchParams.get("location") || "");
    setCurrentPage(1);
  }, [searchParams]);

  // Update URL when user searches directly on Jobs page
  const handleSearchChange = (value) => {
    setSearchTerm(value);

    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    setSearchParams(params);
  };

  const handleLocationChange = (value) => {
    setLocationTerm(value);

    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set("location", value);
    } else {
      params.delete("location");
    }

    setSearchParams(params);
  };

  // Clear all filters
  const clearSearch = () => {
    setSearchTerm("");
    setLocationTerm("");
    setSearchParams({});
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const search = searchTerm.toLowerCase().trim();
    const locationSearch = locationTerm.toLowerCase().trim();

    const title = job.title?.toLowerCase() || "";
    const company = job.company?.toLowerCase() || "";
    const jobLocation = job.location?.toLowerCase() || "";
    const skills = job.skills?.join(" ").toLowerCase() || "";

    // Search by title, company or skills
    const matchesSearch =
      !search ||
      title.includes(search) ||
      company.includes(search) ||
      skills.includes(search);

    // Location must match separately
    const matchesLocation =
      !locationSearch || jobLocation.includes(locationSearch);

    return matchesSearch && matchesLocation;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;

  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin mx-auto mb-5"></div>

          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Finding opportunities
          </h2>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Loading verified jobs...
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
          <div className="w-14 h-14 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiAlertCircle size={28} />
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Something went wrong
          </h2>

          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-950">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm mb-6">
              <FiCheckCircle size={16} />
              Verified Opportunities
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Find your next
              <span className="block text-blue-100">opportunity.</span>
            </h1>

            <p className="mt-5 text-blue-100 text-lg md:text-xl max-w-2xl leading-relaxed">
              Explore verified jobs from trusted employers and discover
              opportunities that match your skills and career goals.
            </p>

            {/* ================= SEARCH ================= */}
            <div className="mt-8 max-w-4xl bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-2xl">
              <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                {/* Job Search */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <FiSearch size={21} className="text-slate-400 shrink-0" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Job title, company or skill..."
                    className="w-full bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm md:text-base"
                  />
                </div>

                {/* Location Search */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <FiMapPin size={21} className="text-slate-400 shrink-0" />

                  <input
                    type="text"
                    value={locationTerm}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    placeholder="Location..."
                    className="w-full bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm md:text-base"
                  />
                </div>

                {/* Result Count */}
                <div className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-semibold">
                  <FiBriefcase size={16} />
                  {filteredJobs.length} Jobs
                </div>
              </div>

              {/* Active Search */}
              {(searchTerm || locationTerm) && (
                <div className="flex flex-wrap items-center justify-between gap-3 px-3 pt-3">
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <span className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900 px-3 py-1.5 rounded-lg text-xs font-semibold">
                        Search: {searchTerm}
                      </span>
                    )}

                    {locationTerm && (
                      <span className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900 px-3 py-1.5 rounded-lg text-xs font-semibold">
                        Location: {locationTerm}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={clearSearch}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition"
                  >
                    <FiX size={14} />
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= JOBS CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-2">
              <FiBriefcase size={17} />
              CAREER OPPORTUNITIES
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Available Jobs
            </h2>

            <p className="text-slate-500 dark:text-slate-400 mt-2">
              {filteredJobs.length} verified job
              {filteredJobs.length !== 1 ? "s" : ""} available right now.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start md:self-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
            <FiCheckCircle size={17} className="text-emerald-500" />
            Admin Verified
          </div>
        </div>

        {/* ================= EMPTY STATE ================= */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 md:p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FiSearch size={30} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {jobs.length === 0
                ? "No jobs available"
                : "No matching jobs found"}
            </h2>

            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
              {jobs.length === 0
                ? "Check back later for new verified opportunities."
                : "We couldn't find jobs matching your search. Try another job title, skill or location."}
            </p>

            {jobs.length > 0 && (
              <button
                onClick={clearSearch}
                className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition"
              >
                <FiX />
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ================= JOB CARDS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentJobs.map((job) => (
                <div
                  key={job._id}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Card Body */}
                  <div className="p-6">
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <FiBriefcase size={23} />
                      </div>

                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 px-3 py-1.5 rounded-full text-xs font-bold">
                        <FiCheckCircle size={13} />
                        Verified
                      </span>
                    </div>

                    {/* Job Title */}
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-5 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {job.title}
                    </h2>

                    {/* Company */}
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
                      {job.company}
                    </p>

                    {/* Job Information */}
                    <div className="mt-6 space-y-3">
                      {/* Location */}
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <FiMapPin
                            size={17}
                            className="text-slate-500 dark:text-slate-400"
                          />
                        </div>

                        <span className="text-sm">{job.location}</span>
                      </div>

                      {/* Job Type */}
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <FiClock
                            size={17}
                            className="text-slate-500 dark:text-slate-400"
                          />
                        </div>

                        <span className="text-sm">{job.jobType}</span>
                      </div>

                      {/* Salary */}
                      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <FiDollarSign
                            size={17}
                            className="text-slate-500 dark:text-slate-400"
                          />
                        </div>

                        <span className="text-sm font-medium">
                          {job.salary || "Salary not specified"}
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-6">
                        {job.skills.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          >
                            {skill}
                          </span>
                        ))}

                        {job.skills.length > 4 && (
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-lg text-xs font-semibold">
                            +{job.skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 p-4">
                    <button
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-sm hover:shadow-md"
                    >
                      View Job Details
                      <FiArrowRight size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 shadow-sm">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {startIndex + 1}
                  </span>
                  {" - "}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {Math.min(endIndex, filteredJobs.length)}
                  </span>
                  {" of "}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {filteredJobs.length}
                  </span>{" "}
                  jobs
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <FiChevronLeft size={17} />
                    Previous
                  </button>

                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <span className="sm:hidden text-sm font-bold text-slate-600 dark:text-slate-300 px-2">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next
                    <FiChevronRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Jobs;
