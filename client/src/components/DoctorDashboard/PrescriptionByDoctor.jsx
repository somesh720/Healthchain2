import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";



const PrescriptionByDoctor = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
  ]);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [nextVisit, setNextVisit] = useState("");

  // Doctor info
  const doctorData = JSON.parse(localStorage.getItem("doctorData"));
  const doctorId = doctorData?._id || localStorage.getItem("doctorId");
  const doctorName =
    doctorData?.name ||
    localStorage.getItem("doctorName") ||
    "Dr. Emily Carter";
  const doctorImage =
    doctorData?.profileImage ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAI_D2uIAF8hm198ZVvonhHE6KJkK6stwOAAkJ62hiFE_7TEyS-Pnbd01pCHt3YNIL5OGFO4uE1p3uWdttJbmoXODK97oExyDxFqjAYNl-Zj9x7bP0FLzoukasYjbWJSSO2QrT2SoNlZIW34cFydpr6ZI8eAYHZ3Q0G-PJn9gTYLmadJY6RXbo-yLROWjhuBD12T1uNKAkZWk0px83kI4FlCi5ukn1nJZzC-wZKcoEP2qdo04bymqoQgoSHYwYGi5WaNndkSxNN6jw";

  useEffect(() => {
    // Get patient data from localStorage
    const storedPatient = localStorage.getItem("selectedPatient");
    if (storedPatient) {
      const patientData = JSON.parse(storedPatient);
      console.log("👤 Patient data for prescription:", patientData);
      setPatient(patientData);

      // Set default diagnosis based on patient's reason
      if (patientData.reason) {
        setDiagnosis(patientData.reason);
      }
    } else {
      alert("No patient selected. Please select a patient first.");
      navigate("/patient-list");
    }
  }, [navigate]);

  // ✅ Generate unique key for each appointment (patientId + date + time)
  const getAppointmentKey = (patientId, date, time) => {
    return `${patientId}_${date}_${time}`;
  };

  // Handle medicine changes
  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index] = {
      ...updatedMedicines[index],
      [field]: value,
    };
    setMedicines(updatedMedicines);
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ]);
  };

  const removeMedicine = (index) => {
    if (medicines.length > 1) {
      const updatedMedicines = medicines.filter((_, i) => i !== index);
      setMedicines(updatedMedicines);
    }
  };

  // Validate all fields
  const validateForm = () => {
    setError("");

    // Check diagnosis
    if (!diagnosis.trim()) {
      setError("Please enter a diagnosis");
      return false;
    }

    // Check next visit
    if (!nextVisit.trim()) {
      setError("Please select next visit date");
      return false;
    }

    // Check additional instructions
    if (!additionalInstructions.trim()) {
      setError("Please enter additional instructions");
      return false;
    }

    // Check medicines
    if (medicines.length === 0) {
      setError("Please add at least one medicine");
      return false;
    }

    // Check each medicine field
    for (let i = 0; i < medicines.length; i++) {
      const medicine = medicines[i];
      if (!medicine.name.trim()) {
        setError(`Please enter medicine name for medicine ${i + 1}`);
        return false;
      }
      if (!medicine.dosage.trim()) {
        setError(`Please enter dosage for medicine ${i + 1}`);
        return false;
      }
      if (!medicine.frequency.trim()) {
        setError(`Please enter frequency for medicine ${i + 1}`);
        return false;
      }
      if (!medicine.duration.trim()) {
        setError(`Please enter duration for medicine ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) {
      return null;
    }

    if (!patient || !doctorId) {
      setError("Patient or doctor information missing");
      return null;
    }

    // ✅ Check if appointmentId is available
    if (!patient._id && !patient.appointmentId) {
      setError(
        "Appointment information is missing. Please select a patient from the appointments list."
      );
      return null;
    }

    setLoading(true);

    try {
      // ✅ Use appointmentId from patient data (this should come from your appointment selection)
      const appointmentId = patient._id || patient.appointmentId;

      console.log("📤 Creating prescription for appointment:", appointmentId);

      const prescriptionData = {
        appointmentId: appointmentId, // ✅ ADDED THIS - REQUIRED FIELD
        doctorId: doctorId,
        doctorName: doctorName,
        patientId: patient.patientId,
        patientName: patient.patientName,
        patientAge: patient.age,
        patientGender: patient.gender,
        patientBloodGroup: patient.bloodgroup || "Not specified",
        patientPhone: patient.phone || "Not provided",
        diagnosis: diagnosis,
        symptoms: [],
        medicines: medicines,
        tests: [],
        advice: additionalInstructions,
        nextVisit: nextVisit,
        appointmentDate: patient.date,
        appointmentTime: patient.time,
      };

      console.log("📤 Saving prescription:", prescriptionData);


      const response = await axios.post(
        `${API_BASE_URL}/api/prescriptions/create`,
        prescriptionData
      );


      if (response.status === 201) {
        console.log("✅ Prescription saved successfully:", response.data);
        return response.data.prescription;
      }
    } catch (error) {
      console.error("❌ Error saving prescription:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save prescription";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECTED: Update prescription status in localStorage for PatientList
  const updatePrescriptionStatus = () => {
    try {
      if (!patient || !doctorId) {
        console.error("❌ Missing patient or doctor data");
        return;
      }

      // Use the same key format as PatientList component
      const appointmentKey = getAppointmentKey(
        patient.patientId,
        patient.date,
        patient.time
      );
      const localStorageKey = `prescription_${doctorId}_${appointmentKey}`;

      console.log("📝 Updating prescription status with key:", localStorageKey);
      console.log("📝 Patient data:", {
        patientId: patient.patientId,
        date: patient.date,
        time: patient.time,
        appointmentKey,
      });

      // Only store if we have a valid appointment ID
      if (patient._id && !patient._id.startsWith("temp-")) {
        localStorage.setItem(localStorageKey, "sent");

        // ✅ Trigger storage event for other tabs (like PatientList)
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: localStorageKey,
            newValue: "sent",
            oldValue: null,
            url: window.location.href,
            storageArea: localStorage,
          })
        );

        // ✅ Trigger custom event for same tab with appointment ID
        window.dispatchEvent(
          new CustomEvent("prescriptionSent", {
            detail: {
              patientId: patient.patientId,
              date: patient.date,
              time: patient.time,
              appointmentId: patient._id,
              appointmentKey: appointmentKey,
            },
          })
        );

        console.log(
          "✅ Prescription status updated in localStorage and events triggered"
        );
      } else {
        console.warn(
          "⚠️ Cannot update prescription status - invalid appointment ID:",
          patient._id
        );
      }
    } catch (error) {
      console.error("❌ Error updating prescription status:", error);
    }
  };

  const handleSendPrescription = async () => {
    const savedPrescription = await handleSave();
    if (savedPrescription) {
      // ✅ Only update status if prescription was actually created with valid ID
      if (savedPrescription._id) {
        updatePrescriptionStatus();
        setSuccess("Prescription sent successfully!");

        console.log(
          "🎉 Prescription completed, redirecting to patient list..."
        );

        // Redirect to patient list after 2 seconds
        setTimeout(() => {
          navigate("/patient-list");
        }, 2000);
      } else {
        setError("Failed to create prescription - no ID returned");
      }
    }
  };

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading patient data...</p>
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
                Create Prescription
              </h1>
              <p className="text-sm text-gray-600">
                Patient: {patient.patientName} -{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/patient-list">
                <button className="text-gray-600 hover:text-gray-800 transition-colors">
                  <span className="material-symbols-outlined text-3xl">
                    close
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  check_circle
                </span>
                {success}
              </p>
              <p className="text-green-600 text-sm mt-1">
                Redirecting to patient list...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </p>
            </div>
          )}

          {/* Patient Info Card */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Patient Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center p-3 bg-white rounded-lg">
                <span className="material-symbols-outlined text-gray-500 mr-3">
                  person
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {patient.patientName}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-white rounded-lg">
                <span className="material-symbols-outlined text-gray-500 mr-3">
                  cake
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {patient.age}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-white rounded-lg">
                <span className="material-symbols-outlined text-gray-500 mr-3">
                  female
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {patient.gender}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-white rounded-lg">
                <span className="material-symbols-outlined text-gray-500 mr-3">
                  water_drop
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Blood Group
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    {patient.bloodgroup || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Diagnosis *
            </h2>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter patient diagnosis..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Next Visit Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Next Visit *
            </h2>
            <input
              type="date"
              value={nextVisit}
              onChange={(e) => setNextVisit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Medicine Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Medicine Details *
              </h2>
              <button
                onClick={addMedicine}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-gray-500 font-medium hover:bg-gray-100 transition text-sm"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                <span>Add Medication</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">
                      Medicine Name *
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">
                      Dosage *
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">
                      Frequency *
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">
                      Duration *
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">
                      Instructions
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-3">
                        <input
                          className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                          type="text"
                          value={medicine.name}
                          onChange={(e) =>
                            handleMedicineChange(index, "name", e.target.value)
                          }
                          placeholder="Medicine name"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                          type="text"
                          value={medicine.dosage}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "dosage",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 10mg"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                          type="text"
                          value={medicine.frequency}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "frequency",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Once a day"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                          type="text"
                          value={medicine.duration}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 7 days"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          className="w-full bg-white border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                          type="text"
                          value={medicine.instructions}
                          onChange={(e) =>
                            handleMedicineChange(
                              index,
                              "instructions",
                              e.target.value
                            )
                          }
                          placeholder="Special instructions"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {medicines.length > 1 && (
                          <button
                            onClick={() => removeMedicine(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">
                              delete
                            </span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Instructions */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Additional Instructions *
            </h2>
            <textarea
              rows={3}
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter additional instructions for the patient..."
              required
            />
          </div>

          {/* Doctor's Signature */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Doctor's Signature
            </h2>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {doctorName}
                </p>
                <p className="text-sm text-gray-500">Doctor</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <button
              onClick={handleSendPrescription}
              disabled={loading || success}
              className="px-5 py-2.5 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">
                    send
                  </span>
                  <span>Send Prescription</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionByDoctor;
