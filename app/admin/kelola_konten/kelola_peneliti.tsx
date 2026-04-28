import { ProtectedRoute } from "../../login_session/ProtectedRoute";
import { getCurrentUser, logoutUser } from "../../utils/auth";
import { NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { supabase } from "../../koneksi_supabase";

import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Kelola Peneliti" },
    { name: "description", content: "Kelola Peneliti - Admin" },
  ];
};

interface FacultyMember {
  id: number;
  name: string;
  position: string;
  specialization: string;
  education: string;
  email: string;
  image: string;
  link_penelitian: string;
  bibliography: string;
}

export default function KelolaPeneliti() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number | null; name: string }>(
     { show: false, id: null, name: "" }
   );

   // Pagination states
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 4;

   // Calculate for pagination
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentPeneliti = facultyMembers.slice(indexOfFirstItem, indexOfLastItem);
   const totalPages = Math.ceil(facultyMembers.length / itemsPerPage);

   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

   const handleLogout = () => {
    logoutUser();
    // Clear browser history and prevent back navigation
    window.history.replaceState(null, "", "/admin/login");
    window.location.replace("/admin/login");
  };

  // Load faculty data from Supabase
  useEffect(() => {
    const loadFacultyData = async () => {
      try {
        const { data, error } = await supabase
          .from('data_peneliti')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        // Define priority for researcher positions for custom sorting.
        // Positions not listed here will have a lower priority (99).
        const positionPriority: { [key: string]: number } = {
          "Professor Researcher": 1,
          "Senior Researcher": 2,
          "Junior Researcher": 3,
        };

        // Sort faculty members based on position priority and then alphabetically by name.
        const sortedFacultyMembers = (data || []).sort((a, b) => {
          const priorityA = positionPriority[a.position] || 99;
          const priorityB = positionPriority[b.position] || 99;

          // If positions are different, sort by priority.
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }

          // If positions are the same, sort alphabetically by name.
          return a.name.localeCompare(b.name);
        });

        setFacultyMembers(sortedFacultyMembers || []);
      } catch (error) {
        console.error("Error loading faculty data:", error);
        alert("Gagal memuat data peneliti.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFacultyData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      // Get the faculty member to delete their image
      const facultyToDelete = facultyMembers.find(f => f.id === id);
      
      if (facultyToDelete?.image) {
        // Extract filename from URL and delete from storage
        const urlParts = facultyToDelete.image.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        await supabase.storage
          .from('foto_peneliti')
          .remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase
        .from('data_peneliti')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setFacultyMembers(prev => prev.filter(f => f.id !== id));
      setDeleteConfirm({ show: false, id: null, name: "" });
      alert("Data peneliti berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting faculty:", error);
      alert("Gagal menghapus data peneliti.");
    }
  };

  const confirmDelete = (id: number, name: string) => {
    setDeleteConfirm({ show: true, id, name });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, id: null, name: "" });
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
                className={({ isActive }: { isActive: boolean }) =>
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
                className={({ isActive }: { isActive: boolean }) =>
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
                className={({ isActive }: { isActive: boolean }) =>
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
                className={({ isActive }: { isActive: boolean }) =>
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
                className={({ isActive }: { isActive: boolean }) =>
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
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Kelola Peneliti</h2>
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

          {/* Content */}
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="max-w-6xl mx-auto">
              {/* Add New Button */}
              <div className="mb-4">
                <button
                  onClick={() => navigate("/admin/kelola_konten/crud_kelola_peneliti/tambah_peneliti")}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Tambah Peneliti</span>
                </button>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Memuat data peneliti...</p>
                </div>
              ) : (
                <>
                  {/* Faculty List */}
                  {facultyMembers.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <div className="text-gray-400 mb-4">
                        <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data peneliti</h3>
                      <p className="text-gray-500 mb-4">Mulai dengan menambahkan peneliti pertama.</p>
                      <button
                        onClick={() => navigate("/admin/kelola_konten/crud_kelola_peneliti/tambah_peneliti")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Tambah Peneliti
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                          Daftar Peneliti ({facultyMembers.length})
                        </h3>
                      </div>
                      
                      {/* Desktop Table View */}
                      <div className="hidden lg:block">
                        <table className="w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                                Peneliti
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                Posisi & Email
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                Spesialisasi
                              </th>
                              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                Aksi
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentPeneliti.map((faculty) => (
                              <tr key={faculty.id} className="hover:bg-gray-50">
                                <td className="px-3 py-4">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={faculty.image || "/default-avatar.png"}
                                        alt={faculty.name}
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = "/default-avatar.png";
                                        }}
                                      />
                                    </div>
                                    <div className="ml-3 min-w-0 flex-1">
                                      <div className="text-sm font-medium text-gray-900 truncate">
                                        {faculty.name}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-4">
                                  <div className="text-sm text-gray-900 font-medium">{faculty.position}</div>
                                  <div className="text-xs text-gray-500 truncate">{faculty.email}</div>
                                </td>
                                <td className="px-3 py-4">
                                  <div className="text-sm text-gray-900 line-clamp-2">
                                    {faculty.specialization}
                                  </div>
                                </td>
                                <td className="px-3 py-4 text-center">
                                  <div className="flex justify-center space-x-1">
                                    <button
                                      onClick={() => navigate(`/admin/kelola_konten/crud_kelola_peneliti/edit_peneliti/${faculty.id}`)}
                                      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-xs transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => confirmDelete(faculty.id, faculty.name)}
                                      className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded text-xs transition-colors"
                                    >
                                      Hapus
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile Card View */}
                      <div className="lg:hidden">
                        {currentPeneliti.map((faculty) => (
                          <div key={faculty.id} className="border-b border-gray-200 p-3">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={faculty.image || "/default-avatar.png"}
                                  alt={faculty.name}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/default-avatar.png";
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 mb-1">
                                  {faculty.name}
                                </div>
                                <div className="text-sm text-gray-600 mb-1">
                                  {faculty.position}
                                </div>
                                <div className="text-xs text-gray-600 mb-2 truncate">
                                  {faculty.email}
                                </div>
                                <div className="text-xs text-gray-500 mb-3 line-clamp-2">
                                  {faculty.specialization}
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => navigate(`/admin/kelola_konten/crud_kelola_peneliti/edit_peneliti/${faculty.id}`)}
                                    className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors text-xs"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => confirmDelete(faculty.id, faculty.name)}
                                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors text-xs"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination Controls */}
                      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          Menampilkan {(currentPage - 1) * itemsPerPage + 1} sampai {
                            Math.min(currentPage * itemsPerPage, facultyMembers.length)
                          } dari {facultyMembers.length} entries
                        </div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span>Previous</span>
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${page === currentPage ? 'z-10 bg-green-50 border-green-500 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                  {page}
                                </button>
                              );
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                              return (
                                <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span>Next</span>
                          </button>
                        </nav>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Konfirmasi Hapus
                  </h3>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Apakah Anda yakin ingin menghapus peneliti <strong>{deleteConfirm.name}</strong>? 
                  Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait termasuk foto.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
