import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { usePagesContext } from "@/context/PagesContext";

function slugify(text: string) {
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AddNewPage({
  title,
  content,
  onTitleChange,
  onContentChange,
  onPageAdded,
}: {
  title: string;
  content: string;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onPageAdded?: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const { refreshPages } = usePagesContext();

  const addPage = async () => {
    if (!title) {
      alert("Please fill in the title.");
      return;
    }
    setSubmitting(true);
    setSuccess(null);

    // Always create one section, even if content is empty
    const sections = [{ id: "section1", html: content ?? "" }];
    const slug = slugify(title); // Use slugify here

    const { error } = await supabase.from("pages").insert([
      {
        title,
        slug,
        content: { sections },
      },
    ]);
    setSubmitting(false);
    if (error) {
      alert("Error adding page: " + error.message);
      return;
    }
    // Clear fields
    onTitleChange("");
    onContentChange("");
    setSuccess("Page added successfully!");
    refreshPages();
    if (onPageAdded) onPageAdded();
  };

  return (
    <div>
      <h2>Add New Page</h2>
      <input
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        placeholder="Title"
        disabled={submitting}
      />
      <button onClick={addPage} disabled={submitting}>
        {submitting ? "Adding..." : "Add Page"}
      </button>
      {success && <div style={{ color: "green", marginTop: 8 }}>{success}</div>}
    </div>
  );
}