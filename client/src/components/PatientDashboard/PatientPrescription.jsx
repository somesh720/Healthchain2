import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getPatientImage } from "../../utils/profileImages"; // Import the profile image utility

const PatientPrescription = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" or "detail"
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

  useEffect(() => {
    fetchAllPrescriptions();
  }, []);

  const fetchAllPrescriptions = async () => {
    try {
      const patientId = localStorage.getItem("patientId");
      if (patientId) {
        const response = await axios.get(
  `${process.env.REACT_APP_API_URL || "https://backend-healthchain.onrender.com"}/api/prescriptions/patient/${patientId}`
);
        if (response.data && response.data.length > 0) {
          // Sort prescriptions by date (newest first)
          const sortedPrescriptions = response.data.sort(
            (a, b) =>
              new Date(b.prescriptionDate) - new Date(a.prescriptionDate)
          );
          setPrescriptions(sortedPrescriptions);

          // Set the first prescription as selected by default
          if (!selectedPrescription) {
            setSelectedPrescription(sortedPrescriptions[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedPrescription(null);
  };

  const handleDownload = (prescription) => {
    if (!prescription) return;

    // Create a printable HTML content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription - ${prescription.patientName}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6;
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .patient-info, .doctor-info { 
            margin-bottom: 20px; 
          }
          .section { 
            margin-bottom: 25px; 
          }
          .medicine-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .medicine-table th, .medicine-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          .medicine-table th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .signature {
            margin-top: 50px;
            text-align: right;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>MEDICAL PRESCRIPTION</h1>
          <p>Date: ${new Date(
            prescription.prescriptionDate
          ).toLocaleDateString()}</p>
        </div>

        <div class="patient-info">
          <h3>Patient Information</h3>
          <p><strong>Name:</strong> ${prescription.patientName}</p>
          <p><strong>Age:</strong> ${prescription.patientAge}</p>
          <p><strong>Gender:</strong> ${prescription.patientGender}</p>
          <p><strong>Blood Group:</strong> ${prescription.patientBloodGroup}</p>
        </div>

        <div class="doctor-info">
          <h3>Doctor Information</h3>
          <p><strong>Name:</strong> ${prescription.doctorName}</p>
        </div>

        <div class="section">
          <h3>Diagnosis</h3>
          <p>${prescription.diagnosis}</p>
        </div>

        <div class="section">
          <h3>Medicines</h3>
          <table class="medicine-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
              ${prescription.medicines
                .map(
                  (medicine) => `
                <tr>
                  <td>${medicine.name}</td>
                  <td>${medicine.dosage}</td>
                  <td>${medicine.frequency}</td>
                  <td>${medicine.duration}</td>
                  <td>${medicine.instructions}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h3>Additional Instructions</h3>
          <p>${prescription.advice}</p>
        </div>

        ${
          prescription.nextVisit
            ? `
        <div class="section">
          <h3>Next Visit</h3>
          <p>${new Date(prescription.nextVisit).toLocaleDateString()}</p>
        </div>
        `
            : ""
        }

        <div class="signature">
          <p><strong>Doctor's Signature</strong></p>
          <p>${prescription.doctorName}</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="footer">
          <p>This is a computer-generated prescription</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Show loading animation while data is being fetched
  if (loading) {
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
                <span className="material-symbols-outlined">Person</span>
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

              <button
                onClick={() =>
                  handleNavigation("/requests", "Appointment Requests")
                }
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left"
              >
                <span className="material-symbols-outlined">checklist</span>
                <span>Requests</span>
              </button>

              <span className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-200 text-blue-500">
                <span className="material-symbols-outlined">medication</span>
                <span>Prescription</span>
              </span>
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

        <main className="flex-1 p-8 overflow-y-auto ml-72">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-black">
                My Prescriptions
              </h1>
              <p className="text-gray-500 mt-1">
                View and manage your prescriptions
              </p>
            </div>
          </div>

          {/* Loading Animation in Main Content */}
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-lg">
              Loading your prescriptions...
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Please wait while we fetch your prescription data
            </p>
          </div>
        </main>
      </div>
    );
  }

  // After loading is complete, show either prescriptions or empty state
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
              <span className="material-symbols-outlined">Person</span>
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

            <button
              onClick={() =>
                handleNavigation("/requests", "Appointment Requests")
              }
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">checklist</span>
              <span>Requests</span>
            </button>

            <span className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-200 text-blue-500">
              <span className="material-symbols-outlined">medication</span>
              <span>Prescription</span>
            </span>
          </nav>
        </div>

        <nav>
          <button
            onClick={() => handleNavigation("/logout", "Logout")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto ml-72">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black">My Prescriptions</h1>
            <p className="text-gray-500 mt-1">
              {viewMode === "list"
                ? prescriptions.length > 0
                  ? `Total prescriptions: ${prescriptions.length}`
                  : "Manage your prescriptions"
                : `Prescription from ${selectedPrescription?.doctorName}`}
            </p>
          </div>
          {viewMode === "detail" && (
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to List
            </button>
          )}
        </div>

        {/* Show prescriptions if available, otherwise show empty state */}
        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="material-symbols-outlined text-gray-400 text-6xl mb-4">
              medication
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No Prescriptions Found
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have any prescriptions yet.
            </p>
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        ) : viewMode === "list" ? (
          /* Prescription Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map((prescription, index) => (
              <div
                key={prescription._id || index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Dr. {prescription.doctorName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(
                        prescription.prescriptionDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    {prescription.medicines.length} meds
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Diagnosis:</span>{" "}
                    {prescription.diagnosis}
                  </p>
                  {prescription.nextVisit && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Next Visit:</span>{" "}
                      {new Date(prescription.nextVisit).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewPrescription(prescription)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                  >
                    <span className="material-symbols-outlined text-sm">
                      visibility
                    </span>
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(prescription)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm"
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
          /* Prescription Detail View */
          selectedPrescription && (
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
              {/* Patient Information */}
              <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Patient Information
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold">
                      {selectedPrescription.patientName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-semibold">
                      {selectedPrescription.patientAge}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-semibold">
                      {selectedPrescription.patientGender}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <p className="font-semibold">
                      {selectedPrescription.patientBloodGroup}
                    </p>
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Diagnosis
                </h2>
                <p className="text-gray-700">
                  {selectedPrescription.diagnosis}
                </p>
              </div>

              {/* Medicine Details */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Medicine Details
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                          Medicine Name
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                          Dosage
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                          Frequency
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                          Duration
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                          Instructions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPrescription.medicines.map((medicine, index) => (
                        <tr
                          key={index}
                          className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {medicine.name}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {medicine.dosage}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {medicine.frequency}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {medicine.duration}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {medicine.instructions}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Additional Instructions */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Additional Instructions
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedPrescription.advice}
                </p>
              </div>

              {/* Next Visit */}
              {selectedPrescription.nextVisit && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Next Visit
                  </h2>
                  <p className="text-gray-700">
                    {new Date(
                      selectedPrescription.nextVisit
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Doctor's Signature */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Doctor's Signature
                </h2>
                <p className="text-gray-700 font-semibold">
                  {selectedPrescription.doctorName}
                </p>
                <p className="text-gray-500 text-sm">
                  Date:{" "}
                  {new Date(
                    selectedPrescription.prescriptionDate
                  ).toLocaleDateString()}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-4">
                <button
                  onClick={handleBackToList}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200"
                >
                  Back to List
                </button>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default PatientPrescription;
