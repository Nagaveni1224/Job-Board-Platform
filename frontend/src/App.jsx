import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";

import {
  FiBriefcase,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiSearch,
  FiMapPin,
  FiUsers,
  FiCheckCircle,
  FiTrendingUp,
  FiArrowRight,
  FiLogOut,
  FiPlus,
  FiFileText,
  FiGrid,
} from "react-icons/fi";

import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApplyJob from "./pages/ApplyJob";
import MyApplications from "./pages/MyApplications";
import MyJobs from "./pages/MyJobs";
import JobApplications from "./pages/JobApplications";
import AdminDashboard from "./pages/AdminDashboard";
import CreateJob from "./pages/CreateJob";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Home page search
  const [homeSearch, setHomeSearch] = useState("");
  const [homeLocation, setHomeLocation] = useState("");

  // Latest verified jobs for Home page
  const [latestJobs, setLatestJobs] = useState([]);

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        const response = await fetch("/api/jobs/verified");
        const data = await response.json();

        const jobs = Array.isArray(data) ? data : data.jobs || [];

        const sortedJobs = [...jobs]
          .sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
          )
          .slice(0, 3);

        setLatestJobs(sortedJobs);
      } catch (error) {
        console.error("Failed to fetch latest jobs:", error);
      }
    };

    fetchLatestJobs();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setMobileMenuOpen(false);

    window.location.href = "/login";
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "text-blue-600 dark:text-blue-400"
        : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
    }`;

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Home search
  const handleHomeSearch = () => {
    const search = homeSearch.trim();
    const location = homeLocation.trim();

    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (location) {
      params.set("location", location);
    }

    const query = params.toString();

    window.location.href = query ? `/jobs?${query}` : "/jobs";
  };

  return (
    <BrowserRouter>
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <FiBriefcase size={20} />
            </div>

            <div className="hidden sm:block">
              <div className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">
                Jobs<span className="text-blue-600">Platform</span>
              </div>

              <div className="text-[10px] font-medium tracking-wide text-gray-500 dark:text-gray-400">
                FIND · APPLY · GROW
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/jobs" className={navLinkClass}>
              Jobs
            </NavLink>

            {user?.role === "jobseeker" && (
              <NavLink to="/my-applications" className={navLinkClass}>
                My Applications
              </NavLink>
            )}

            {user?.role === "employer" && (
              <>
                <NavLink to="/my-jobs" className={navLinkClass}>
                  My Jobs
                </NavLink>

                <NavLink
                  to="/create-job"
                  className="ml-2 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <FiPlus size={16} />
                  Create Job
                </NavLink>
              </>
            )}

            {user?.role === "admin" && (
              <NavLink to="/admin" className={navLinkClass}>
                Admin Dashboard
              </NavLink>
            )}
          </div>

          {/* Right Controls */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Logged In */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-900 lg:flex">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <span className="max-w-28 truncate text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              /* Logged Out */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg border border-blue-600 px-5 py-2.5 text-sm font-bold text-blue-600 transition hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950/40"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300"
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-200"
            >
              {mobileMenuOpen ? <FiX size={21} /> : <FiMenu size={21} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950 md:hidden">
            <div className="flex flex-col gap-1">
              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className={navLinkClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/jobs"
                onClick={closeMobileMenu}
                className={navLinkClass}
              >
                Jobs
              </NavLink>

              {user?.role === "jobseeker" && (
                <NavLink
                  to="/my-applications"
                  onClick={closeMobileMenu}
                  className={navLinkClass}
                >
                  My Applications
                </NavLink>
              )}

              {user?.role === "employer" && (
                <>
                  <NavLink
                    to="/my-jobs"
                    onClick={closeMobileMenu}
                    className={navLinkClass}
                  >
                    My Jobs
                  </NavLink>

                  <NavLink
                    to="/create-job"
                    onClick={closeMobileMenu}
                    className={navLinkClass}
                  >
                    Create Job
                  </NavLink>
                </>
              )}

              {user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  onClick={closeMobileMenu}
                  className={navLinkClass}
                >
                  Admin Dashboard
                </NavLink>
              )}

              <div className="my-2 border-t border-gray-200 dark:border-gray-800" />

              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-3 text-left text-sm font-semibold text-red-600"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="mt-2 rounded-lg border border-blue-600 px-4 py-3 text-center text-sm font-bold text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ================= ROUTES ================= */}
      <Routes>
        {/* ================= HOME ================= */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
              {/* Hero */}
              <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/40 dark:via-gray-950 dark:to-indigo-950/30" />

                <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
                  <div className="grid items-center gap-14 lg:grid-cols-2">
                    {/* Left */}
                    <div>
                      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
                        <FiTrendingUp size={16} />
                        Your next opportunity starts here
                      </div>

                      <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl dark:text-white">
                        Find work that
                        <span className="block text-blue-600">
                          moves you forward.
                        </span>
                      </h1>

                      <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-300">
                        Discover verified opportunities, connect with employers,
                        and manage your entire job search from one simple
                        platform.
                      </p>

                      {/* REAL SEARCH */}
                      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                          {/* Search Input */}
                          <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
                            <FiSearch className="shrink-0 text-gray-400" />

                            <input
                              type="text"
                              value={homeSearch}
                              onChange={(e) => setHomeSearch(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleHomeSearch();
                                }
                              }}
                              placeholder="Job title or skill"
                              className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                            />
                          </div>

                          {/* Location Input */}
                          <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
                            <FiMapPin className="shrink-0 text-gray-400" />

                            <input
                              type="text"
                              value={homeLocation}
                              onChange={(e) => setHomeLocation(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleHomeSearch();
                                }
                              }}
                              placeholder="Location"
                              className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                            />
                          </div>

                          {/* Search Button */}
                          <button
                            onClick={handleHomeSearch}
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
                          >
                            Search
                            <FiArrowRight size={17} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-5 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-2">
                          <FiCheckCircle className="text-green-500" />
                          Verified jobs
                        </span>

                        <span className="flex items-center gap-2">
                          <FiCheckCircle className="text-green-500" />
                          Easy applications
                        </span>

                        <span className="flex items-center gap-2">
                          <FiCheckCircle className="text-green-500" />
                          Application tracking
                        </span>
                      </div>
                    </div>

                    {/* Right Visual */}
                    <div className="hidden lg:block">
                      <div className="relative">
                        <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-blue-200/50 blur-2xl dark:bg-blue-600/20" />

                        <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-indigo-200/50 blur-2xl dark:bg-indigo-600/20" />

                        <div className="relative rounded-3xl border border-gray-200 bg-white p-7 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
                          <div className="mb-6 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Recommended for you
                              </p>

                              <h2 className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">
                                Latest opportunities
                              </h2>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                              <FiBriefcase size={21} />
                            </div>
                          </div>

                          <div className="space-y-3">
                            {latestJobs.length > 0 ? (
                              latestJobs.map((job) => (
                                <Link
                                  key={job._id}
                                  to={`/jobs/${job._id}`}
                                  className="block rounded-2xl border border-gray-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-gray-700 dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <h3 className="font-bold text-gray-900 dark:text-white">
                                        {job.title}
                                      </h3>

                                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {job.company}
                                      </p>
                                    </div>

                                    <FiArrowRight className="mt-1 shrink-0 text-gray-400" />
                                  </div>

                                  <div className="mt-3 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                      {job.salary}
                                    </span>

                                    <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                                      <FiCheckCircle size={13} />
                                      Verified
                                    </span>
                                  </div>
                                </Link>
                              ))
                            ) : (
                              <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                                No verified jobs available yet.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Stats */}
              <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
                  {[
                    {
                      number: "Verified",
                      label: "Job listings",
                    },
                    {
                      number: "Easy",
                      label: "Applications",
                    },
                    {
                      number: "Real-time",
                      label: "Status tracking",
                    },
                    {
                      number: "Secure",
                      label: "Authentication",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="border-gray-200 px-5 py-4 text-center first:border-l-0 md:border-l dark:border-gray-800"
                    >
                      <div className="text-xl font-extrabold text-gray-900 dark:text-white">
                        {item.number}
                      </div>

                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Features */}
              <section className="bg-gray-50 py-20 dark:bg-gray-950">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Built for your career
                    </p>

                    <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                      Everything you need in one place
                    </h2>

                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      A simple platform for discovering jobs, applying to
                      opportunities, and managing hiring.
                    </p>
                  </div>

                  <div className="mt-12 grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                        <FiSearch size={22} />
                      </div>

                      <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
                        Discover Jobs
                      </h3>

                      <p className="mt-3 leading-7 text-gray-600 dark:text-gray-400">
                        Browse verified opportunities and find roles that match
                        your skills and career goals.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        <FiFileText size={22} />
                      </div>

                      <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
                        Apply with Ease
                      </h3>

                      <p className="mt-3 leading-7 text-gray-600 dark:text-gray-400">
                        Submit your resume and cover letter and keep track of
                        every application in one place.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
                        <FiUsers size={22} />
                      </div>

                      <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
                        Hire Great Talent
                      </h3>

                      <p className="mt-3 leading-7 text-gray-600 dark:text-gray-400">
                        Employers can create openings, review applicants, and
                        manage their hiring process.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* CTA */}
              <section className="bg-white py-20 dark:bg-gray-900">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                  <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-center text-white shadow-xl sm:px-12">
                    <FiGrid className="mx-auto mb-5" size={30} />

                    <h2 className="text-3xl font-black sm:text-4xl">
                      Ready for your next opportunity?
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-blue-100">
                      Explore verified jobs and take the next step in your
                      career today.
                    </p>

                    <Link
                      to="/jobs"
                      className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-blue-600 shadow-sm transition hover:bg-blue-50"
                    >
                      Explore Jobs
                      <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">
                  <div className="flex items-center justify-center gap-2 md:justify-start">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <FiBriefcase size={15} />
                    </div>

                    <span className="font-bold text-gray-900 dark:text-white">
                      JobsPlatform
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Find. Apply. Grow. © 2026 JobsPlatform
                  </p>
                </div>
              </footer>
            </div>
          }
        />

        {/* ================= OTHER ROUTES ================= */}

        <Route path="/jobs" element={<Jobs />} />

        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route path="/jobs/:id/apply" element={<ApplyJob />} />

        <Route path="/my-applications" element={<MyApplications />} />

        <Route path="/my-jobs" element={<MyJobs />} />

        <Route path="/create-job" element={<CreateJob />} />

        <Route path="/jobs/:jobId/applications" element={<JobApplications />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
