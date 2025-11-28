import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);
  const [activeLink, setActiveLink] = useState("");
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
      const res = await fetch("http://localhost:5000/api/admin/stats");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      
    } finally {
      setLoading(false);
    }
  };

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
            <span className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </span>

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

            <button
              onClick={() =>
                handleNavigation("/admin-appointments", "Appointments")
              }
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left"
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
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-red-500 transition-all duration-200 w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content - Scrollable area */}
      <main className="flex-1 p-8 overflow-y-auto ml-72">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to the management system</p>
        </div>

        {/* Stats Cards - 3 cards per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.doctors || 0}
                </p>
              </div>
              <span className="material-symbols-outlined text-blue-500 text-3xl">
                medical_services
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Patients</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.patients || 0}
                </p>
              </div>
              <span className="material-symbols-outlined text-green-500 text-3xl">
                group
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.totalAppointments || 0}
                </p>
              </div>
              <span className="material-symbols-outlined text-purple-500 text-3xl">
                event
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Appointments</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.pending || 0}
                </p>
              </div>
              <span className="material-symbols-outlined text-yellow-500 text-3xl">
                schedule
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Confirmed Appointments</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.approved || 0}
                </p>
              </div>
              <span className="material-symbols-outlined text-green-500 text-3xl">
                check_circle
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cancelled Appointments</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.cancelled || 0}
                </p>
              </div>
              <span className="material-symbols-outlined text-red-500 text-3xl">
                cancel
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
