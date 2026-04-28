import { ProtectedRoute } from "../../../login_session/ProtectedRoute";
import { getCurrentUser, logoutUser } from "../../../utils/auth";
import { NavLink, useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { getRisetById, updateRiset } from "../../../data/data_riset";
import type { Riset } from "../../../data/data_riset";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin - Edit Riset" },
    { name: "description", content: "Edit Riset - Admin" },
  ];
};

export default function EditRiset() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [formData, setFormData] = useState<Omit<Riset, 'id'>>({
    judul_riset: "",
    deskripsi_riset: "",
  });

  const handleLogout = () => {
    logoutUser();
    window.history.replaceState(null, "", "/admin/login");
    window.location.replace("/admin/login");
  };

  // Load existing data
  useEffect(() => {
    const loadRisetData = async () => {
      if (!id) return;

      try {
        const risetId = parseInt(id);
        if (isNaN(risetId)) {
          throw new Error("Invalid Riset ID");
        }
        const data = await getRisetById(risetId);

        if (data) {
          setFormData({
            judul_riset: data.judul_riset || "",
            deskripsi_riset: data.deskripsi_riset || "",
          });
        } else {
          alert("Data riset tidak ditemukan.");
          navigate("/admin/kelola_konten/kelola_riset");
        }
      } catch (error) {
        console.error("Error loading riset data:", error);
        alert("Gagal memuat data riset.");
        navigate("/admin/kelola_konten/kelola_riset");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadRisetData();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.judul_riset || !formData.deskripsi_riset) {
      alert('Judul Riset dan Deskripsi Riset harus diisi!');
      setIsLoading(false);
      return;
    }

    try {
      const risetId = parseInt(id as string);
      if (isNaN(risetId)) {
        throw new Error("Invalid Riset ID");
      }

      await updateRiset(risetId, formData);

      alert("Data riset berhasil diperbarui!");
      navigate("/admin/kelola_konten/kelola_riset");
    } catch (error) {
      console.error("Error updating riset:", error);
      if (error instanceof Error) {
        alert(`Gagal memperbarui data riset: ${error.message}`);
      } else {
        alert("Gagal memperbarui data riset. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data riset...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 mr-4"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Riset</h2>
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
          <div className="p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-6">
                    {/* Judul Riset */}
                    <div>
                      <label htmlFor="judul_riset" className="block text-sm font-medium text-gray-700 mb-2">
                        Judul Riset *
                      </label>
                      <textarea
                        id="judul_riset"
                        name="judul_riset"
                        required
                        rows={3}
                        value={formData.judul_riset}
                        onChange={handleInputChange}
                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan judul riset"
                      />
                    </div>

                    {/* Deskripsi Riset */}
                    <div>
                      <label htmlFor="deskripsi_riset" className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi Riset *
                      </label>
                      <textarea
                        id="deskripsi_riset"
                        name="deskripsi_riset"
                        required
                        rows={6}
                        value={formData.deskripsi_riset}
                        onChange={handleInputChange}
                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan deskripsi riset"
                      />
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => navigate("/admin/kelola_konten/kelola_riset")}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Menyimpan..." : "Perbarui"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}