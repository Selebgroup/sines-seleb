import { ProtectedRoute } from "../../../login_session/ProtectedRoute";
import { getCurrentUser, logoutUser } from "../../../utils/auth";
import { NavLink, useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { supabase } from "../../../koneksi_supabase";

import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin - Edit Berita" },
    { name: "description", content: "Edit Berita - Admin" },
  ];
};

interface Berita {
  id: number;
  judul_berita: string;
  isi_berita: string;
  tanggal_berita: string;
  foto_berita: string;
  link_yt: string;
  reporter: string;
}

export default function EditBerita() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  
  const [formData, setFormData] = useState({
    judul_berita: "",
    isi_berita: "",
    tanggal_berita: "",
    link_yt: "",
    reporter: "",
  });

  const handleLogout = () => {
    logoutUser();
    window.history.replaceState(null, "", "/admin/login");
    window.location.replace("/admin/login");
  };

  // Load existing data
  useEffect(() => {
    const loadBeritaData = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('data_berita')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setFormData(prev => ({
            ...prev,
            judul_berita: data.judul_berita || "",
            isi_berita: data.isi_berita || "",
            tanggal_berita: data.tanggal_berita || "",
            link_yt: data.link_yt || "",
            reporter: data.reporter || "",
          }));
          setCurrentImageUrl(data.foto_berita || "");
        }
      } catch (error) {
        console.error("Error loading news data:", error);
        alert("Gagal memuat data berita.");
        navigate("/admin/kelola_konten/kelola_berita");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadBeritaData();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setImagePreview("");
    }
  };

  const deleteOldImage = async (imageUrl: string) => {
    if (!imageUrl) return;
    
    try {
      // Extract filename from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      await supabase.storage
        .from('foto_berita')
        .remove([fileName]);
    } catch (error) {
      console.error("Error deleting old image:", error);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('foto_berita')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('foto_berita')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = currentImageUrl;
      
      if (selectedImage) {
        // Delete old image if exists
        if (currentImageUrl) {
          await deleteOldImage(currentImageUrl);
        }
        
        // Upload new image
        imageUrl = await uploadImage(selectedImage);
      }

      const { error } = await supabase
        .from('data_berita')
        .update({
          judul_berita: formData.judul_berita,
          isi_berita: formData.isi_berita,
          tanggal_berita: formData.tanggal_berita,
          foto_berita: imageUrl,
          link_yt: formData.link_yt,
          reporter: formData.reporter,
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      alert("Data berita berhasil diperbarui!");
      navigate("/admin/kelola_konten/kelola_berita");
    } catch (error) {
      console.error("Error updating news:", error);
      alert("Gagal memperbarui data berita. Silakan coba lagi.");
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
            <p className="mt-4 text-gray-600">Memuat data berita...</p>
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
          fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md shadow-lg transform transition-transform duration-300 ease-in-out h-screen overflow-y-auto
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
        <div className="flex-1 lg:ml-64">
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
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Berita</h2>
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
                    {/* Judul Berita */}
                    <div className="col-span-2">
                      <label htmlFor="judul_berita" className="block text-sm font-medium text-gray-700 mb-2">
                        Judul Berita *
                      </label>
                      <textarea
                        id="judul_berita"
                        name="judul_berita"
                        rows={3}
                        required
                        value={formData.judul_berita}
                        onChange={handleInputChange}
                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan judul berita"
                      />
                    </div>
                      {/* Tanggal Berita */}
                      <div>
                        <label htmlFor="tanggal_berita" className="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal Berita *
                        </label>
                        <input
                          type="date"
                          id="tanggal_berita"
                          name="tanggal_berita"
                          required
                          value={formData.tanggal_berita}
                          onChange={handleInputChange}
                          className="text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                    {/* Reporter */}
                    <div>
                      <label htmlFor="reporter" className="block text-sm font-medium text-gray-700 mb-2">
                        Reporter/Penulis
                      </label>
                      <input
                        type="text"
                        id="reporter"
                        name="reporter"
                        value={formData.reporter}
                        onChange={handleInputChange}
                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan nama reporter atau penulis (opsional)"
                      />
                    </div>

                    {/* Isi Berita */}
                    <div>
                      <label htmlFor="isi_berita" className="block text-sm font-medium text-gray-700 mb-2">
                        Isi Berita *
                      </label>
                      <textarea
                        id="isi_berita"
                        name="isi_berita"
                        required
                        rows={10}
                        value={formData.isi_berita}
                        onChange={handleInputChange}
                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan isi berita"
                      />
                    </div>

                    {/* Link YouTube */}
                    <div>
                      <label htmlFor="link_yt" className="block text-sm font-medium text-gray-700 mb-2">
                        Link YouTube
                      </label>
                      <input
                        type="url"
                        id="link_yt"
                        name="link_yt"
                        value={formData.link_yt}
                        onChange={handleInputChange}
                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan link YouTube (opsional)"
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                        Foto Berita
                      </label>
                      
                      {/* Current Image */}
                      {currentImageUrl && !imagePreview && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Foto saat ini:</p>
                          <img
                            src={currentImageUrl}
                            alt="Current"
                            className="object-cover rounded-lg border border-gray-300"
                          />
                        </div>
                      )}
                      
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      
                      {/* New Image Preview */}
                      {imagePreview && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Preview foto baru:</p>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="object-cover rounded-lg border border-gray-300"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => navigate("/admin/kelola_konten/kelola_berita")}
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