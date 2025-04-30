import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Page = {
  id: string;
  title: string;
  slug?: string;
  updated_at?: string;
};

export default function PageList({
  pages,
  onPageRemoved,
}: {
  pages: Page[];
  onPageRemoved?: () => void;
}) {
  const handleRemove = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (!error && onPageRemoved) {
      onPageRemoved();
    }
  };

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
          <button
            style={{ marginLeft: 16, color: "red" }}
            onClick={() => handleRemove(page.id)}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}