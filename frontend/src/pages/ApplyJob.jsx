import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiFileText,
  FiLink,
  FiUploadCloud,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
  FiX,
} from "react-icons/fi";
import API from "../services/api";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resumeLink, setResumeLink] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, DOC and DOCX files are allowed.");
      e.target.value = "";
      setResumeFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume file must be 5 MB or smaller.");
      e.target.value = "";
      setResumeFile(null);
      return;
    }

    setError("");
    setResumeFile(file);
    setResumeLink("");
  };

  const removeSelectedFile = () => {
    setResumeFile(null);

    const fileInput = document.getElementById("resume-file");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!resumeLink.trim() && !resumeFile) {
      setError("Please provide a resume link or upload your resume.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("coverLetter", coverLetter);

      if (resumeFile) {
        formData.append("resume", resumeFile);
      } else {
        formData.append("resume", resumeLink.trim());
      }

      await API.post(`/applications/${id}`, formData);

      alert("Application submitted successfully!");

      navigate("/jobs");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Failed to submit application.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <main className="max-w-4xl mx-auto px-6 py-10 md:py-14">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/jobs/${id}`)}
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold mb-7 transition"
        >
          <FiArrowLeft size={18} />
          Back to Job
        </button>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-950 px-7 md:px-10 py-10">
            <div className="absolute -top-24 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-28 -left-20 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl"></div>

            <div className="relative">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-sm">
                  <FiFileText size={27} />
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                    Apply for Job
                  </h1>

                  <p className="text-blue-100 mt-1">
                    Take the next step in your career
                  </p>
                </div>
              </div>

              <p className="text-blue-100 leading-7 max-w-2xl">
                Submit your resume and cover letter to complete your
                application.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-7 md:p-10">
            {/* Error */}
            {error && (
              <div className="flex gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl px-5 py-4 mb-7">
                <FiAlertCircle size={20} className="mt-0.5 shrink-0" />

                <div>
                  <p className="font-bold">Application failed</p>

                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Resume */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Resume
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Paste a resume link or upload your resume as a PDF, DOC or
                  DOCX file.
                </p>

                {/* Resume Link */}
                <div className="relative">
                  <FiLink
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="url"
                    value={resumeLink}
                    onChange={(e) => {
                      setResumeLink(e.target.value);
                      if (e.target.value) {
                        setResumeFile(null);

                        const fileInput =
                          document.getElementById("resume-file");

                        if (fileInput) {
                          fileInput.value = "";
                        }
                      }
                    }}
                    placeholder="https://drive.google.com/your-resume"
                    disabled={!!resumeFile}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:opacity-60"
                  />
                </div>

                <div className="flex items-center gap-3 my-4">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    or
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                </div>

                {/* File Upload */}
                <label
                  htmlFor="resume-file"
                  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl px-5 py-7 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition"
                >
                  <FiUploadCloud
                    size={28}
                    className="text-blue-600 dark:text-blue-400"
                  />

                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Browse Resume
                  </span>

                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    PDF, DOC or DOCX • Maximum 5 MB
                  </span>

                  <input
                    id="resume-file"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Selected File */}
                {resumeFile && (
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <FiCheckCircle className="text-emerald-600 dark:text-emerald-400 shrink-0" />

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 truncate">
                          {resumeFile.name}
                        </p>

                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      className="shrink-0 text-slate-500 hover:text-red-500 transition"
                      title="Remove selected file"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Cover Letter
                  <span className="text-red-500 ml-1">*</span>
                </label>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Tell the employer why you are a good fit for this role.
                </p>

                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write your cover letter here..."
                  rows="9"
                  required
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-4 py-3.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition leading-7"
                />

                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  Keep your message clear, professional and relevant to the job.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    Submit Application
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-500 dark:text-slate-400">
          <FiShield size={16} className="text-emerald-500" />

          <span>Your application information is securely submitted.</span>
        </div>
      </main>
    </div>
  );
};

export default ApplyJob;
