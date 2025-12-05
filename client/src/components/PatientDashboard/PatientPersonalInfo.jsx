import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getPatientImage } from "../../utils/profileImages"; // Import the specific patient image function
import { API_BASE_URL } from "../../config";

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [navLoading, setNavLoading] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedPatient = localStorage.getItem("patientData");
    if (storedPatient) {
      const patientData = JSON.parse(storedPatient);
      setPatient(patientData);
      setFormData(patientData);
    } else {
      navigate("/patient-login");
    }
  }, [navigate]);

  // Get consistent profile image based on gender using the utility
  const patientImage = getPatientImage(patient?.gender);

  // Handle navigation with loading animation
  const handleNavigation = (path, linkName) => {
    setNavLoading(true);
    setActiveLink(linkName);

    setTimeout(() => {
      setNavLoading(false);
      navigate(path);
    }, 400);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage("");

      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        gender: formData.gender,
        bloodgroup: formData.bloodgroup,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      };

      console.log("Sending patient update data:", updateData);

      const response = await axios.put(
        `${API_BASE_URL}/api/patients/${patient._id}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update response:", response);

      if (response.status === 200) {
        const updatedPatient = response.data.patient;

        // Update local storage and state
        localStorage.setItem("patientData", JSON.stringify(updatedPatient));
        setPatient(updatedPatient);
        setFormData(updatedPatient);

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
    setFormData(patient);
    setIsEditing(false);
    setMessage("");
  };

  const getValue = (value, fallback = "Not Provided") => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === "string")
      return value.trim() !== "" ? value : fallback;
    return value;
  };

  if (!patient)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen font-inter bg-gray-50">
      {/* Loading Overlay */}
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
                backgroundImage: `url("${patientImage}")`,
              }}
            />
            <div className="flex flex-col">
              <span className="font-semibold text-lg text-black">
                {patient.fullName}
              </span>
              <span className="text-sm text-gray-500">Patient</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <span className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-200 text-blue-500">
              <span className="material-symbols-outlined">person</span>
              <span>Personal Information</span>
            </span>

            <button
              onClick={() => handleNavigation("/reports", "Reports")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">description</span>
              <span>Reports</span>
            </button>

            <button
              onClick={() => handleNavigation("/doctors", "Doctors")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">group</span>
              <span>Doctors</span>
            </button>

            <button
              onClick={() =>
                handleNavigation("/requests", "Appointment Requests")
              }
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">checklist</span>
              <span>Requests</span>
            </button>

            <button
              onClick={() =>
                handleNavigation("/patient-prescription", "Prescriptions")
              }
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">medication</span>
              <span>Prescription</span>
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
              View and manage your personal details.
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

        {/* Profile Info */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left - Profile Image Section */}
            <div className="flex flex-col items-center lg:items-start">
              <div
                className="w-40 h-40 rounded-full bg-cover bg-center mb-4 border-4 border-gray-100 shadow-sm"
                style={{
                  backgroundImage: `url("${patientImage}")`,
                }}
              />
              <h2 className="text-2xl font-bold text-black text-center lg:text-left">
                {isEditing
                  ? formData.fullName
                  : getValue(patient.fullName, "Unnamed")}
              </h2>
              <p className="text-gray-500 text-center lg:text-left">
                Patient ID:{" "}
                {patient._id?.slice(-6).toUpperCase() || "PAT-XXXXXX"}
              </p>
            </div>

            {/* Right Section - Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6 lg:mt-0">
              {[
                {
                  label: "Full Name",
                  name: "fullName",
                  value: formData.fullName || "",
                  type: "text",
                  required: true,
                },
                {
                  label: "Email",
                  name: "email",
                  value: formData.email || "",
                  type: "email",
                  required: true,
                },
                {
                  label: "Phone",
                  name: "phone",
                  value: formData.phone || "",
                  type: "tel",
                },
                {
                  label: "Age",
                  name: "age",
                  value: formData.age || "",
                  type: "number",
                },
                {
                  label: "Gender",
                  name: "gender",
                  value: formData.gender || "",
                  type: "select",
                  options: ["Male", "Female", "Other", "Prefer not to say"],
                },
                {
                  label: "Blood Group",
                  name: "bloodgroup",
                  value: formData.bloodgroup || "",
                  type: "select",
                  options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
                },
                {
                  label: "Address",
                  name: "address",
                  value: formData.address || "",
                  type: "text",
                },
                {
                  label: "City",
                  name: "city",
                  value: formData.city || "",
                  type: "text",
                },
                {
                  label: "State",
                  name: "state",
                  value: formData.state || "",
                  type: "text",
                },
                {
                  label: "Zip Code",
                  name: "zipCode",
                  value: formData.zipCode || "",
                  type: "text",
                },
              ].map((field, index) => (
                <div
                  key={index}
                  className={field.colSpan ? "md:col-span-2" : ""}
                >
                  <label className="text-sm font-medium text-gray-500">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {isEditing ? (
                    field.type === "select" ? (
                      <select
                        name={field.name}
                        value={field.value}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={field.value}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-1"
                        required={field.required}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        min={field.type === "number" ? "0" : undefined}
                      />
                    )
                  ) : (
                    <p className="text-lg font-semibold text-black mt-1">
                      {getValue(field.value)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined">edit</span>
                <span>Edit Information</span>
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

export default PatientDashboard;
