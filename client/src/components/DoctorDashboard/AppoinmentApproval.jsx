// src/pages/AppointmentApproval.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getDoctorImage } from "../../utils/profileImages"; // Import the doctor image utility
import { API_BASE_URL } from "../../config";

const API = process.env.REACT_APP_API_URL || "https://backend-healthchain.onrender.com";

const AppointmentApproval = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" // "success" or "error"
  });
  const navigate = useNavigate();

  const doctorId = localStorage.getItem("doctorId"); // stored during doctor login
  const doctorName = localStorage.getItem("doctorName") || "Doctor";
  const doctorSpecialization =
    localStorage.getItem("doctorSpecialization") || "Specialist";
  const doctorData = JSON.parse(localStorage.getItem("doctorData"));
  const doctorGender = doctorData?.gender || ""; // Get doctor's gender

  // ✅ Get consistent doctor image based on gender
  const doctorImage = getDoctorImage(doctorGender);

  // ✅ Handle navigation with loading animation
  const handleNavigation = (path, linkName) => {
    setNavLoading(true);
    setActiveLink(linkName);

    setTimeout(() => {
      setNavLoading(false);
      navigate(path);
    }, 400);
  };

  // Fetch appointments for the logged-in doctor
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
<<<<<<< HEAD
        const res = await axios.get(
          `${API_BASE_URL}/api/requests?doctorId=${doctorId}`
        );
=======
       const res = await axios.get(
        `${API}/api/requests?doctorId=${doctorId}`
      );
>>>>>>> 2da723d346a571afec5ac591aa947bb923e316ec
        // Filter out cancelled appointments
        const activeAppointments = res.data.filter(
          (appt) => appt.status !== "Cancelled"
        );
        setAppointments(activeAppointments);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) fetchAppointments();
  }, [doctorId]);

  // Approve Appointment
  const handleApprove = async (id, patientName) => {
    try {
<<<<<<< HEAD
      await axios.put(`${API_BASE_URL}/api/requests/${id}/approve`);
=======
      await axios.put(
      `${API}/api/requests/${id}/approve`
    );
>>>>>>> 2da723d346a571afec5ac591aa947bb923e316ec
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === id ? { ...appt, status: "Confirmed" } : appt
        )
      );
      
      // Show success notification
      setNotification({
        show: true,
        message: `Appointment for ${patientName} approved successfully ✅`,
        type: "success"
      });
      
      // Auto hide after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" });
      }, 3000);
      
    } catch (error) {
      console.error("Error approving appointment:", error);
      
      // Show error notification
      setNotification({
        show: true,
        message: "Failed to approve appointment ❌",
        type: "error"
      });
      
      // Auto hide after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "success" });
      }, 3000);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen font-inter bg-gray-50">
        <aside className="w-72 bg-white p-6 flex flex-col justify-between">
          {/* Sidebar skeleton */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse" />
            <div>
              <div className="h-4 w-24 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        </main>
      </div>
    );

  return (
    <div className="flex min-h-screen font-inter bg-gray-50">
      {/* Success/Error Notification */}
      {notification.show && (
         <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={`p-4 rounded-lg shadow-lg border ${
            notification.type === "success" 
              ? "bg-green-100 text-green-700 border-green-300" 
              : "bg-red-100 text-red-700 border-red-300"
          }`}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">
                {notification.type === "success" ? "check_circle" : "error"}
              </span>
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        </div>
      )}

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
                Dr. {doctorName}
              </span>
              <span className="text-sm text-gray-500">
                {doctorSpecialization}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() =>
                handleNavigation(
                  "/doctor-personal-info",
                  "Personal Information"
                )
              }
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">person</span>
              <span>Personal Information</span>
            </button>

            <button
              onClick={() => handleNavigation("/patient-list", "Patient List")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">group</span>
              <span>Patient List</span>
            </button>

            <span className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-200 text-blue-500">
              <span className="material-symbols-outlined">event_available</span>
              <span>Appointment Approvals</span>
            </span>
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

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto ml-72">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-500 mt-1">
            Manage your upcoming and past appointments
          </p>
        </header>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                  Patient Name
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Time
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="relative py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No active appointments found
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt._id}>
                    <td className="py-4 pl-4 pr-3 text-sm text-gray-800 font-medium">
                      {appt.patientName || "Unknown"}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600">
                      {appt.date || "-"}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600">
                      {appt.time || "-"}
                    </td>
                    <td className="px-3 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appt.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-right">
                      {appt.status === "Pending" && (
                        <button
                          onClick={() => handleApprove(appt._id, appt.patientName)}
                          className="bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AppointmentApproval;
