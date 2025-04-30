import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import LivePreview from "@/components/utilities/LivePreview";
import RichTextEditor from "@/components/utilities/RichTextEditor";

export default function AddNewPage({
  title,
  slug,
  content,
  onTitleChange,
  onSlugChange,
  onContentChange,
  onPageAdded,
}: {
  title: string;
  slug: string;
  content: string;
  onTitleChange: (v: string) => void;
  onSlugChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onPageAdded?: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const addPage = async () => {
    if (!title || !slug || !content) {
      alert("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    setSuccess(null);
    const { error } = await supabase.from("pages").insert([
      {
        title,
        slug,
        content: {
          sections: [
            {
              id: "section1",
              html: content,
            },
          ],
        },
      },
    ]);
    setSubmitting(false);
    if (error) {
      alert("Error adding page: " + error.message);
      return;
    }
    // Clear fields
    onTitleChange("");
    onSlugChange("");
    onContentChange("");
    setSuccess("Page added successfully!");
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
      <input
        value={slug}
        onChange={e => onSlugChange(e.target.value)}
        placeholder="Slug (e.g. about, contact)"
        style={{ marginLeft: 8 }}
        disabled={submitting}
      />
      <RichTextEditor value={content} onChange={onContentChange} />
      <button onClick={addPage} disabled={submitting}>
        {submitting ? "Adding..." : "Add Page"}
      </button>
      {success && <div style={{ color: "green", marginTop: 8 }}>{success}</div>}
      <LivePreview html={content} />
    </div>
  );
}