"use client";
import AdminSidebar from "@/components/admin components/nav bars/AdminSideBar";
import AdminNavbar from "@/components/admin components/nav bars/AdminNavBar";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <AdminNavbar />
      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
        <AdminSidebar />
        <main style={{ flex: 1, padding: 32 }}>{children}</main>
      </div>
    </div>
  );
}