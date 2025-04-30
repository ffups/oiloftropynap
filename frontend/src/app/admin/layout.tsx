"use client";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Navbar */}
      <nav
        style={{
          width: "100%",
          borderBottom: "1px solid #ddd",
          padding: "16px 32px",
        }}
      >
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", gap: 24 }}>
        <li>
            <Link href="/admin" style={{ textDecoration: "none" }}>
              heimat
            </Link>
          </li> 
          <li>
            <Link href="/admin/profile" style={{ textDecoration: "none" }}>
              profile
            </Link>
          </li>
          {/* Add more navbar links as needed */}
        </ul>
      </nav>
      {/* Sidebar + Main Content */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
        <aside
          style={{
            width: 200,
            padding: 24,
            borderRight: "1px solid #ddd",
          }}
        >
          <nav>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <Link href="/admin/manage-pages" style={{ width: "100%", display: "block", textAlign: "left" }}>
                  Manage Pages
                </Link>
              </li>
              {/* Add more sidebar links as needed */}
            </ul>
          </nav>
        </aside>
        <main style={{ flex: 1, padding: 32 }}>{children}</main>
      </div>
    </div>
  );
}