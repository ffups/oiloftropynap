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
          <li>
            <button
              type="button"
              style={{
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: 0,
                font: "inherit",
                cursor: "pointer",
              }}
              onClick={() => setPagesOpen(v => !v)}
            >
              Manage Pages {pagesOpen ? "▲" : "▼"}
            </button>
            {pagesOpen && (
              <ul style={{ listStyle: "none", paddingLeft: 16, marginTop: 8 }}>
                <li>
                  <Link
                    href="/admin/manage-pages"
                    style={{
                      fontWeight: pathname === "/admin/manage-pages" ? "bold" : "normal",
                      color: pathname === "/admin/manage-pages" ? "#1976d2" : undefined,
                    }}
                  >
                    All Pages
                  </Link>
                </li>
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
                        }}
                      >
                        {page.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
          {/* Add more sidebar links as needed */}
        </ul>
      </nav>
    </aside>
  );
}