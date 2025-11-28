import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getPatientImage } from "../../utils/profileImages"; // Import the profile image utility
import {
  formatConsultingTimings,
  formatConsultingDaysForCard,
} from "../../utils/timeFormatter";

const Doctor = () => {
  const [doctorsByCategory, setDoctorsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const navigate = useNavigate();

  const patientName = localStorage.getItem("patientName") || "Patient";
  const patientId = localStorage.getItem("patientId") || "";
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
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/specialization/getDoctors"
        );
        setDoctorsByCategory(res.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

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

            <span className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-200 text-blue-500">
              <span className="material-symbols-outlined">group</span>
              <span>Doctors</span>
            </span>

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

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto ml-72 bg-gray-50">
        <h1 className="text-4xl font-bold text-black mb-8">Doctors</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading doctors...</p>
            <p className="text-gray-500 text-sm mt-2">
              Please wait while we fetch the doctor list
            </p>
          </div>
        ) : Object.keys(doctorsByCategory).length > 0 ? (
          Object.keys(doctorsByCategory).map((specialization, index) => (
            <div key={index} className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">
                {specialization}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {doctorsByCategory[specialization].map((doctor) => (
                  <div
                    key={doctor._id}
                    className="bg-white p-6 rounded-xl flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        alt="Doctor Avatar"
                        className="w-16 h-16 rounded-full border-2 border-gray-200"
                        src={
                          doctor.image ||
                          "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
                        }
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {"Dr. " + (doctor.fullName || "Unnamed Doctor")}
                        </h3>
                        <p className="text-sm text-blue-500 font-semibold">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>

                    {/* Doctor Details */}
                    <div className="space-y-3 mb-4 flex-grow">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="material-symbols-outlined text-base text-gray-400">
                          work
                        </span>
                        <span>
                          Experience: {doctor.experience || "0"} years
                        </span>
                      </div>

                      {/* Consultation Fee */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="material-symbols-outlined text-base text-gray-400">
                          payments
                        </span>
                        <span className="font-semibold text-green-600">
                          ₹{doctor.consultationFee || "500"}
                        </span>
                        <span className="text-gray-500">Consultation Fee</span>
                      </div>

                      {/* Available Days */}
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="material-symbols-outlined text-base text-gray-400 mt-0.5">
                          event
                        </span>
                        <div>
                          <span className="font-medium">Available: </span>
                          {formatConsultingDaysForCard(doctor.consultingDays)}
                        </div>
                      </div>

                      {/* Consultation Timings */}
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="material-symbols-outlined text-base text-gray-400 mt-0.5">
                          schedule
                        </span>
                        <div>
                          <span className="font-medium">Timings: </span>
                          {formatConsultingTimings(doctor.consultingTimings)}
                        </div>
                      </div>
                    </div>

                    {/* Book Appointment Button */}
                    <div className="flex flex-col gap-3 mt-auto">
                      <Link
                        to={`/book-appointment?doctor=${encodeURIComponent(
                          doctor.fullName
                        )}&doctorId=${doctor._id}`}
                      >
                        <button className="w-full px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-base">
                            event_available
                          </span>
                          Book Appointment
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="material-symbols-outlined text-gray-400 text-6xl mb-4">
              medical_services
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Doctors Available
            </h3>
            <p className="text-gray-500">
              Currently there are no doctors available. Please check back later.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Doctor;
