"use client";
import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "@/components/admin components/nav bars/AdminSideBar";
import AdminNavbar from "@/components/admin components/nav bars/AdminNavBar";
import { supabase } from "@/lib/supabaseClient";


export default function AdminLayout({ }: { children: React.ReactNode }) {
  const [pages, setPages] = useState<{ id: string; title: string; slug: string }[]>([]);

  const fetchPages = useCallback(async () => {
    const { data } = await supabase.from("pages").select("id, title, slug");
    setPages(data || []);
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <AdminNavbar />
      <div style={{ display: "flex", minHeight: "calc(100vh - 56px)" }}>
        <AdminSidebar pages={pages} fetchPages={fetchPages} />
      </div>
    </div>
  );
}