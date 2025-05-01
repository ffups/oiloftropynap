"use client";
import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin components/nav bars/AdminSideBar";
import AdminNavbar from "@/components/admin components/nav bars/AdminNavBar";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [pages, setPages] = useState<{ id: string; title: string; slug: string }[]>([]);

  const fetchPages = async () => {
    const { data } = await supabase.from("pages").select("id, title, slug");
    setPages(data || []);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <AdminNavbar />
      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
        <AdminSidebar pages={pages} fetchPages={fetchPages} />
        <main style={{ flex: 1, padding: 32 }}>{children}</main>
      </div>
    </div>
  );
}