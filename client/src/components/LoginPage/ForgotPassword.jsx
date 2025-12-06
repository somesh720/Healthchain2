// components/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(

        `${API_BASE_URL}/api/auth/forgot-password`,
        {
          email,
          role,
        }
      );


      setMessage(res.data.message);
      setEmail("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg animate-slide-up">
          <div className="animate-fade-in">
            <h2 className="text-center text-3xl font-bold tracking-tight text-black">
              Forgot Your Password?
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="animate-fade-in-delay">
              <label className="block text-sm font-medium text-black mb-3">
                I am a:
              </label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="patient"
                    checked={role === "patient"}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Patient</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="doctor"
                    checked={role === "doctor"}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Doctor</span>
                </label>
              </div>
            </div>

            {/* Email Input */}
            <div className="animate-fade-in-delay-2">
              <label
                className="block text-sm font-medium text-black"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  autoComplete="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="form-input block w-full rounded-lg border-gray-300 p-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Messages */}
            {message && (
              <div className="rounded-lg bg-green-50 p-4 animate-fade-in">
                <div className="flex">
                  <div className="">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 p-4 animate-fade-in">
                <div className="flex">
                  <div className="">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="animate-fade-in-delay-3">
              <button
                className={`flex w-full justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white transition-all duration-200 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 transform hover:scale-105"
                }`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>
          </form>

          <div className="animate-fade-in-delay-4">
            <p className="mt-6 text-center text-sm text-gray-500">
              Remember your password?
              <Link
                to={role === "patient" ? "/patient-login" : "/doctor-login"}
                className="font-semibold leading-6 text-blue-500 hover:text-blue-600 ml-1 transition-colors"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
