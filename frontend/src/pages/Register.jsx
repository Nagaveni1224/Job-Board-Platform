import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";
import API from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("jobseeker");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12 transition-colors">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg">
            <FiBriefcase size={32} />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-5">
            Jobs<span className="text-blue-600">Platform</span>
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Find. Apply. Grow.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-7 md:p-8">
          {/* Heading */}
          <div className="mb-7">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <FiUserPlus size={20} />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Create Account
              </h2>
            </div>

            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Join JobsPlatform and discover new opportunities.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 mb-6">
              <p className="font-semibold">Registration failed</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-xl px-4 py-3 mb-6">
              <div className="flex items-center gap-2">
                <FiCheckCircle size={18} />
                <p className="font-semibold">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Name */}
            <div className="mb-5">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                Full Name
              </label>

              <div className="relative">
                <FiUser
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                Email Address
              </label>

              <div className="relative">
                <FiMail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                Password
              </label>

              <div className="relative">
                <FiLock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  minLength={6}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Password must contain at least 6 characters.
              </p>
            </div>

            {/* Account Type */}
            <div className="mb-7">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                Account Type
              </label>

              <div className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3.5">
                Job Seeker
              </div>

              <p className="text-xs text-slate-400 mt-2">
                New accounts are registered as Job Seekers. Employer accounts
                are managed separately.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-3.5 rounded-xl font-bold transition shadow-md hover:shadow-lg"
            >
              <FiUserPlus size={18} />

              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="border-t border-slate-100 dark:border-slate-800 mt-7 pt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mt-2 hover:text-blue-700 dark:hover:text-blue-300 transition"
            >
              <FiArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
