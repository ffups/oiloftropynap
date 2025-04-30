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
  const [jsonEdit, setJsonEdit] = useState("");

  // Sync jsonEdit with page state
  useEffect(() => {
    setJsonEdit(JSON.stringify(page, null, 2));
  }, [page]);

  // Handler for when the user edits the JSON and blurs the textarea
  const handleJsonBlur = () => {
    try {
      const parsed = JSON.parse(jsonEdit);
      setPage(parsed);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(parsed));
    } catch  {
      alert("Invalid JSON!");
    }
  };
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

  const handleSaveToDatabase = async () => {
    let parsed: Page | null = null;
    try {
      parsed = JSON.parse(jsonEdit);
    } catch (e) {
      if (e instanceof SyntaxError) {
        alert(`Invalid JSON!\n${e.message}\n\nPlease check your JSON for errors.`);
        console.log("Failed to parse JSON for database save:", e);
      } else {
        alert("Unknown error while parsing JSON.");
        console.log("Unknown error while parsing JSON:", e);
      }
      return;
    }
    if (!parsed) {
      alert("Parsed JSON is null. Please check your input.");
      console.log("Parsed JSON is null.");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("pages")
      .update({ content: parsed.content })
      .eq("slug", slug);
    setSaving(false);
    if (error) {
      console.log("Failed to save to database:", error);
    } else {
      setPage(parsed);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(parsed));
      console.log("Saved to database successfully.");
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
          onClick={handleSaveToDatabase}
          disabled={saving || loading}
          style={{ marginTop: 16 }}
        >
          {saving ? "Saving..." : "Save to Database"}
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
        value={jsonEdit}
        onChange={e => {
          setJsonEdit(e.target.value);
          // Try to update localStorage with valid JSON as the user types
          try {
            const parsed = JSON.parse(e.target.value);
            setPage(parsed);
            localStorage.setItem(LOCAL_KEY, JSON.stringify(parsed));
          } catch {
            // Ignore invalid JSON while typing
          }
        }}
        onBlur={handleJsonBlur}
      />
    </div>
  );
}