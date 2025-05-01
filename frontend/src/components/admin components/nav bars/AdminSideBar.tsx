"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { usePagesContext } from "@/context/PagesContext";

export default function AdminSidebar() {
  const [pages, setPages] = useState<{ id: string; title: string; slug: string }[]>([]);
  const [pagesOpen, setPagesOpen] = useState(false);
  const pathname = usePathname();
  const { lastRefresh } = usePagesContext();

  useEffect(() => {
    if (pagesOpen) {
      supabase
        .from("pages")
        .select("id, title, slug")
        .then(({ data }) => {
          if (data) setPages(data);
        });
    }
  }, [pagesOpen, lastRefresh]);

  return (
    <aside
      style={{
        width: 200,
        padding: 24,
        borderRight: "1px solid #ddd",
      }}
    >
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link
              href="/admin/manage-pages"
              style={{
                fontWeight: pathname === "/admin/manage-pages" ? "bold" : "normal",
                color: pathname === "/admin/manage-pages" ? "#1976d2" : undefined,
                textDecoration: "none",
                flex: 1,
              }}
            >
              Manage Pages
            </Link>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                font: "inherit",
                cursor: "pointer",
                fontSize: "1.1em",
                lineHeight: 1,
              }}
              aria-label={pagesOpen ? "Hide page list" : "Show page list"}
              onClick={() => setPagesOpen(v => !v)}
            >
              {pagesOpen ? "▲" : "▼"}
            </button>
          </li>
          {pagesOpen && (
            <ul style={{ listStyle: "none", paddingLeft: 16, marginTop: 8 }}>
              {pages.map(page => {
                const pagePath = `/admin/edit/${page.slug}`;
                const selected = pathname === pagePath;
                return (
                  <li key={page.id}>
                    <Link
                      href={pagePath}
                      style={{
                        fontWeight: selected ? "bold" : "normal",
                        color: selected ? "#1976d2" : undefined,
                        textDecoration: "none",
                      }}
                    >
                      {page.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          {/* Add more sidebar links as needed */}
        </ul>
      </nav>
    </aside>
  );
}