import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // type: "error" or "success"
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" }); // Clear previous messages

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store admin data in localStorage
        localStorage.setItem("adminData", JSON.stringify(data.admin));
        localStorage.setItem("adminId", data.admin._id || data.admin.id);
        localStorage.setItem("adminName", data.admin.name || "Admin");
        localStorage.setItem("isAdmin", "true");

        // Show success animation
        setShowSuccess(true);

        // Navigate after animation
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 2000);
      } else {
        setMessage({ 
          text: data.message || "Login failed. Please check your credentials.", 
          type: "error" 
        });
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setMessage({ 
        text: "Server error. Please try again later.", 
        type: "error" 
      });
      setLoading(false);
    }
  };

  // Clear message when user starts typing
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (message.text) {
      setMessage({ text: "", type: "" });
    }
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Success Animation Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-bounce-in mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-white text-3xl">
                  check
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2 animate-fade-in">
              Login Successful!
            </h3>
            <p className="text-gray-600 animate-fade-in-delay">
              Welcome to Admin Panel! Redirecting to dashboard...
            </p>
            <div className="mt-6 flex justify-center">
              <div className="animate-pulse flex space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animation-delay-200"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animation-delay-400"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg animate-slide-up">
          <div className="animate-fade-in">
            <h2 className="text-center text-3xl font-bold tracking-tight text-black">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Access the Hospital Management System
            </p>
          </div>

          {/* Error/Success Message */}
          {message.text && (
            <div className={`rounded-lg p-4 animate-fade-in ${
              message.type === "error" 
                ? "bg-red-50 border border-red-200 text-red-700" 
                : "bg-green-50 border border-green-200 text-green-700"
            }`}>
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined ${
                  message.type === "error" ? "text-red-500" : "text-green-500"
                }`}>
                  {message.type === "error" ? "error" : "check_circle"}
                </span>
                <div>
                  <p className="font-medium">{message.text}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="animate-fade-in-delay">
              <label
                className="block text-sm font-medium text-black"
                htmlFor="email"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  autoComplete="email"
                  id="email"
                  name="email"
                  placeholder="admin@hospital.com"
                  required
                  type="email"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  disabled={loading}
                  className="form-input block w-full rounded-lg border-gray-300 p-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="animate-fade-in-delay-2">
              <label
                className="block text-sm font-medium text-black"
                htmlFor="password"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  autoComplete="current-password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  disabled={loading}
                  className="form-input block w-full rounded-lg border-gray-300 p-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="animate-fade-in-delay-4">
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
                    Logging in...
                  </div>
                ) : (
                  "Log In"
                )}
              </button>
            </div>
          </form>

          <div className="animate-fade-in-delay-5 text-center">
            <p className="text-sm text-gray-500">
              Use admin credentials to access the system
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;