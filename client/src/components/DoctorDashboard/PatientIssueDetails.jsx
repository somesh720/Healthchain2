import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getPatientImage } from "../../utils/profileImages"; // Import the patient image utility
import { API_BASE_URL } from "../../config";



const PatientIssueDetails = () => {
  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDoctorId, setCurrentDoctorId] = useState("");

  useEffect(() => {
    const storedPatient = localStorage.getItem("selectedPatient");
    const doctorData = JSON.parse(localStorage.getItem("doctorData"));
    const doctorId = doctorData?._id || localStorage.getItem("doctorId");

    setCurrentDoctorId(doctorId);

    if (storedPatient) {
      const patientData = JSON.parse(storedPatient);
      console.log("📋 Patient data from localStorage:", patientData);

      // Check if the selected patient appointment itself is cancelled
      if (
        patientData.status === "Cancelled" ||
        patientData.status === "cancelled"
      ) {
        console.log("❌ Selected appointment is cancelled, redirecting...");
        setLoading(false);
        return;
      }

      console.log("👨‍⚕️ Current Doctor ID:", doctorId);
      console.log("📅 Selected Appointment Date:", patientData.date);
      console.log("⏰ Selected Appointment Time:", patientData.time);
      setPatient(patientData);

      // Fetch reports using the correct API endpoint from your route
      fetchDoctorSpecificReports(
        patientData.patientId,
        doctorId,
        patientData.date,
        patientData.time
      );
    } else {
      setLoading(false);
    }
  }, []);

  // Get consistent patient image based on gender
  const patientImage = getPatientImage(patient?.gender);

  const fetchDoctorSpecificReports = async (
    patientId,
    doctorId,
    appointmentDate,
    appointmentTime
  ) => {
    try {
      setLoading(true);

      console.log("🎯 Fetching reports for:", {
        patientId,
        doctorId,
        appointmentDate,
        appointmentTime,
      });

      // ✅ Use the correct API endpoint from your route
      // GET /api/requests?patientId=123 OR /api/requests?doctorId=456
      const allAppointmentsResponse = await axios.get(

        `${API_BASE_URL}/api/requests?patientId=${patientId}`
      );


      console.log(
        "📋 All appointments for patient from /api/requests:",
        allAppointmentsResponse.data
      );

      // Filter out cancelled appointments first - STRICT FILTERING
      const validAppointments = allAppointmentsResponse.data.filter((apt) => {
        const isCancelled =
          apt.status === "Cancelled" || apt.status === "cancelled";
        if (isCancelled) {
          console.log("🚫 Filtered out cancelled appointment:", apt);
        }
        return !isCancelled;
      });

      console.log("✅ Valid appointments (non-cancelled):", validAppointments);

      // Find the specific appointment with exact date and time match (non-cancelled)
      const exactAppointment = validAppointments.find(
        (apt) =>
          apt.patientId === patientId &&
          apt.doctorId === doctorId &&
          apt.date === appointmentDate &&
          apt.time === appointmentTime
      );

      console.log("🎯 Exact appointment found:", exactAppointment);

      if (exactAppointment && exactAppointment.file) {
        // Create a report object from the exact appointment's file
        const exactAppointmentReport = {
          file: exactAppointment.file,
          originalFileName: exactAppointment.originalFileName,
          fileId: exactAppointment.fileId,
          doctorName: exactAppointment.doctorName,
          date: exactAppointment.date,
          time: exactAppointment.time,
          reason: exactAppointment.reason,
          phone: exactAppointment.phone,
          status: exactAppointment.status,
          isCurrentAppointment: true,
          appointmentId: exactAppointment._id,
        };

        console.log("📄 Exact appointment report:", exactAppointmentReport);
        setReports([exactAppointmentReport]);
      } else {
        // If no file in exact appointment, check for files from the same doctor on the same date (non-cancelled)
        const sameDateAppointments = validAppointments.filter(
          (apt) =>
            apt.patientId === patientId &&
            apt.doctorId === doctorId &&
            apt.date === appointmentDate
        );

        console.log(
          "📅 Non-cancelled appointments with same doctor and date:",
          sameDateAppointments
        );

        const reportsFromSameDate = sameDateAppointments
          .filter((apt) => apt.file) // Only include appointments with files
          .map((apt) => ({
            file: apt.file,
            originalFileName: apt.originalFileName,
            fileId: apt.fileId,
            doctorName: apt.doctorName,
            date: apt.date,
            time: apt.time,
            reason: apt.reason,
            phone: apt.phone,
            status: apt.status,
            isCurrentAppointment:
              apt.time === appointmentTime && apt.date === appointmentDate,
            appointmentId: apt._id,
          }));

        console.log(
          "📄 Reports from same date (non-cancelled):",
          reportsFromSameDate
        );
        setReports(reportsFromSameDate);
      }
    } catch (err) {
      console.error("❌ Error fetching doctor-specific reports:", err);

      // Fallback: try alternative endpoints if the main one fails
      try {
        // Try getting appointments by doctor ID as fallback
        const doctorAppointmentsResponse = await axios.get(

          `${API_BASE_URL}/api/requests?doctorId=${doctorId}`
        );


        console.log(
          "📋 Appointments for doctor from /api/requests:",
          doctorAppointmentsResponse.data
        );

        // Filter by patient ID, date, and non-cancelled status
        const filteredReports = doctorAppointmentsResponse.data.filter(
          (report) => {
            const isSamePatient = report.patientId === patientId;
            const isSameDate = report.date === appointmentDate;
            const isNotCancelled =
              report.status !== "Cancelled" && report.status !== "cancelled";

            if (!isNotCancelled) {
              console.log(
                "🚫 Filtered out cancelled report in fallback:",
                report
              );
            }

            return isSamePatient && isSameDate && isNotCancelled;
          }
        );

        console.log(
          "🔍 Filtered reports by patient, date, and non-cancelled:",
          filteredReports
        );
        setReports(filteredReports);
      } catch (fallbackError) {
        console.error("❌ Fallback also failed:", fallbackError);
        setReports([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fix download function - Use GridFS endpoint
  const handleDownload = async (filename) => {
    if (!filename) {
      alert("No file available for download");
      return;
    }

    try {
      window.open(

        `${API_BASE_URL}/api/files/download/${filename}`,
        "_blank"
      );

    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  // ✅ Fix view function - Use GridFS endpoint
  const handleView = (filename) => {
    if (!filename) {
      alert("No file available to view");
      return;
    }

    window.open(`${API_BASE_URL}/api/files/view/${filename}`, "_blank");

  };

  // Show error if selected patient appointment is cancelled
  if (
    !loading &&
    patient &&
    (patient.status === "Cancelled" || patient.status === "cancelled")
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <div className="text-center">
          <span className="material-symbols-outlined text-red-500 text-6xl mb-4">
            cancel
          </span>
          <p className="text-lg font-semibold text-red-600 mb-2">
            Cancelled Appointment
          </p>
          <p className="text-gray-500">This appointment was cancelled.</p>
          <p className="text-gray-400 text-sm mt-2">
            No documents are available for cancelled appointments.
          </p>
          <Link
            to="/patient-list"
            className="text-blue-500 hover:text-blue-700 mt-4 inline-block"
          >
            ← Back to Patient List
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Loading patient details...
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl mb-4">error</span>
          <p className="text-lg">No patient data found.</p>
          <Link
            to="/patient-list"
            className="text-blue-500 hover:text-blue-700 mt-4 inline-block"
          >
            ← Back to Patient List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-inter">
      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Patient Record
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/prescription-by-doctor">
                <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 transition-colors">
                  <span className="material-symbols-outlined">add</span>
                  Add Prescription
                </button>
              </Link>

              <Link to="/patient-list">
                <button className="text-gray-600 hover:text-gray-800 transition-colors">
                  <span className="material-symbols-outlined text-3xl">
                    close
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Patient Profile */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-8">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="flex  items-start">
                <div
                  className="h-20 w-20 rounded-full bg-cover bg-center border-2 border-gray-300"
                  style={{
                    backgroundImage: `url("${patientImage}")`,
                  }}
                ></div>
                <div className="ml-4 sm:hidden">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {patient.patientName}
                  </h2>
                </div>
              </div>
              <div className="w-full">
                <div className="hidden sm:block">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {patient.patientName}
                  </h2>
                </div>

                {/* Patient Details Grid */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Age */}
                  <div className="flex items-center p-3 bg-white rounded-lg">
                    <span className="material-symbols-outlined text-gray-500 mr-3">
                      cake
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Age</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {patient.age || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="flex items-center p-3 bg-white rounded-lg">
                    <span className="material-symbols-outlined text-gray-500 mr-3">
                      person
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Gender
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {patient.gender || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Blood Group */}
                  <div className="flex items-center p-3 bg-white rounded-lg">
                    <span className="material-symbols-outlined text-gray-500 mr-3">
                      water_drop
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Blood Group
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {patient.bloodgroup || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="flex items-center p-3 bg-white rounded-lg">
                    <span className="material-symbols-outlined text-gray-500 mr-3">
                      call
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Contact
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {patient.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Appointment Date */}
                  <div className="flex items-center p-3 bg-white rounded-lg">
                    <span className="material-symbols-outlined text-gray-500 mr-3">
                      event
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Appointment Date
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {patient.date || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Appointment Time */}
                  <div className="flex items-center p-3 bg-white rounded-lg">
                    <span className="material-symbols-outlined text-gray-500 mr-3">
                      schedule
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Appointment Time
                      </p>
                      <p className="text-lg font-semibold text-gray-800">
                        {patient.time || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Health Issue/Reason for Visit */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <span className="material-symbols-outlined text-blue-500 mt-1 mr-3">
                      assignment
                    </span>
                    <div className="w-full">
                      <p className="text-sm font-medium text-blue-800 mb-2">
                        Reason for This Visit
                      </p>
                      <p className="text-gray-800 bg-white p-3 rounded border border-blue-100">
                        {patient.reason ||
                          patient.issue ||
                          "No reason specified."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                {patient.notes && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start">
                      <span className="material-symbols-outlined text-yellow-600 mt-1 mr-3">
                        note
                      </span>
                      <div className="w-full">
                        <p className="text-sm font-medium text-yellow-800 mb-2">
                          Additional Notes for This Appointment
                        </p>
                        <p className="text-gray-800 bg-white p-3 rounded border border-yellow-100">
                          {patient.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Uploaded Reports Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Documents for This Appointment
              </h3>
            </div>

            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      report.isCurrentAppointment
                        ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    } transition-colors`}
                  >
                    <div className="flex items-center flex-1">
                      <span className="material-symbols-outlined text-blue-500 mr-4 text-2xl">
                        description
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-800">
                            {report.originalFileName ||
                              report.file ||
                              `Report_${index + 1}`}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Doctor:</span>{" "}
                            {report.doctorName || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Date:</span>{" "}
                            {report.date
                              ? new Date(report.date).toLocaleDateString()
                              : "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Time:</span>{" "}
                            {report.time || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 ml-4">
                      <button
                        onClick={() => handleView(report.file)}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <span className="material-symbols-outlined text-sm">
                          visibility
                        </span>
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(report.file)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        <span className="material-symbols-outlined text-sm">
                          download
                        </span>
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">
                  description
                </span>
                <p className="text-gray-500 text-lg">
                  No documents uploaded for this specific appointment.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Patient hasn't uploaded any documents specifically for this
                  appointment on {patient.date} at {patient.time}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientIssueDetails;
