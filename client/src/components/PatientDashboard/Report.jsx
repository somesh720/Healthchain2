import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getPatientImage } from "../../utils/profileImages";

const Report = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const patientId = (localStorage.getItem("patientId") || "").trim();
  const patientName = (localStorage.getItem("patientName") || "").trim();
  const patientGender = (localStorage.getItem("patientGender") || "").trim(); // Get gender from localStorage

  // Handle navigation with loading animation
  const handleNavigation = (path, linkName) => {
    setNavLoading(true);
    setActiveLink(linkName);

    setTimeout(() => {
      setNavLoading(false);
      navigate(path);
    }, 400);
  };

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      if (!patientId) {
        setError("No patient info found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/appointments/reports?patientId=${encodeURIComponent(
            patientId
          )}`
        );
        setReports(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("fetchReports error:", err);
        setError("Failed to fetch reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [patientId]);

  // Get patient image based on gender from localStorage
  const patientImage = getPatientImage(patientGender);

  // ✅ Use GridFS endpoints for file operations
  const handleView = (filename) => {
    if (!filename) return alert("No file available");
    const url = `http://localhost:5000/api/files/view/${encodeURIComponent(
      filename
    )}`;
    window.open(url, "_blank");
  };

  const handleDownload = (filename) => {
    if (!filename) return alert("No file available");
    const url = `http://localhost:5000/api/files/download/${encodeURIComponent(
      filename
    )}`;
    window.open(url, "_blank");
  };

  // Format date and time for display
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "Unknown", time: "Unknown" };

    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch (error) {
      return { date: "Invalid Date", time: "Invalid Time" };
    }
  };

  return (
    <div className="flex min-h-screen">
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

      {/* Sidebar - Fixed height */}
      <aside className="w-72 bg-white p-6 flex flex-col justify-between fixed left-0 top-0 bottom-0">
        <div>
          <div className="flex items-center gap-4 mb-10">
            <div
              className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-gray-200"
              style={{
                backgroundImage: `url("${patientImage}")`,
              }}
            />
            <div className="flex flex-col">
              <span className="font-semibold text-lg text-black">
                {patientName}
              </span>
              <span className="text-sm text-gray-500">Patient</span>
            </div>
          </div>

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

            <span className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-200 text-blue-500">
              <span className="material-symbols-outlined">description</span>
              <span>Reports</span>
            </span>

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

      {/* Main content - Scrollable area */}
      <main className="flex-1 p-8 overflow-y-auto ml-72 bg-gray-50 ">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">
              Medical Reports
            </h1>
            <p className="text-gray-500">
              View, manage, and download your medical reports.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Loading your reports...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="material-symbols-outlined text-red-500 text-4xl mb-3">
                  error
                </div>
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            ) : reports.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-full">
                  <thead className="text-sm text-gray-500 border-b border-gray-200 bg-gray-50 sticky top-0">
                    <tr>
                      <th className="py-3 px-4 font-medium">File Name</th>
                      <th className="py-3 px-4 font-medium">Doctor</th>
                      <th className="py-3 px-4 font-medium">Created Date</th>
                      <th className="py-3 px-4 font-medium">Created Time</th>
                      <th className="py-3 px-4 font-medium text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {reports.map((report, index) => {
                      const createdDateTime = formatDateTime(report.createdAt);

                      return (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="py-4 px-4 text-black">
                            {report.originalFileName ||
                              report.file ||
                              "No file uploaded"}
                          </td>

                          <td className="py-4 px-4 text-black">
                            {report.doctorName || "Unknown Doctor"}
                          </td>

                          <td className="py-4 px-4 text-black">
                            {createdDateTime.date}
                          </td>

                          <td className="py-4 px-4 text-black">
                            {createdDateTime.time}
                          </td>

                          <td className="py-4 px-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleView(report.file)}
                                className="p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                title="View Report"
                              >
                                <span className="material-symbols-outlined text-black">
                                  visibility
                                </span>
                              </button>

                              <button
                                onClick={() => handleDownload(report.file)}
                                className="p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                title="Download Report"
                              >
                                <span className="material-symbols-outlined text-black">
                                  download
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="material-symbols-outlined text-gray-400 text-5xl mb-4">
                  description
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Reports Found
                </h3>
                <p className="text-gray-500">
                  No reports found for {patientName}.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Report;
