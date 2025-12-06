import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";



const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  // Handle navigation with loading animation and error handling
  const handleNavigation = (path, linkName) => {
    setNavLoading(true);
    setActiveLink(linkName);

    setTimeout(() => {
      setNavLoading(false);
      navigate(path);
    }, 400);
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  useEffect(() => {
    // Check if user is admin
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin-login");
      return;
    }

    // Call fetchStats here
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(
      `${API}/api/admin/stats`
    );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      
      // Calculate completed and today's appointments count
      const [completedCount, todayCount] = await Promise.all([
        fetchCompletedAppointments(),
        fetchTodayAppointments()
      ]);
      
      const enhancedStats = {
        ...data,
        completed: completedCount,
        todayAppointments: todayCount,
      };
      
      setStats(enhancedStats);
      setMessage({ text: "", type: "" });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setMessage({ 
        text: "Failed to load dashboard data. Please try again.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch completed appointments count from appointments API
  const fetchCompletedAppointments = async () => {
    try {

      const res = await fetch(`${API_BASE_URL}/api/admin/all-appointments`);

      

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const appointments = await res.json();
      
      // Count appointments with "Completed" status
      const completedCount = appointments.filter(
        appointment => appointment.status === "Completed"
      ).length;
      
      return completedCount;
    } catch (error) {
      console.error("Error fetching completed appointments:", error);
      return 0;
    }
  };

  // Fetch today's appointments count from appointments API
  const fetchTodayAppointments = async () => {
    try {

      const res = await fetch(`${API_BASE_URL}/api/admin/all-appointments`);

      

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const appointments = await res.json();
      
      // Get today's date in the same format as your appointment dates
      const today = new Date();
      const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Alternative date formats to check
      const todayFormats = [
        todayString,
        today.toLocaleDateString('en-US'), // MM/DD/YYYY
        today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), // MMM DD, YYYY
      ];
      
      console.log("Today's date formats:", todayFormats);
      console.log("Appointments sample:", appointments.slice(0, 3)); // Debug first 3 appointments
      
      // Count appointments for today
      const todayCount = appointments.filter(appointment => {
        if (!appointment.date) return false;
        
        // Check if appointment date matches any of today's formats
        const appointmentDate = appointment.date.toString().trim();
        return todayFormats.some(format => 
          appointmentDate.includes(format) || 
          format.includes(appointmentDate)
        );
      }).length;
      
      console.log("Today's appointments count:", todayCount);
      
      return todayCount;
    } catch (error) {
      console.error("Error fetching today's appointments:", error);
      return 0;
    }
  };

  // Calculate derived statistics
  const calculateDerivedStats = () => {
    const total = stats.totalAppointments || 0;
    const pending = stats.pending || 0;
    const confirmed = stats.approved || 0;
    const cancelled = stats.cancelled || 0;
    const completed = stats.completed || 0;
    
    return {
      pendingPercentage: total ? Math.round((pending / total) * 100) : 0,
      confirmedPercentage: total ? Math.round((confirmed / total) * 100) : 0,
      cancelledPercentage: total ? Math.round((cancelled / total) * 100) : 0,
      completedPercentage: total ? Math.round((completed / total) * 100) : 0,
    };
  };

  const derivedStats = calculateDerivedStats();
  const adminName = localStorage.getItem("adminName") || "Admin";

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
            <p className="text-gray-600">Loading dashboard...</p>
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
              <span className="font-semibold text-lg">{adminName}</span>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            <span className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 transition-all duration-200">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </span>

            <button
              onClick={() => handleNavigation("/admin-doctors", "Doctors")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">medical_services</span>
              <span>Doctors</span>
            </button>

            <button
              onClick={() => handleNavigation("/admin-patients", "Patients")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">group</span>
              <span>Patients</span>
            </button>

            <button
              onClick={() => handleNavigation("/admin-appointments", "Appointments")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 text-left"
            >
              <span className="material-symbols-outlined">event</span>
              <span>Appointments</span>
            </button>
          </nav>
        </div>

        {/* Logout */}
        <nav>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-all duration-200 w-full text-left"
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
              <h1 className="text-4xl font-bold text-black">Admin Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome to the management system</p>
            </div>
            <button
              onClick={fetchStats}
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

        {/* Stats Cards - 4x4 Grid Layout */}
        <div className="space-y-8">
          {/* System Overview - 4 cards */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Doctors */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Doctors</p>
                    <p className="text-3xl font-bold mt-2">{stats.doctors || 0}</p>
                    <p className="text-blue-100 text-xs mt-2">Registered professionals</p>
                  </div>
                  <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
                    <span className="material-symbols-outlined text-2xl">medical_services</span>
                  </div>
                </div>
              </div>

              {/* Total Patients */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Patients</p>
                    <p className="text-3xl font-bold mt-2">{stats.patients || 0}</p>
                    <p className="text-green-100 text-xs mt-2">Registered patients</p>
                  </div>
                  <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
                    <span className="material-symbols-outlined text-2xl">group</span>
                  </div>
                </div>
              </div>

              {/* Total Appointments */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Appointments</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalAppointments || 0}</p>
                    <p className="text-purple-100 text-xs mt-2">All time appointments</p>
                  </div>
                  <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
                    <span className="material-symbols-outlined text-2xl">event</span>
                  </div>
                </div>
              </div>

              {/* Today's Appointments */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Today's Appointments</p>
                    <p className="text-3xl font-bold mt-2">{stats.todayAppointments || 0}</p>
                    <p className="text-orange-100 text-xs mt-2">Scheduled for today</p>
                  </div>
                  <div className="bg-orange-400 bg-opacity-30 p-3 rounded-full">
                    <span className="material-symbols-outlined text-2xl">today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments Status - 4 cards */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointments Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pending Appointments */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending || 0}</p>
                    <div className="flex items-center mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ 
                            width: `${derivedStats.pendingPercentage}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {derivedStats.pendingPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <span className="material-symbols-outlined text-yellow-600 text-xl">schedule</span>
                  </div>
                </div>
              </div>

              {/* Confirmed Appointments */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Confirmed</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved || 0}</p>
                    <div className="flex items-center mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ 
                            width: `${derivedStats.confirmedPercentage}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {derivedStats.confirmedPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <span className="material-symbols-outlined text-green-600 text-xl">check_circle</span>
                  </div>
                </div>
              </div>

              {/* Completed Appointments */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Completed</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.completed || 0}</p>
                    <div className="flex items-center mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ 
                            width: `${derivedStats.completedPercentage}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {derivedStats.completedPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <span className="material-symbols-outlined text-blue-600 text-xl">task_alt</span>
                  </div>
                </div>
              </div>

              {/* Cancelled Appointments */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Cancelled</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{stats.cancelled || 0}</p>
                    <div className="flex items-center mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ 
                            width: `${derivedStats.cancelledPercentage}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {derivedStats.cancelledPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <span className="material-symbols-outlined text-red-600 text-xl">cancel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
