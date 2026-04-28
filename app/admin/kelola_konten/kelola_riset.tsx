import { ProtectedRoute } from "../../login_session/ProtectedRoute";
import { getCurrentUser, logoutUser } from "../../utils/auth";
import { NavLink, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { supabase } from "../../koneksi_supabase";
import type { Riset } from "../../data/data_riset";
import { getAllRiset, deleteRiset as deleteRisetSupabase, searchRiset } from "../../data/data_riset";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Kelola Riset" },
    { name: "description", content: "Kelola Riset - Admin" },
  ];
};

export default function KelolaRiset() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [risetList, setRisetList] = useState<Riset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number | null; judul: string }>({
    show: false,
    id: null,
    judul: ""
  });
  const [searchTerm, setSearchTerm] = useState("");


  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(risetList.length / itemsPerPage);

  const handleLogout = () => {
    logoutUser();
    // Clear browser history and prevent back navigation
    window.history.replaceState(null, "", "/admin/login");
    window.location.replace("/admin/login");
  };

  // Load riset data from Supabase
  useEffect(() => {
    const loadRisetData = async () => {
      setIsLoading(true);
      try {
        const data = await getAllRiset();
        setRisetList(data || []);
      } catch (error) {
        console.error("Error loading riset data:", error);
        alert("Gagal memuat data riset.");
      } finally {
        setIsLoading(false);
      }
    };

    loadRisetData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteRisetSupabase(id);

      // Update local state
      setRisetList(prev => prev.filter(r => r.id !== id));
      setDeleteConfirm({ show: false, id: null, judul: "" });
      alert("Data riset berhasil dihapus!");
    } catch (error) {
      console.error("Error deleting riset:", error);
      alert("Gagal menghapus data riset.");
    }
  };

  const confirmDelete = (id: number, judul: string) => {
    setDeleteConfirm({ show: true, id, judul });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, id: null, judul: "" });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await searchRiset(searchTerm);
      setRisetList(data || []);
      setCurrentPage(1); // Reset to first page on new search
    } catch (error) {
      console.error("Error searching riset data:", error);
      alert("Gagal mencari data riset.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentRiset = risetList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


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
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Kelola Riset</h2>
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
              {/* Add New Button and Search */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                <button
                  onClick={() => navigate("/admin/kelola_konten/crud_kelola_riset/tambah_riset")}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm w-full sm:w-auto justify-center"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Tambah Riset</span>
                </button>
                <form onSubmit={handleSearch} className="w-full sm:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari riset..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </form>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Memuat data riset...</p>
                </div>
              ) : (
                <>
                  {/* Riset List */}
                  {risetList.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <div className="text-gray-400 mb-4">
                        <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-0.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data riset</h3>
                      <p className="text-gray-500 mb-4">Mulai dengan menambahkan riset pertama.</p>
                      <button
                        onClick={() => navigate("/admin/kelola_konten/crud_kelola_riset/tambah_riset")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Tambah Riset
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                          Daftar Riset ({risetList.length})
                        </h3>
                      </div>
                      
                      {/* Desktop Table View */}
                      <div className="hidden lg:block">
                        <table className="w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                                Judul Riset
                              </th>
                              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                                Deskripsi Riset
                              </th>
                              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                Aksi
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {currentRiset.map((riset) => (
                              <tr key={riset.id} className="hover:bg-gray-50">
                                <td className="px-3 py-4">
                                  <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                    {riset.judul_riset}
                                  </div>
                                </td>
                                <td className="px-3 py-4">
                                  <div className="text-sm text-gray-900 line-clamp-2">
                                    {riset.deskripsi_riset}
                                  </div>
                                </td>
                                <td className="px-3 py-4 text-center">
                                  <div className="flex justify-center space-x-1">
                                    <button
                                      onClick={() => navigate(`/admin/kelola_konten/crud_kelola_riset/edit_riset/${riset.id}`)}
                                      className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-xs transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => confirmDelete(riset.id, riset.judul_riset)}
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
                        {currentRiset.map((riset) => (
                          <div key={riset.id} className="border-b border-gray-200 p-3">
                            <div className="flex items-start space-x-3">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                                  {riset.judul_riset}
                                </div>
                                <div className="text-xs text-gray-600 mb-2 line-clamp-3">
                                  {riset.deskripsi_riset}
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => navigate(`/admin/kelola_konten/crud_kelola_riset/edit_riset/${riset.id}`)}
                                    className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors text-xs"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => confirmDelete(riset.id, riset.judul_riset)}
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
                          Menampilkan {(currentPage - 1) * itemsPerPage + 1} sampai{" "}
                          {Math.min(currentPage * itemsPerPage, risetList.length)} dari{" "}
                          {risetList.length} riset
                        </div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i}
                              onClick={() => paginate(i + 1)}
                              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                                currentPage === i + 1 ? "z-10 bg-green-50 border-green-500 text-green-600" : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
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
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Hapus Riset</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Apakah Anda yakin ingin menghapus riset "{deleteConfirm.judul}"? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="delete-button"
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mr-2"
                  onClick={() => deleteConfirm.id !== null && handleDelete(deleteConfirm.id)}
                >
                  Hapus
                </button>
                <button
                  id="cancel-button"
                  className="mt-3 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={cancelDelete}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}