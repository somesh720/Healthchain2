import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getPatientImage } from "../../utils/profileImages"; // Import the profile image utility
import { API_BASE_URL } from "../../config";

const Requests = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [error, setError] = useState(null);
  const [cancelPopup, setCancelPopup] = useState({
    show: false,
    appointmentId: null,
    doctorName: ""
  });
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const patientId = localStorage.getItem("patientId");
  const patientName = localStorage.getItem("patientName") || "Patient";
  const patientGender = localStorage.getItem("patientGender") || ""; // Get gender from localStorage

  // Get consistent profile image based on gender
  const patientImage = getPatientImage(patientGender);

  // Handle navigation with loading animation
  const handleNavigation = (path, linkName) => {
    setNavLoading(true);
    setActiveLink(linkName);

    setTimeout(() => {
      setNavLoading(false);
      navigate(path);
    }, 400);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // 🔹 Check if appointment has prescription
  const checkPrescription = async (appointmentId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/prescriptions/appointment/${appointmentId}`
      );
      return res.data.exists;
    } catch (error) {
      console.error("Error checking prescription:", error);
      return false;
    }
  };

  // 🔹 Fetch all appointments for this patient with prescription status
  useEffect(() => {
    const fetchAppointmentsWithPrescriptions = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!patientId) {
          setError("No patient info found. Please log in again.");
          setLoading(false);
          return;
        }

        // Fetch appointments
        const res = await axios.get(
          `${API_BASE_URL}/api/requests?patientId=${patientId}`
        );

        const appointmentsData = Array.isArray(res.data) ? res.data : [];

        // Check prescriptions for each appointment
        const appointmentsWithPrescriptions = await Promise.all(
          appointmentsData.map(async (appointment) => {
            const hasPrescription = await checkPrescription(appointment._id);
            return {
              ...appointment,
              hasPrescription: hasPrescription,
            };
          })
        );

        setAppointments(appointmentsWithPrescriptions);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointment requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentsWithPrescriptions();
  }, [patientId]);

  // 🔹 Show cancel confirmation popup
  const showCancelPopup = (appointmentId, doctorName) => {
    setCancelPopup({
      show: true,
      appointmentId: appointmentId,
      doctorName: doctorName
    });
  };

  // 🔹 Confirm cancellation
  const confirmCancel = async () => {
    const { appointmentId } = cancelPopup;
    
    try {
      await axios.put(
        `${API_BASE_URL}/api/requests/${appointmentId}/cancel`
      );

      // Update UI immediately
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === appointmentId ? { ...a, status: "Cancelled" } : a
        )
      );

      // Show success message
      setSuccessMessage("Appointment cancelled successfully.");
      
      // Close popup
      setCancelPopup({ show: false, appointmentId: null, doctorName: "" });
      
      // Auto hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
    } catch (err) {
      console.error("Cancel error:", err);
      setSuccessMessage("Failed to cancel appointment.");
      
      // Auto hide error message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };

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

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`p-4 rounded-lg shadow-lg ${
            successMessage.includes("Failed") 
              ? "bg-red-100 text-red-700 border border-red-300" 
              : "bg-green-100 text-green-700 border border-green-300"
          }`}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">
                {successMessage.includes("Failed") ? "error" : "check_circle"}
              </span>
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Popup - Uses page background */}
      {cancelPopup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600 text-lg">
                  warning
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Cancel Appointment
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your appointment with{" "}
              <span className="font-semibold">Dr. {cancelPopup.doctorName}</span>? 
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setCancelPopup({ show: false, appointmentId: null, doctorName: "" })}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Fixed */}
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
            <div>
              <span className="font-semibold text-lg">{patientName}</span>
              <p className="text-sm text-gray-500">Patient</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() =>
                handleNavigation(
                  "/patient-personal-info",
                  "Personal Information"
                )
              }
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">person</span>
              <span>Personal Information</span>
            </button>

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

            <span className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-200 text-blue-500">
              <span className="material-symbols-outlined">checklist</span>
              <span>Requests</span>
            </span>

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
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-red-500 transition-all duration-200 w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content - Scrollable */}
      <main className="flex-1 p-8 overflow-y-auto ml-72">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black">
              Appointment Requests
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your appointment bookings and view their status.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading your appointments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="material-symbols-outlined text-red-500 text-4xl mb-3">
                error
              </div>
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          ) : appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-sm text-gray-500 border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Doctor</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Time</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr
                      key={appointment._id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">
                          Dr. {appointment.doctorName}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {appointment.date
                          ? new Date(appointment.date).toLocaleDateString()
                          : "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {appointment.time || "Not specified"}
                      </td>
                      <td className="px-6 py-4">
                        {appointment.status === "Confirmed" ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Confirmed
                          </span>
                        ) : appointment.status === "Cancelled" ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            Cancelled
                          </span>
                        ) : appointment.status === "Completed" ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            Completed
                          </span>
                        ) : appointment.hasPrescription ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            Prescribed
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {/* Hide cancel button for cancelled, completed appointments or those with prescriptions */}
                        {appointment.status === "Cancelled" ||
                        appointment.status === "Completed" ||
                        appointment.hasPrescription ? (
                          <span className="text-gray-400">-</span>
                        ) : (
                          <button
                            onClick={() => showCancelPopup(appointment._id, appointment.doctorName)}
                            className="text-red-500 hover:text-red-700 font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">
                event_note
              </span>
              <p className="text-gray-500 text-lg mb-2">
                No Appointment Requests
              </p>
              <p className="text-gray-400 text-sm">
                You don't have any appointment requests yet.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Requests;