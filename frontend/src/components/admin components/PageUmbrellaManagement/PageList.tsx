"use client";
import { useState } from "react";
import Link from "next/link";
import RemovePageButton from "./RemovePageButton";
import AddNewPage from "./AddNewPage";

type Page = {
  id: string;
  title: string;
  slug?: string;
  updated_at?: string;
};

export default function PageList({
  pages,
  fetchPages, // <-- add this line
}: {
  pages: Page[];
  fetchPages: () => void; // <-- add this line
}) {
  const [showNewPageEditor, setShowNewPageEditor] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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
          <RemovePageButton pageId={page.id} onPageRemoved={fetchPages} />
        </li>
      ))}
      <button onClick={() => setShowNewPageEditor(v => !v)}>
        {showNewPageEditor ? "hide" : "create ny page"}
      </button>
      {showNewPageEditor && (
        <div style={{ marginBottom: 24 }}>
          <AddNewPage
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onPageAdded={fetchPages}
          />
        </div>
      )}
    </ul>
  );
}