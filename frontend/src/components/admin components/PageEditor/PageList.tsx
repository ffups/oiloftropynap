"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import RemovePageButton from "./RemovePageButton";
import AddNewPage from "./AddNewPage";
import { supabase } from "@/lib/supabaseClient";
import { usePagesContext } from "@/context/PagesContext";

type Page = {
  id: string;
  title: string;
  slug?: string;
  updated_at?: string;
};

export default function PageList() {
  const [pages, setPages] = useState<Page[]>([]);
  const { lastRefresh } = usePagesContext();
  const [showNewPageEditor, setShowNewPageEditor] = useState(false);

  useEffect(() => {
    supabase.from("pages").select("id, title, slug").then(({ data }) => setPages(data || []));
  }, [lastRefresh]);

  return (
    <ul>
      {pages.map(page => (
        <li key={page.id}>
          <strong>{page.title}</strong>
          {page.slug && (
            <>
              {" "}
              (<code>{page.slug}</code>)
              {" | "}
              <Link href={`/admin/edit/${page.slug}`}>Edit</Link>
            </>
          )}
          {page.updated_at && (
            <span style={{ color: "#888", marginLeft: 8 }}>
              Updated: {new Date(page.updated_at).toLocaleDateString()}
            </span>
          )}
          <RemovePageButton pageId={page.id} onPageRemoved={() => setPages(pages.filter(p => p.id !== page.id))} />
        </li>
      ))}
      <button onClick={() => setShowNewPageEditor(v => !v)}>
        {showNewPageEditor ? "hide" : "create ny page"}
      </button>
      {showNewPageEditor && (
        <div style={{ marginBottom: 24 }}>
          <AddNewPage onPageAdded={() => setPages([...pages])} />
        </div>
      )}
    </ul>
  );
}