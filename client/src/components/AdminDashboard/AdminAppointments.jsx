import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [navLoading, setNavLoading] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/admin/all-appointments`
      );
      console.log("Appointments data:", res.data); // Debug log
      setAppointments(res.data);
      setMessage({ text: "", type: "" });
    } catch (error) {
      console.error("Error loading appointments:", error);
      setMessage({ 
        text: "Failed to load appointments. Please try again.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/admin/appointments/${appointmentId}/status`,
        { status: newStatus }
      );

      if (res.status === 200) {
        // Update local state
        setAppointments(prev => 
          prev.map(appt => 
            appt._id === appointmentId 
              ? { ...appt, status: newStatus }
              : appt
          )
        );
        setMessage({ 
          text: `Appointment status updated to ${newStatus}`, 
          type: "success" 
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setMessage({ 
        text: "Failed to update appointment status", 
        type: "error" 
      });
    }
  };

  // Handle navigation with loading animation
  const handleNavigation = (path, linkName) => {
    setNavLoading(true);
    setActiveLink(linkName);

    setTimeout(() => {
      setNavLoading(false);
      navigate(path);
    }, 800);
  };

  // Handle logout separately
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Filter appointments based on search and status
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      appointment.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
      appointment.date?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get status counts
  const statusCounts = {
    All: appointments.length,
    Pending: appointments.filter((a) => a.status === "Pending").length,
    Confirmed: appointments.filter((a) => a.status === "Confirmed").length,
    Completed: appointments.filter((a) => a.status === "Completed").length,
    Cancelled: appointments.filter((a) => a.status === "Cancelled").length,
  };

  // Status options for dropdown
  const statusOptions = ["Pending", "Confirmed", "Completed", "Cancelled"];

  if (loading) {
    return (
      <div className="flex min-h-screen font-inter bg-gray-50">
        <aside className="w-72 bg-white p-6 flex flex-col justify-between fixed left-0 top-0 bottom-0">
          {/* Sidebar skeleton */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse" />
            <div>
              <div className="h-4 w-24 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center ml-72">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
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

      {/* Sidebar - Fixed, no scrolling */}
      <aside className="w-72 bg-white p-6 flex flex-col justify-between fixed left-0 top-0 bottom-0">
        <div>
          {/* Admin Profile */}
          <div className="flex items-center gap-4 mb-10">
            <div
              className="w-12 h-12 rounded-full bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://cdn-icons-png.flaticon.com/512/3135/3135715.png")',
              }}
            />
            <div>
              <span className="font-semibold text-lg">Admin Panel</span>
              <p className="text-sm text-gray-500">Appointments Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => handleNavigation("/admin-dashboard", "Dashboard")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleNavigation("/admin-doctors", "Doctors")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">
                medical_services
              </span>
              <span>Doctors</span>
            </button>

            <button
              onClick={() => handleNavigation("/admin-patients", "Patients")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">group</span>
              <span>Patients</span>
            </button>

            <span className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left">
              <span className="material-symbols-outlined">event</span>
              <span>Appointments</span>
            </span>
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

      {/* Main Content - Scrollable area */}
      <main className="flex-1 p-8 overflow-y-auto ml-72">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-black">
                Appointments Management
              </h1>
              <p className="text-gray-500 mt-1">
                Total {appointments.length} appointments
              </p>
            </div>
            <button
              onClick={fetchAppointments}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Refresh
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 rounded-lg p-4 animate-fade-in ${
            message.type === "error" 
              ? "bg-red-50 border border-red-200 text-red-700" 
              : "bg-green-50 border border-green-200 text-green-700"
          }`}>
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined ${
                message.type === "error" ? "text-red-500" : "text-green-500"
              }`}>
                {message.type === "error" ? "error" : "check_circle"}
              </span>
              <div>
                <p className="font-medium">{message.text}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search by patient name, doctor name, or date..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                  statusFilter === status
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {status} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-sm text-gray-500 border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">
                      Appointment ID
                    </th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">
                      Patient
                    </th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">
                      Doctor
                    </th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">
                      Created On
                    </th>
                    
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment._id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-800">
                            #{appointment._id?.slice(-8)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0"
                            style={{
                              backgroundImage: `url(${
                                appointment.patientProfileImage ||
                                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                              })`,
                            }}
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {appointment.patientName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {appointment.patientEmail} • ID:{" "}
                              {appointment.patientId?.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0"
                            style={{
                              backgroundImage: `url(${
                                appointment.doctorProfileImage ||
                                "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
                              })`,
                            }}
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              Dr. {appointment.doctorName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {appointment.doctorSpecialization} • ID:{" "}
                              {appointment.doctorId?.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        <div>
                          <p className="font-medium">{appointment.date}</p>
                          <p className="text-sm text-gray-500">
                            {appointment.time}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : appointment.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : appointment.status === "Completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        {formatDate(appointment.createdAt)}
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">
                event_busy
              </span>
              <p className="text-gray-500 text-lg mb-2">
                {search || statusFilter !== "All"
                  ? "No appointments match your filters"
                  : "No appointments found"}
              </p>
              <p className="text-gray-400 text-sm">
                {search || statusFilter !== "All"
                  ? "Try adjusting your search or filter criteria"
                  : "Appointments will appear here once booked"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminAppointments;