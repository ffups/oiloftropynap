"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type PageContent = string | { html: string };
interface Page {
  title: string;
  slug: string;
  content?: PageContent;
}

function isHtmlContent(content: PageContent): content is { html: string } {
  return typeof content === "object" && content !== null && "html" in content;
}

export default function EditPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const LOCAL_KEY = `page-edit-draft-${slug}`;
  const [htmlEdit, setHtmlEdit] = useState(
    page?.content && isHtmlContent(page.content)
      ? page.content.html
      : typeof page?.content === "string"
        ? page.content
        : ""
  );

  useEffect(() => {
    setHtmlEdit(
      page?.content && isHtmlContent(page.content)
        ? page.content.html
        : typeof page?.content === "string"
          ? page.content
          : ""
    );
  }, [page]);

  useEffect(() => {
    const draft = localStorage.getItem(LOCAL_KEY);
    if (draft) {
      setPage(JSON.parse(draft));
      setLoading(false);
      return;
    }
    async function fetchPage() {
      const { data } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .single<Page>();
      setPage(data);
      setLoading(false);
    }
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Save handler for plain text (to localStorage)
  const handleTextSave = (newContent: string) => {
    if (!page) return;
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...page, content: newContent }));
      setPage({ ...page, content: newContent });
      console.log("Saved to localStorage successfully.");
    } catch (e) {
      console.log("Failed to save to localStorage:", e);
    }
  };


  // Debounced save for HTML content (to localStorage)
  const handleHtmlInput = () => {
    if (!editableRef.current) return;
    const html = editableRef.current.innerHTML;
    setPage(prev => prev ? { ...prev, content: { html } } : prev);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (html.trim().length === 0) {
        return;
      }
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...page, content: { html } }));
        console.log("Saved HTML to localStorage successfully.");
      } catch (e) {
        console.log("Failed to save HTML to localStorage:", e);
      }
    }, 500);
  };


  useEffect(() => {
    // Set the editable div's content when page loads/updates
    if (page?.content && isHtmlContent(page.content) && editableRef.current) {
      editableRef.current.innerHTML = page.content.html;
    }
  }, [page?.content]);

  // Save the current live content (plain text or HTML) to the database
  const handleContentSaveToDatabase = async () => {
    if (!page) return;
    setSaving(true);
    const { error } = await supabase
      .from("pages")
      .update({ content: page.content })
      .eq("slug", slug);
    setSaving(false);
    if (error) {
      console.log("Failed to save content to database:", error);
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(page));
      console.log("Live content saved to database successfully.");
    }
  };


  if (loading) return <div>Loading...</div>;
  if (!page) return <div>Page not found.</div>;

  return (
    <div>
      <h2>Edit {page.title}</h2>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 4,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <button
          onClick={handleContentSaveToDatabase}
          disabled={saving || loading}
          style={{ marginTop: 16, marginRight: 8 }}
        >
          {saving ? "Saving..." : "Save Live Content to Database"}
        </button>
        <div style={{ whiteSpace: "pre-wrap" }}>
          {typeof page.content === "string" ? (
            <textarea
              style={{ width: "100%", minHeight: 120 }}
              value={page.content}
              onChange={e => handleTextSave(e.target.value)}
              disabled={saving}
            />
          ) : page.content && isHtmlContent(page.content) ? (
            <div
              ref={editableRef}
              contentEditable
              suppressContentEditableWarning
              style={{
                minHeight: 120,
                border: "1px solid #eee",
                padding: 8,
                outline: "none",
              }}
              onInput={handleHtmlInput}
            />
          ) : (
            <em>No content</em>
          )}
        </div>
        {saving && <div style={{ color: "#888" }}>Saving...</div>}
      </div>
      <textarea
        style={{ width: "100%", minHeight: 120, fontFamily: "monospace", marginTop: 16 }}
        value={htmlEdit}
        onChange={e => {
          setHtmlEdit(e.target.value);
          // Update localStorage and page state as the user types
          const newContent = { html: e.target.value };
          setPage(prev => prev ? { ...prev, content: newContent } : prev);
          localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...page, content: newContent }));
        }}
        onBlur={() => {
          // Optionally, validate HTML here
        }}
      />
      <button
        onClick={async () => {
          setSaving(true);
          const { error } = await supabase
            .from("pages")
            .update({ content: { html: htmlEdit } })
            .eq("slug", slug);
          setSaving(false);
          if (error) {
            alert("Failed to save HTML to database.");
            console.log("Failed to save HTML to database:", error);
          } else {
            setPage(prev => prev ? { ...prev, content: { html: htmlEdit } } : prev);
            localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...page, content: { html: htmlEdit } }));
            console.log("HTML content saved to database successfully.");
          }
        }}
        disabled={saving || loading}
        style={{ marginTop: 8 }}
      >
        {saving ? "Saving..." : "Save HTML to Database"}
      </button>
    </div>
  );
}