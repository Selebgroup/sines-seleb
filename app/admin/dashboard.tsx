import type { MetaFunction } from "react-router";
import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import ProtectedRoute from "../login_session/ProtectedRoute";
import { getCurrentUser, logoutUser } from "../utils/auth";
import { getAllBerita } from "../data/data_berita";
import { getAllFacultyMembers } from "../data/facultyData";
import { getAllStudentMembers } from "../data/studentData";
import { getAllRiset } from "../data/data_riset";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUserGraduate, faUserTie, faNewspaper } from '@fortawesome/free-solid-svg-icons';

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - Home" },
    { name: "description", content: "Dashboard - Admin" },
  ];
};

export default function Dashboard() {
  const user = getCurrentUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [beritaCount, setBeritaCount] = useState<number | null>(null);
  const [facultyCount, setFacultyCount] = useState<number | null>(null);
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [risetCount, setRisetCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allBerita = await getAllBerita();
        setBeritaCount(allBerita.length);
      } catch (error) {
        console.error("Failed to fetch berita count:", error);
        setBeritaCount(0);
      }

      try {
        const allFaculty = await getAllFacultyMembers();
        setFacultyCount(allFaculty.length);
      } catch (error) {
        console.error("Failed to fetch faculty count:", error);
        setFacultyCount(0);
      }

      try {
        const allStudents = await getAllStudentMembers();
        setStudentCount(allStudents.length);
      } catch (error) {
        console.error("Failed to fetch student count:", error);
        setStudentCount(0);
      }

      try {
        const allRiset = await getAllRiset();
        setRisetCount(allRiset.length);
      } catch (error) {
        console.error("Failed to fetch riset count:", error);
        setRisetCount(0);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logoutUser();
    // Clear browser history and prevent back navigation
    window.history.replaceState(null, "", "/admin/login");
    window.location.replace("/admin/login");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar Navigation */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md shadow-lg transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <img
                  className="h-8 w-8 mr-3"
                  src="/logo sines.svg"
                  alt="SINES Logo"
                />
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              </div>
              {/* Close button for mobile */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="space-y-2">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-md"
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                Home
              </NavLink>

              <NavLink
                to="/admin/kelola_konten/kelola_riset"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-md"
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                Kelola Riset
              </NavLink>

              <NavLink
                to="/admin/kelola_konten/kelola_berita"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-md"
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                Kelola Berita
              </NavLink>

              <NavLink
                to="/admin/kelola_konten/kelola_peneliti"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-md"
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                Kelola Peneliti
              </NavLink>
              
              <NavLink
                to="/admin/kelola_konten/kelola_student"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-green-500 hover:text-white hover:shadow-md"
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                Kelola Student
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Top Header */}
          <div className="bg-white shadow">
            <div className="px-4 sm:px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {/* Mobile menu button */}
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 mr-4"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h2>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="text-gray-700 text-sm sm:text-base hidden sm:inline">Hi, {user?.username}</span>
                  <span className="text-gray-700 text-sm sm:hidden">{user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-4 sm:p-6">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Selamat datang di Dashboard Admin
              </h2>
              <p className="text-gray-600 mb-2 text-base">
                Username: {user?.username || "Username tidak diketahui"}
              </p>
              <p className="text-gray-500 text-sm max-w-md">
                Ini adalah halaman dashboard admin. Anda dapat mengelola konten website dari sini.
              </p>
            </div>

            <hr className="my-6 border-gray-300" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card Jumlah Berita */}
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <FontAwesomeIcon icon={faNewspaper} className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-base">Total Berita</p>
                  <p className="text-2xl font-bold text-gray-900">{beritaCount !== null ? beritaCount : '...'}</p>
                </div>
              </div>

              {/* Card Jumlah Peneliti */}
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                  <FontAwesomeIcon icon={faUserTie} className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-base">Total Peneliti</p>
                  <p className="text-2xl font-bold text-gray-900">{facultyCount !== null ? facultyCount : '...'}</p>
                </div>
              </div>

              {/* Card Jumlah Mahasiswa dan Postdoc */}
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
                <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                  <FontAwesomeIcon icon={faUserGraduate} className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-base">Total Mahasiswa/Postdoctoral</p>
                  <p className="text-2xl font-bold text-gray-900">{studentCount !== null ? studentCount : '...'}</p>
                </div>
              </div>

              {/* Card Jumlah Riset */}
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
                <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full">
                  <FontAwesomeIcon icon={faBook} className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-base">Total Riset</p>
                  <p className="text-2xl font-bold text-gray-900">{risetCount !== null ? risetCount : '...'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}