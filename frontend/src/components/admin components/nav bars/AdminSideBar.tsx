"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import RemovePageButton from "../PageEditor/RemovePageButton";
import AddNewPage from "../PageEditor/AddNewPage";
import { usePagesContext } from "@/context/PagesContext";

type Page = { id: string; title: string; slug: string };

interface AdminSidebarProps {
  pages: Page[];
  fetchPages: () => void;
}

export default function AdminSidebar({ pages, fetchPages }: AdminSidebarProps) {
  const [pagesOpen, setPagesOpen] = useState(false);
  const pathname = usePathname();
  const [showNewPageEditor, setShowNewPageEditor] = useState(false);
  const { lastRefresh } = usePagesContext();

  useEffect(() => {
    fetchPages();
  }, [lastRefresh, fetchPages]);

  return (
    <aside style={{ width: 200, padding: 24, borderRight: "1px solid #ddd" }}>
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
                    <RemovePageButton pageId={page.id} onPageRemoved={fetchPages} />
                  </li>
                );
              })}
              <button onClick={() => setShowNewPageEditor(v => !v)}>
                {showNewPageEditor ? "hide" : "create ny page"}
              </button>
              {showNewPageEditor && (
                <div style={{ marginBottom: 24 }}>
                  <AddNewPage onPageAdded={fetchPages} />
                </div>
              )}
            </ul>
          )}
        </ul>
      </nav>
    </aside>
  );
}