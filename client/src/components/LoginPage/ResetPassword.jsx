// src/components/LoginPage/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const role = searchParams.get("role");

  useEffect(() => {
    if (!token || !role) {
      setError("Invalid reset link. Please request a new one.");
    }
  }, [token, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending reset request:", { token, role });

      const res = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        {
          token,
          role,
          newPassword,
        }
      );

      setMessage(res.data.message || "Password reset successfully!");

      // Redirect to appropriate login page after success
      setTimeout(() => {
        console.log(`Redirecting to login page for ${role}...`);

        if (role === "patient") {
          navigate("/patient-login", {
            state: {
              message:
                "Password reset successfully! Please login with your new password.",
            },
          });
        } else if (role === "doctor") {
          navigate("/doctor-login", {
            state: {
              message:
                "Password reset successfully! Please login with your new password.",
            },
          });
        } else {
          navigate("/", {
            state: {
              message:
                "Password reset successfully! Please login with your new password.",
            },
          });
        }
      }, 3000);
    } catch (error) {
      console.error("Reset password error:", error);

      if (error.response) {
        setError(error.response.data?.message || "Failed to reset password");
      } else if (error.request) {
        setError("Network error. Please check if the server is running.");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token || !role) {
    return (
      <div className="flex h-screen flex-col">
        <main className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg animate-slide-up">
            <div className="text-center">
              <svg
                className="h-16 w-16 text-red-500 mx-auto mb-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Invalid Reset Link
              </h2>
              <p className="text-gray-600 mb-6">
                This password reset link is invalid or has expired.
              </p>
              <Link
                to="/forgot-password"
                className="font-semibold text-blue-500 hover:text-blue-600 transition-colors"
              >
                Request a new reset link
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg animate-slide-up">
          <div className="animate-fade-in">
            <h2 className="text-center text-3xl font-bold tracking-tight text-black">
              Reset Your Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your new password below for your{" "}
              <span className="font-medium capitalize">{role}</span> account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="animate-fade-in-delay">
                <label
                  className="block text-sm font-medium text-black"
                  htmlFor="newPassword"
                >
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className="form-input block w-full rounded-lg border-gray-300 p-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter new password (min. 6 characters)"
                    minLength="6"
                  />
                </div>
              </div>

              <div className="animate-fade-in-delay-2">
                <label
                  className="block text-sm font-medium text-black"
                  htmlFor="confirmPassword"
                >
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="form-input block w-full rounded-lg border-gray-300 p-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Confirm new password"
                    minLength="6"
                  />
                </div>
              </div>
            </div>

            {/* Success Message */}
            {message && (
              <div className="rounded-lg bg-green-50 p-4 animate-fade-in">
                <div className="flex">
                  <div className="flex-shrink-0">
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
                    <p className="text-sm text-green-600 mt-1">
                      Redirecting to{" "}
                      {role === "patient"
                        ? "Patient"
                        : role === "doctor"
                        ? "Doctor"
                        : ""}{" "}
                      login in 3 seconds...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 animate-fade-in">
                <div className="flex">
                  <div className="flex-shrink-0">
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
                    Resetting...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
