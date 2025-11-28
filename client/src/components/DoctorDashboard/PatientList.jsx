import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getDoctorImage } from "../../utils/profileImages"; // Import the doctor image utility

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prescriptionStatus, setPrescriptionStatus] = useState({});
  const [navLoading, setNavLoading] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // ✅ Get doctor info from localStorage
  const doctorData = JSON.parse(localStorage.getItem("doctorData"));
  const doctorId = doctorData?._id || localStorage.getItem("doctorId");
  const doctorName =
    doctorData?.name || localStorage.getItem("doctorName") || "Doctor";
  const doctorSpecialization =
    doctorData?.specialization ||
    localStorage.getItem("doctorSpecialization") ||
    "Specialist";
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

  // ✅ Function to format patient ID - LAST 6 CHARACTERS
  const formatPatientId = (patientId) => {
    if (!patientId) return "N/A";
    if (typeof patientId === "string" && patientId.length >= 6) {
      return patientId.slice(-6).toUpperCase();
    }
    if (typeof patientId === "string") {
      return patientId.toUpperCase().padStart(6, "0");
    }
    return "N/A";
  };

  // ✅ Generate unique key for each appointment (patientId + date + time)
  const getAppointmentKey = (patientId, date, time) => {
    return `${patientId}_${date}_${time}`;
  };

  // ✅ CORRECTED: Check prescription status for a specific appointment
  const checkAppointmentPrescriptionStatus = async (
    appointmentId,
    patientId,
    date,
    time
  ) => {
    try {
      const appointmentKey = getAppointmentKey(patientId, date, time);
      console.log(`🔍 Checking prescription for appointment:`, {
        appointmentId,
        patientId,
        date,
        time,
        appointmentKey,
      });

      // ✅ FIRST: Always check the API first for accurate data
      console.log(
        `🔍 Checking API for prescription with appointmentId: ${appointmentId}`
      );

      try {
        const response = await axios.get(
  `${process.env.REACT_APP_API_URL || "https://backend-healthchain.onrender.com"}/api/prescriptions/appointment/${appointmentId}`
);

        console.log("📋 Prescription API response:", response.data);

        // Check if prescription exists for this specific appointment
        const hasPrescription =
          response.data.exists === true && response.data.prescription !== null;

        console.log(
          `📝 Prescription check result for ${appointmentId}:`,
          hasPrescription
        );

        // ✅ ONLY update localStorage if we actually found a prescription in the database
        const localStorageKey = `prescription_${doctorId}_${appointmentKey}`;
        if (hasPrescription) {
          localStorage.setItem(localStorageKey, "sent");
          console.log(
            `✅ Prescription found and stored for appointment ${appointmentKey}`
          );
        } else {
          console.log(
            `❌ No prescription found for appointment ${appointmentKey}`
          );
          // Remove from localStorage if no prescription found
          localStorage.removeItem(localStorageKey);
        }

        return hasPrescription;
      } catch (apiError) {
        // Handle API errors specifically
        if (apiError.response?.status === 404) {
          console.log(
            `❌ No prescription found (404) for appointment ${appointmentId}`
          );
          const localStorageKey = `prescription_${doctorId}_${appointmentKey}`;
          localStorage.removeItem(localStorageKey);
          return false;
        }
        throw apiError; // Re-throw other errors
      }
    } catch (error) {
      console.log(
        `❌ Error checking prescription for appointment ${appointmentId}:`,
        error.message
      );

      // For other errors, log but return false
      console.error("Prescription check error details:", error.response?.data);
      return false;
    }
  };

  // ✅ CORRECTED: Check all appointments' prescription status
  const checkAllPrescriptions = async (patientList) => {
    setRefreshing(true);
    const statusMap = {};

    console.log(
      `🔄 Checking prescriptions for ${patientList.length} patients...`
    );

    for (const patient of patientList) {
      // Use the actual appointment _id from the database
      const appointmentId = patient._id;

      if (appointmentId && patient.date && patient.time) {
        const appointmentKey = getAppointmentKey(
          patient.patientId,
          patient.date,
          patient.time
        );
        try {
          // ✅ Pass appointmentId as first parameter
          const hasPrescription = await checkAppointmentPrescriptionStatus(
            appointmentId, // ✅ FIRST parameter
            patient.patientId,
            patient.date,
            patient.time
          );
          statusMap[appointmentKey] = hasPrescription;
          console.log(
            `📝 ${patient.patientName} (${appointmentId}): ${
              hasPrescription ? "Has Prescription" : "No Prescription"
            }`
          );
        } catch (error) {
          console.error(
            `Error checking prescription for ${patient.patientName}:`,
            error
          );
          statusMap[appointmentKey] = false;
        }
      } else {
        console.log(`⏭️ Skipping invalid appointment:`, patient);
        const appointmentKey = getAppointmentKey(
          patient.patientId,
          patient.date,
          patient.time
        );
        statusMap[appointmentKey] = false;
      }
    }

    setPrescriptionStatus(statusMap);
    setRefreshing(false);
    console.log("✅ All prescription checks completed:", statusMap);
  };

  // ✅ Refresh prescription status for a specific appointment
  const refreshPrescriptionStatus = async (
    appointmentId,
    patientId,
    date,
    time
  ) => {
    try {
      const appointmentKey = getAppointmentKey(patientId, date, time);
      console.log(`🔄 Refreshing prescription status for: ${appointmentKey}`);

      const hasPrescription = await checkAppointmentPrescriptionStatus(
        appointmentId,
        patientId,
        date,
        time
      );

      // Update the status in state
      setPrescriptionStatus((prev) => ({
        ...prev,
        [appointmentKey]: hasPrescription,
      }));

      console.log(
        `✅ Refreshed status for ${appointmentKey}: ${hasPrescription}`
      );
      return hasPrescription;
    } catch (error) {
      console.error("Error refreshing prescription status:", error);
      return false;
    }
  };

  // ✅ Fetch appointments with proper error handling
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log("🔄 Starting to fetch appointments...");

        if (!doctorId) {
          setError("Doctor ID not found. Please login again.");
          setLoading(false);
          console.log("❌ No doctorId found");
          return;
        }

        setLoading(true);
        setError("");
        console.log("🔄 Fetching appointments for doctor:", doctorId);

        const res = await axios.get(
  `${process.env.REACT_APP_API_URL || "https://backend-healthchain.onrender.com"}/api/appointments/doctor/${doctorId}`
);

        console.log("✅ API Response received - FULL RESPONSE:", res);
        console.log("📊 Response data type:", typeof res.data);
        console.log("📊 Response data:", res.data);

        // ✅ Handle different response formats
        let appointmentsData;

        if (Array.isArray(res.data)) {
          appointmentsData = res.data;
          console.log("✅ Response is direct array");
        } else if (res.data && Array.isArray(res.data.appointments)) {
          appointmentsData = res.data.appointments;
          console.log("✅ Response has appointments array");
        } else if (res.data && Array.isArray(res.data.data)) {
          appointmentsData = res.data.data;
          console.log("✅ Response has data array");
        } else if (
          res.data &&
          res.data.success &&
          Array.isArray(res.data.appointments)
        ) {
          appointmentsData = res.data.appointments;
          console.log("✅ Response has success and appointments array");
        } else if (
          res.data &&
          res.data.success &&
          Array.isArray(res.data.data)
        ) {
          appointmentsData = res.data.data;
          console.log("✅ Response has success and data array");
        } else {
          console.log("❌ Unknown response format:", res.data);
          throw new Error(
            `Invalid response format: ${JSON.stringify(res.data)}`
          );
        }

        console.log(`📋 Processed appointments: ${appointmentsData.length}`);

        // ✅ Filter out cancelled appointments only
        const validAppointments = appointmentsData.filter(
          (a) => a.status !== "Cancelled" && a.status !== "cancelled"
        );

        console.log(
          `📋 Valid appointments (non-cancelled): ${validAppointments.length}`
        );

        if (validAppointments.length === 0) {
          console.log(
            "ℹ️ No valid appointments found after filtering cancelled ones"
          );
          setPatients([]);
          setLoading(false);
          return;
        }

        // ✅ Map appointments to patient list format
        const patientList = validAppointments.map((appt, index) => {
          const patientData = {
            _id: appt._id || `temp-${Date.now()}-${index}`,
            patientId: appt.patientId || "Unknown ID",
            formattedPatientId: formatPatientId(appt.patientId),
            patientName: appt.patientName || "Unknown Patient",
            age: appt.age ? `${appt.age}` : "N/A",
            gender: appt.gender || "Not specified",
            bloodgroup: appt.bloodgroup || "Not specified",
            phone: appt.phone || "Not provided",
            status: appt.status || "Pending",
            date: appt.date || "N/A",
            time: appt.time || "N/A",
            reason: appt.reason || "No reason provided",
            notes: appt.notes || "",
            appointmentDate: appt.date
              ? new Date(appt.date).toLocaleDateString()
              : "N/A",
            appointmentTime: appt.time || "N/A",
            appointmentKey: getAppointmentKey(
              appt.patientId,
              appt.date,
              appt.time
            ),
          };

          console.log(`👤 Processed patient ${index + 1}:`, patientData);
          return patientData;
        });

        console.log("👥 Final patient appointments list:", patientList);
        setPatients(patientList);

        // ✅ Check prescription status for all appointments
        await checkAllPrescriptions(patientList);
      } catch (error) {
        console.error("❌ Error fetching appointments:", error);
        console.error("❌ Error response:", error.response?.data);
        console.error("❌ Error status:", error.response?.status);

        setError(`Failed to load patients: ${error.message}`);
        setPatients([]);
      } finally {
        setLoading(false);
        console.log("🏁 Finished loading");
      }
    };

    fetchAppointments();
  }, [doctorId]);

  // ✅ Listen for prescription updates from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith("prescription_") && e.newValue === "sent") {
        console.log("🔄 Prescription status updated from storage:", e.key);
        // Extract appointment key from storage key
        const appointmentKey = e.key.replace(`prescription_${doctorId}_`, "");

        // Update the status in state immediately
        setPrescriptionStatus((prev) => ({
          ...prev,
          [appointmentKey]: true,
        }));

        console.log(`✅ Updated prescription status for: ${appointmentKey}`);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const handlePrescriptionSent = (event) => {
      const { patientId, date, time, appointmentId } = event.detail;
      console.log("🔄 Custom prescription event received:", event.detail);
      refreshPrescriptionStatus(appointmentId, patientId, date, time);
    };

    window.addEventListener("prescriptionSent", handlePrescriptionSent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("prescriptionSent", handlePrescriptionSent);
    };
  }, [doctorId]);

  // ✅ Auto-refresh when component becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && patients.length > 0) {
        console.log("🔄 Page became visible, refreshing prescriptions...");
        // Auto-refresh when page becomes visible
        checkAllPrescriptions(patients);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [patients]);

  // ✅ Handle patient selection
  const handlePatientSelect = (patient) => {
    console.log("💾 Storing patient for details:", patient);
    localStorage.setItem("selectedPatient", JSON.stringify(patient));
  };

  // ✅ Search filter
  const filteredPatients = patients.filter(
    (p) =>
      p.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      p.patientId?.toLowerCase().includes(search.toLowerCase()) ||
      p.formattedPatientId?.toLowerCase().includes(search.toLowerCase()) ||
      p.gender?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.toLowerCase().includes(search.toLowerCase()) ||
      p.appointmentDate?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen font-inter bg-gray-50">
        <aside className="w-72 bg-white p-6 flex flex-col justify-between">
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
            <p className="text-gray-600">Loading patients...</p>
          </div>
        </main>
      </div>
    );
  }

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
          <div className="flex items-center gap-4 mb-10">
            <div
              className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-gray-200"
              style={{
                backgroundImage: `url("${doctorImage}")`,
              }}
            />
            <div>
              <span className="font-semibold text-lg text-black">
                Dr. {doctorName}
              </span>
              <p className="text-sm text-gray-500">{doctorSpecialization}</p>
            </div>
          </div>

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

            <span className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left">
              <span className="material-symbols-outlined">group</span>
              <span>Patient List</span>
            </span>

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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-gray-800">
                Patient Lists
              </h1>
              <p className="text-gray-600">
                Total appointments: {patients.length}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-blue-500 hover:text-blue-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Search */}
          <div className="mb-6 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search patients by name, ID, phone, gender, or appointment date"
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredPatients.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-sm text-gray-500 border-b border-gray-200 bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Patient Name</th>
                    <th className="px-6 py-3 font-semibold">Patient ID</th>
                    <th className="px-6 py-3 font-semibold">Age</th>
                    <th className="px-6 py-3 font-semibold">Gender</th>
                    <th className="px-6 py-3 font-semibold">Phone</th>
                    <th className="px-6 py-3 font-semibold">
                      Appointment Date
                    </th>
                    <th className="px-6 py-3 font-semibold">
                      Appointment Time
                    </th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold">Prescription</th>
                    <th className="px-6 py-3 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPatients.map((p) => {
                    const appointmentKey = getAppointmentKey(
                      p.patientId,
                      p.date,
                      p.time
                    );
                    const hasPrescription =
                      prescriptionStatus[appointmentKey] || false;
                    const isApproved = p.status === "Confirmed";

                    return (
                      <tr key={p._id} className="hover:bg-blue-50">
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {p.patientName}
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-mono">
                          {p.formattedPatientId}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {p.age !== "N/A" ? `${p.age} yrs` : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{p.gender}</td>
                        <td className="px-6 py-4 text-gray-600">{p.phone}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {p.appointmentDate}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {p.appointmentTime}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              p.status === "Confirmed"
                                ? "bg-green-100 text-green-700"
                                : p.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                hasPrescription
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {hasPrescription ? "✓ Sent" : "Pending"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {hasPrescription ? (
                            <span className="text-green-600 font-medium flex items-center justify-end gap-1">
                              <span className="material-symbols-outlined text-sm">
                                check_circle
                              </span>
                              Done
                            </span>
                          ) : !isApproved ? (
                            <span className="text-gray-400 font-medium flex items-center justify-end gap-1">
                              <span className="material-symbols-outlined text-sm">
                                lock
                              </span>
                              Awaiting Approval
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                handlePatientSelect(p);
                                handleNavigation(
                                  "/patient-issue-details",
                                  "Patient Issue Details"
                                );
                              }}
                              className="text-blue-500 hover:text-blue-700 font-medium flex items-center justify-end gap-1"
                            >
                              View Record
                              <span className="material-symbols-outlined text-sm">
                                chevron_right
                              </span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">
                  group_off
                </span>
                <p className="text-gray-500 text-lg mb-2">
                  {search
                    ? "No appointments match your search"
                    : "No appointments found"}
                </p>
                <p className="text-gray-400 text-sm">
                  {search
                    ? "Try adjusting your search terms"
                    : "No appointments booked yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientList;
