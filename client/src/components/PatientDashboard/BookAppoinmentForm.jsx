import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const API = process.env.REACT_APP_API_URL || "https://backend-healthchain.onrender.com"; 


const BookAppointmentForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ Get doctor details from URL
  const doctorNameFromCard = searchParams.get("doctor") || "";
  const doctorIdFromCard = searchParams.get("doctorId") || "";

  // ✅ Get patient info from localStorage
  const savedPatientId = localStorage.getItem("patientId") || "";
  const savedPatientName = localStorage.getItem("patientName") || "";
  const savedPatientAge = localStorage.getItem("patientAge") || "";
  const savedPatientGender = localStorage.getItem("patientGender") || "";
  const savedPatientBloodGroup =
    localStorage.getItem("patientBloodGroup") || "";
  const savedPatientPhone = localStorage.getItem("patientPhone") || "";

  const [formData, setFormData] = useState({
    doctorName: doctorNameFromCard,
    doctorId: doctorIdFromCard,
    patientName: savedPatientName || "",
    patientId: savedPatientId || "",
    age: savedPatientAge || "",
    gender: savedPatientGender || "",
    bloodgroup: savedPatientBloodGroup || "",
    date: "",
    phone: savedPatientPhone || "",
    time: "",
    reason: "",
    notes: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ Debug: show parameters
  useEffect(() => {
    console.log("🔗 URL Parameters:", { doctorNameFromCard, doctorIdFromCard });
  }, [doctorNameFromCard, doctorIdFromCard]);

  // ✅ Update automatically when localStorage changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      patientName: savedPatientName || prev.patientName,
      patientId: savedPatientId || prev.patientId,
      age: savedPatientAge || prev.age,
      gender: savedPatientGender || prev.gender,
      bloodgroup: savedPatientBloodGroup || prev.bloodgroup,
      phone: savedPatientPhone || prev.phone,
    }));
  }, [
    savedPatientId,
    savedPatientName,
    savedPatientAge,
    savedPatientGender,
    savedPatientBloodGroup,
    savedPatientPhone,
  ]);

  // ✅ Handle change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.patientId) {
      alert("⚠️ Patient not logged in. Please log in first.");
      setLoading(false);
      return;
    }
    if (!formData.doctorId) {
      alert("⚠️ Doctor ID missing. Please select a valid doctor.");
      setLoading(false);
      return;
    }

    const form = new FormData();
    form.append("doctorId", formData.doctorId);
    form.append("doctorName", formData.doctorName);
    form.append("patientId", formData.patientId);
    form.append("patientName", formData.patientName);
    form.append("age", formData.age);
    form.append("gender", formData.gender);
    form.append("bloodgroup", formData.bloodgroup);
    form.append("date", formData.date);
    form.append("time", formData.time);
    form.append("reason", formData.reason);
    form.append("notes", formData.notes || "");
    form.append("phone", formData.phone);
    if (formData.file) form.append("file", formData.file);

    console.log("📤 FormData contents:");
    for (let [key, value] of form.entries()) console.log(`${key}:`, value);

    try {
<<<<<<< HEAD
      const res = await axios.post(
        `${API_BASE_URL}/api/appointments/book`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
=======
  const res = await axios.post(
  `${API}/api/appointments/book`,
  form,
  { headers: { "Content-Type": "multipart/form-data" } }
);
>>>>>>> 2da723d346a571afec5ac591aa947bb923e316ec

      if (res.status === 201) {
        // Show success popup
        setShowSuccess(true);

        // Wait for 2 seconds then redirect to doctors page
        setTimeout(() => {
          navigate("/doctors");
        }, 2000);
      } else {
        alert("⚠️ Unexpected response from server.");
      }
    } catch (error) {
      console.error("❌ Booking error:", error);
      if (error.response)
        console.error("❌ Server response:", error.response.data);
      alert("❌ Failed to book appointment. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-inter">
      {/* Success Popup Window */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg border border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-green-500 text-3xl">
                  check_circle
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Appointment Booked Successfully!
              </h3>
              <p className="text-gray-600 mb-4">
                Your appointment with{" "}
                <span className="font-semibold">Dr. {formData.doctorName}</span>{" "}
                has been confirmed.
              </p>
              
              
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Book Appointment
              </h1>
              <p className="text-sm text-gray-600">
                Doctor: {formData.doctorName} -{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <Link to="/doctors">
              <button className="text-gray-600 hover:text-gray-800 transition-colors">
                <span className="material-symbols-outlined text-3xl">
                  close
                </span>
              </button>
            </Link>
          </div>

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
                    {formData.patientName}
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
                    {formData.age}
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
                    {formData.gender}
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
                    {formData.bloodgroup || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Appointment Details Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Appointment Details *
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a time</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reason for Visit Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Reason for Visit *
              </h2>
              <textarea
                name="reason"
                rows="3"
                value={formData.reason}
                onChange={handleChange}
                required
                placeholder="Please describe the reason for your visit..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Additional Notes Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Additional Notes
              </h2>
              <textarea
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional information you'd like to share..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Medical Reports Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Upload Medical Reports
              </h2>
              <div className="relative">
                <input
                  type="file"
                  name="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    file:cursor-pointer"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                  <span className="material-symbols-outlined text-lg">
                    upload_file
                  </span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Supports: PDF, PNG, JPG, JPEG (Optional)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">
                      event_available
                    </span>
                    <span>Confirm Appointment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentForm;
