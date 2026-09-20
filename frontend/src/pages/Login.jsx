import { useState } from "react";
import API from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      window.location.href = "/jobs";
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto shadow-md">
            💼
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mt-5">
            Jobs<span className="text-blue-600">Platform</span>
          </h1>

          <p className="text-gray-500 mt-2">Find. Apply. Grow.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome Back 👋
            </h2>

            <p className="text-gray-500 mt-1">
              Login to your JobsPlatform account.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6">
              <p className="font-semibold">Login failed</p>

              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-5">
              <label className="block text-gray-800 font-bold mb-2">
                Email
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  📧
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-7">
              <label className="block text-gray-800 font-bold mb-2">
                Password
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3.5 rounded-xl font-bold transition shadow-md"
            >
              {loading ? "Signing In..." : "Login →"}
            </button>
          </form>

          {/* Security Note */}
          <div className="border-t border-gray-100 dark:border-slate-800 mt-7 pt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?
            </p>

            <a
              href="/register"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold mt-2 hover:text-blue-700 dark:hover:text-blue-300 transition"
            >
              Create an Account →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
