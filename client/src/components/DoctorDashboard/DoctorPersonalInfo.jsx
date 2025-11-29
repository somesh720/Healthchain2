import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getDoctorImage } from "../../utils/profileImages"; // Import the doctor image utility
import {
  formatTimeToAMPM,
  formatConsultingTimings,
  formatConsultingDaysForDashboard,
} from "../../utils/timeFormatter";

const API = process.env.REACT_APP_API_URL || "https://backend-healthchain.onrender.com";

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [navLoading, setNavLoading] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctorData");
    if (storedDoctor) {
      const doctorData = JSON.parse(storedDoctor);
      setDoctor(doctorData);
      setFormData({
        ...doctorData,
        consultingDays: doctorData.consultingDays || [],
        consultingTimings: doctorData.consultingTimings || {
          startTime: "",
          endTime: "",
        },
      });
    } else {
      navigate("/doctor-login");
    }
  }, [navigate]);

  // Get consistent doctor image based on gender
  const doctorImage = getDoctorImage(doctor?.gender);

  // Handle navigation with loading animation
  const handleNavigation = (path, linkName) => {
    setNavLoading(true);
    setActiveLink(linkName);

    setTimeout(() => {
      setNavLoading(false);
      navigate(path);
    }, 400);
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimingChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      consultingTimings: {
        ...prev.consultingTimings,
        [name]: value,
      },
    }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      consultingDays: prev.consultingDays.includes(day)
        ? prev.consultingDays.filter((d) => d !== day)
        : [...prev.consultingDays, day],
    }));
  };

  const handleSelectAllDays = () => {
    setFormData((prev) => ({
      ...prev,
      consultingDays: daysOfWeek,
    }));
  };

  const handleClearDays = () => {
    setFormData((prev) => ({
      ...prev,
      consultingDays: [],
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage("");

      // Prepare data to match your backend model
      const updateData = {
        // Use both name and fullName for compatibility
        name: formData.fullName || formData.name,
        fullName: formData.fullName || formData.name,
        specialization: formData.specialization,
        experience: formData.experience,
        contact: formData.phone || formData.contact,
        phone: formData.phone || formData.contact,
        email: formData.email,
        consultationFee: Number(formData.consultationFee) || 500,
        consultingDays: formData.consultingDays || [],
        consultingTimings: formData.consultingTimings || {
          startTime: "",
          endTime: "",
        },
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      };

      console.log("Sending update data:", updateData);

    const response = await axios.put(
      `${API}/api/doctors/${doctor._id}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update response:", response);

      if (response.status === 200) {
        const updatedDoctor = response.data.doctor;

        // Update local storage and state
        localStorage.setItem("doctorData", JSON.stringify(updatedDoctor));
        setDoctor(updatedDoctor);
        setFormData({
          ...updatedDoctor,
          consultingDays: updatedDoctor.consultingDays || [],
          consultingTimings: updatedDoctor.consultingTimings || {
            startTime: "",
            endTime: "",
          },
        });

        setMessage("Profile updated successfully!");
        setIsEditing(false);

        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        setMessage(
          `Error: ${
            error.response.data.message ||
            error.response.statusText ||
            "Failed to update profile"
          }`
        );
      } else if (error.request) {
        console.error("Error request:", error.request);
        setMessage(
          "Network error: Could not connect to server. Please check if backend is running."
        );
      } else {
        console.error("Error message:", error.message);
        setMessage(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      ...doctor,
      consultingDays: doctor.consultingDays || [],
      consultingTimings: doctor.consultingTimings || {
        startTime: "",
        endTime: "",
      },
    });
    setIsEditing(false);
    setMessage("");
  };

  if (!doctor)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen font-inter bg-gray-50">
      {/* Navigation Loading Overlay */}
      {navLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">
              Loading {activeLink}...
            </p>
            <p className="text-sm text-gray-500 mt-2">Please wait</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-72 bg-white p-6 flex flex-col justify-between fixed left-0 top-0 bottom-0">
        <div>
          {/* Profile */}
          <div className="flex items-center gap-4 mb-10">
            <div
              className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-gray-200"
              style={{
                backgroundImage: `url("${doctorImage}")`,
              }}
            />
            <div className="flex flex-col">
              <span className="font-semibold text-lg text-black">
                Dr. {doctor.fullName}
              </span>
              <span className="text-sm text-gray-500">
                {doctor.specialization || "Doctor"}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <span className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left">
              <span className="material-symbols-outlined">person</span>
              <span>Personal Information</span>
            </span>

            <button
              onClick={() => handleNavigation("/patient-list", "Patient List")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">group</span>
              <span>Patient List</span>
            </button>

            <button
              onClick={() =>
                handleNavigation(
                  "/appointment-approvals",
                  "Appointment Approvals"
                )
              }
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">event_available</span>
              <span>Appointment Approvals</span>
            </button>
          </nav>
        </div>

        {/* Logout */}
        <nav>
          <button
            onClick={() => handleNavigation("/logout", "Logout")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-red-500 transition-all duration-200 w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto ml-72">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black">
              Personal Information
            </h1>
            <p className="text-gray-500 mt-1">
              View and manage your professional details.
            </p>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("successfully")
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">
                {message.includes("successfully") ? "check_circle" : "error"}
              </span>
              {message}
            </p>
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left - Profile Image */}
            <div className="flex flex-col items-center lg:items-start">
              <div
                className="w-40 h-40 rounded-full bg-cover bg-center mb-4 border-4 border-gray-100 shadow-sm"
                style={{
                  backgroundImage: `url("${doctorImage}")`,
                }}
              />
              <h2 className="text-2xl font-bold text-black">
                Dr. {isEditing ? formData.fullName : doctor.fullName}
              </h2>
              <p className="text-gray-500">
                Doctor ID: {doctor._id?.slice(-6).toUpperCase() || "DOC-XXXXXX"}
              </p>
            </div>

            {/* Right - Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6 lg:mt-0">
              {/* Full Name */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
                    required
                  />
                ) : (
                  <p className="text-lg font-semibold text-black mt-1">
                    {doctor.fullName || "N/A"}
                  </p>
                )}
              </div>

              {/* Specialization */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Specialization
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
                    required
                  />
                ) : (
                  <p className="text-lg font-semibold text-black mt-1">
                    {doctor.specialization || "Not specified"}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Experience
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
                    placeholder="e.g., 5 years"
                  />
                ) : (
                  <p className="text-lg font-semibold text-black mt-1">
                    {doctor.experience || "N/A"}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Contact Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
                  />
                ) : (
                  <p className="text-lg font-semibold text-black mt-1">
                    {doctor.phone || "N/A"}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
                    required
                  />
                ) : (
                  <p className="text-lg font-semibold text-black mt-1">
                    {doctor.email || "N/A"}
                  </p>
                )}
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Consultation Fee
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
                    min="0"
                  />
                ) : (
                  <p className="text-lg font-semibold text-black mt-1">
                    ₹{doctor.consultationFee || "500"}
                  </p>
                )}
              </div>

              {/* Consulting Days */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">
                  Consulting Days
                </label>
                {isEditing ? (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <button
                        type="button"
                        onClick={handleSelectAllDays}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={handleClearDays}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          className={`px-3 py-2 rounded-lg border ${
                            formData.consultingDays?.includes(day)
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-lg font-semibold text-black mt-1">
                    {formatConsultingDaysForDashboard(doctor.consultingDays)}
                  </p>
                )}
              </div>

              {/* Consulting Timings */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">
                  Consulting Timings
                </label>
                {isEditing ? (
                  <div className="flex gap-4 mt-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">
                        Start Time
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.consultingTimings?.startTime || ""}
                        onChange={handleTimingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">End Time</label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.consultingTimings?.endTime || ""}
                        onChange={handleTimingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-lg font-semibold text-black mt-1">
                    {formatConsultingTimings(doctor.consultingTimings)}
                  </p>
                )}
              </div>

              {/* Clinic Address */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">
                  Clinic Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
                    placeholder="Street address"
                  />
                ) : (
                  <p className="text-lg font-semibold text-black mt-1">
                    {doctor.address
                      ? `${doctor.address}, ${doctor.city || ""}, ${
                          doctor.state || ""
                        }, ${doctor.zipCode || ""}`
                      : "N/A"}
                  </p>
                )}
              </div>

              {/* City, State, Zip Code - Only show in edit mode */}
              {isEditing && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined">edit</span>
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">save</span>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined">cancel</span>
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
