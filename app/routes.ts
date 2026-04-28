import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Home route with root layout
  index("routes/home.tsx"),
  // Other main routes with root layout
  route("tentang", "routes/tentang.tsx"),
  route("penelitian", "routes/penelitian.tsx"),
  route("penelitian/:id", "routes/halaman_penelitian/detail_penelitian.tsx"),
  route("tim", "routes/tim.tsx"),
  route("data-tim-peneliti/:name", "routes/data_tim_peneliti.tsx"),
  route("berita", "routes/berita.tsx"),
  route("kontak", "routes/kontak.tsx"),

  // Admin routes
  route("admin/login", "admin/login.tsx"),
  route("admin/register", "admin/register.tsx"),
  route("admin/dashboard", "admin/dashboard.tsx"),

  // Admin content management routes
  route("admin/kelola_konten/kelola_berita", "admin/kelola_konten/kelola_berita.tsx"),
  route("admin/kelola_konten/kelola_peneliti", "admin/kelola_konten/kelola_peneliti.tsx"),
  route("admin/kelola_konten/kelola_student", "admin/kelola_konten/kelola_student.tsx"),
  route("admin/kelola_konten/kelola_riset", "admin/kelola_konten/kelola_riset.tsx"),

  // CRUD routes for kelola_peneliti
  route("admin/kelola_konten/crud_kelola_peneliti/tambah_peneliti", "admin/kelola_konten/crud_kelola_peneliti/tambah_peneliti.tsx"),
  route("admin/kelola_konten/crud_kelola_peneliti/edit_peneliti/:id", "admin/kelola_konten/crud_kelola_peneliti/edit_peneliti.tsx"),
  
  // CRUD routes for kelola_student
  route("admin/kelola_konten/crud_kelola_student/tambah_data_student", "admin/kelola_konten/crud_kelola_student/tambah_data_student.tsx"),
  route("admin/kelola_konten/crud_kelola_student/edit_data_student/:id", "admin/kelola_konten/crud_kelola_student/edit_data_student.tsx"),
  
  // CRUD routes for kelola_berita
  route("admin/kelola_konten/crud_kelola_berita/tambah_berita", "admin/kelola_konten/crud_kelola_berita/tambah_berita.tsx"),
  route("admin/kelola_konten/crud_kelola_berita/edit_berita/:id", "admin/kelola_konten/crud_kelola_berita/edit_berita.tsx"),

   // CRUD routes for kelola_riset
  route("admin/kelola_konten/crud_kelola_riset/tambah_riset", "admin/kelola_konten/crud_kelola_riset/tambah_riset.tsx"),
  route("admin/kelola_konten/crud_kelola_riset/edit_riset/:id", "admin/kelola_konten/crud_kelola_riset/edit_riset.tsx"),

  // Rute untuk detail berita
  route("halaman_berita/detail_berita/:id", "routes/halaman_berita/detail_berita.tsx"),

] satisfies RouteConfig;