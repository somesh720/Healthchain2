import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const DoctorLogin = () => {
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
      const res = await fetch("http://localhost:5000/api/doctors/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const doctor = data.doctor;

        // ✅ Save doctor info to localStorage
        localStorage.setItem("doctorId", doctor._id);
        localStorage.setItem("doctorName", doctor.fullName);
        localStorage.setItem("doctorSpecialization", doctor.specialization);
        localStorage.setItem("doctorData", JSON.stringify(doctor));

        // Show success animation
        setShowSuccess(true);

        // Navigate after animation
        setTimeout(() => {
          navigate("/doctor-dashboard");
        }, 2000);
      } else {
        setMessage({ 
          text: data.message || "Invalid login credentials", 
          type: "error" 
        });
        setLoading(false);
      }
    } catch (err) {
      setMessage({ 
        text: "Server error. Please try again later.", 
        type: "error" 
      });
      console.error(err);
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
              Welcome back, Doctor! Redirecting to your dashboard...
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

      {/* Main Login Section */}
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg animate-slide-up">
          <div className="animate-fade-in">
            <h2 className="text-center text-3xl font-bold tracking-tight text-black">
              Doctor Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Welcome back to your Medical Records System
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

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="animate-fade-in-delay">
              <label
                className="block text-sm font-medium text-black"
                htmlFor="email"
              >
                Username or Email
              </label>
              <div className="mt-1">
                <input
                  autoComplete="email"
                  className="form-input block w-full rounded-lg border-gray-300 bg-background-light p-3 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  disabled={loading}
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
                  className="form-input block w-full rounded-lg border-gray-300 bg-background-light p-3 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-500 hover:text-blue-600 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Login Button */}
            <div className="animate-fade-in-delay-4">
              <button
                className={`flex w-full justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ${
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

          {/* Signup Link */}
          <div className="animate-fade-in-delay-5">
            <p className="mt-10 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold leading-6 text-blue-500 hover:text-blue-600 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorLogin;