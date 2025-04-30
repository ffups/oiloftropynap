"use client";
import Link from "next/link";

export default function AdminNavbar() {
  return (
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
      </ul>
    </nav>
  );
}