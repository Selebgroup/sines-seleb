import { ProtectedRoute } from "../../login_session/ProtectedRoute";
import { getCurrentUser, logoutUser } from "../../utils/auth";
import { NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { supabase } from "../../koneksi_supabase";

import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Kelola Student" },
    { name: "description", content: "Kelola Student - Admin" },
  ];
};

interface Student {
  id: number;
  name: string;
  position: string;
  topik_riset: string;
  education: string;
  supervisor: string;
  image: string;
  link_penelitian: string;
}

export default function KelolaStudent() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
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
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleLogout = () => {
    logoutUser();
    // Clear browser history and prevent back navigation
    window.history.replaceState(null, "", "/admin/login");
    window.location.replace("/admin/login");
  };

  // Load student data from Supabase
  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const { data, error } = await supabase
          .from('data_student')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        const positionPriority: { [key: string]: number } = {
          "Postdoctoral": 1,
          "Researcher Assistant": 2,
          "Tugas Akhir": 3,
          "MBKM": 4,
        };

        const sortedStudents = (data || []).sort((a, b) => {
          const priorityA = positionPriority[a.position] || 99; // Default to a high number for other positions
          const priorityB = positionPriority[b.position] || 99;

          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }

          return a.name.localeCompare(b.name);
        });

        setStudents(sortedStudents || []);
      } catch (error) {
        console.error("Error loading student data:", error);
        alert("Gagal memuat data student.");
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      // Get the student to delete their image
      const studentToDelete = students.find(s => s.id === id);
      
      if (studentToDelete?.image) {
        // Extract filename from URL and delete from storage
        const urlParts = studentToDelete.image.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        await supabase.storage
          .from('foto_student')
          .remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase
        .from('data_student')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setStudents(prev => prev.filter(s => s.id !== id));
      setDeleteConfirm({ show: false, id: null, name: "" });
      alert("Data student berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Gagal menghapus data student.");
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
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Kelola Student</h2>
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
                  onClick={() => navigate("/admin/kelola_konten/crud_kelola_student/tambah_data_student")}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Tambah Student</span>
                </button>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Memuat data student...</p>
                </div>
              ) : (
                <>
                  {/* Student List */}
                  {students.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <div className="text-gray-400 mb-4">
                        <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data student</h3>
                      <p className="text-gray-500 mb-4">Mulai dengan menambahkan student pertama.</p>
                      <button
                        onClick={() => navigate("/admin/kelola_konten/crud_kelola_student/tambah_data_student")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Tambah Student
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                          Daftar Student ({students.length})
                        </h3>
                      </div>
                      
                      {/* Desktop Table View */}
                      <div className="hidden lg:block">
                        <table className="w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                                Student
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                Posisi & Supervisor
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                Topik Riset
                              </th>
                              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                Aksi
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentStudents.map((student) => (
                              <tr key={student.id} className="hover:bg-gray-50">
                                <td className="px-3 py-4">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={student.image || "/default-avatar.png"}
                                        alt={student.name}
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = "/default-avatar.png";
                                        }}
                                      />
                                    </div>
                                    <div className="ml-3 min-w-0 flex-1">
                                      <div className="text-sm font-medium text-gray-900 truncate">
                                        {student.name}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-4">
                                  <div className="text-sm text-gray-900 font-medium flex items-center">
                                   {student.position}
                                   {student.position === "Postdoctoral" && (
                                     <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">Postdoc</span>
                                   )}
                                   {student.position === "Researcher Assistant" && (
                                     <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">RA</span>
                                   )}
                                   {student.position === "Tugas Akhir" && (
                                     <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">TA</span>
                                   )}
                                   {student.position === "MBKM" && (
                                     <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">MBKM</span>
                                   )}
                                 </div>
                                  <div className="text-xs text-gray-500 truncate">{student.supervisor}</div>
                                </td>
                                <td className="px-3 py-4">
                                  <div className="text-sm text-gray-900 line-clamp-2">
                                    {student.topik_riset}
                                  </div>
                                </td>
                                <td className="px-3 py-4 text-center">
                                  <div className="flex justify-center space-x-1">
                                    <button
                                      onClick={() => navigate(`/admin/kelola_konten/crud_kelola_student/edit_data_student/${student.id}`)}
                                      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-xs transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => confirmDelete(student.id, student.name)}
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
                        {currentStudents.map((student) => (
                          <div key={student.id} className="border-b border-gray-200 p-3">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={student.image || "/default-avatar.png"}
                                  alt={student.name}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/default-avatar.png";
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 mb-1">
                                  {student.name}
                                </div>
                                <div className="text-sm text-gray-600 mb-1 flex items-center">
                                  {student.position}
                                  {student.position === "Postdoctoral" && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">Postdoc</span>
                                  )}
                                  {student.position === "Researcher Assistant" && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">RA</span>
                                  )}
                                  {student.position === "Tugas Akhir" && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">TA</span>
                                  )}
                                  {student.position === "MBKM" && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">MBKM</span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-600 mb-2 truncate">
                                  Supervisor: {student.supervisor}
                                </div>
                                <div className="text-xs text-gray-500 mb-3 line-clamp-2">
                                  {student.topik_riset}
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => navigate(`/admin/kelola_konten/crud_kelola_student/edit_data_student/${student.id}`)}
                                    className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors text-xs"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => confirmDelete(student.id, student.name)}
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
                      {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4">
                          <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                            Menampilkan {indexOfFirstItem + 1} sampai {Math.min(indexOfLastItem, students.length)} dari {students.length} entries
                          </div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                              onClick={() => paginate(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span>Previous</span>
                            </button>
                            {[...Array(totalPages)].map((_, index) => {
                              const pageNumber = index + 1;
                              // Logic to display a limited number of page numbers
                              if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                              ) {
                                return (
                                  <button
                                    key={pageNumber}
                                    onClick={() => paginate(pageNumber)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                      pageNumber === currentPage
                                        ? "z-10 bg-green-50 border-green-500 text-green-600"
                                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                                  >
                                    {pageNumber}
                                  </button>
                                );
                              } else if (
                                (pageNumber === currentPage - 2 && currentPage > 3) ||
                                (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                              ) {
                                return (
                                  <span key={pageNumber} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    ...
                                  </span>
                                );
                              }
                              return null;
                            })}
                            <button
                              onClick={() => paginate(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span>Next</span>
                            </button>
                          </nav>
                        </div>
                      )}
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
                  Apakah Anda yakin ingin menghapus student <strong>{deleteConfirm.name}</strong>? 
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