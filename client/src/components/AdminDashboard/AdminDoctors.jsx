import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [navLoading, setNavLoading] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/all-doctors"
      );
      setDoctors(res.data);
    } catch (error) {
      console.error("Error loading doctors:", error);
    } finally {
      setLoading(false);
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

  // Filter doctors based on search
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name?.toLowerCase().includes(search.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(search.toLowerCase())
  );

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
            <p className="text-gray-600">Loading doctors...</p>
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
              <p className="text-sm text-gray-500">Doctors Management</p>
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

            <span className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-gray-300 hover:text-blue-500 transition-all duration-200 text-left">
              <span className="material-symbols-outlined">
                medical_services
              </span>
              <span>Doctors</span>
            </span>

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-black">
                Doctors Management
              </h1>
              <p className="text-gray-500 mt-1">
                Total {doctors.length} doctors registered
              </p>
            </div>
            <button
              onClick={fetchDoctors}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Refresh
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search doctors by name, email, or specialization..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Doctors Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredDoctors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-sm text-gray-500 border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">
                      Doctor
                    </th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">
                      Specialization
                    </th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">
                      Phone
                    </th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">
                      Registered On
                    </th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDoctors.map((doctor) => (
                    <tr
                      key={doctor._id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
                            style={{
                              backgroundImage: `url(${
                                doctor.profileImage ||
                                "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
                              })`,
                            }}
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {doctor.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              ID: {doctor._id?.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        {doctor.specialization || "Not specified"}
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        <div className="truncate max-w-xs">{doctor.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        {doctor.phone || "Not provided"}
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        {formatDate(doctor.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">
                medical_services
              </span>
              <p className="text-gray-500 text-lg mb-2">
                {search
                  ? "No doctors match your search"
                  : "No doctors registered yet"}
              </p>
              <p className="text-gray-400 text-sm">
                {search
                  ? "Try adjusting your search terms"
                  : "Doctors will appear here once registered"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDoctors;
