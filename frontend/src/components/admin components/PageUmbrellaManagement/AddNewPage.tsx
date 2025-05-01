import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { usePagesContext } from "@/context/PagesContext";

// Block and Section types
type Block = { id: string; type: string; data: Record<string, unknown> };
type Section = { id: string; name: string; blocks: Block[] };

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
  onPageAdded,
}: {
  onPageAdded?: () => void;
}) {
  const [title, setTitle] = useState("");
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

    // Default section and block values
    const sections: Section[] = [
      {
        id: "section1",
        name: "Main Section",
        blocks: [
          { id: "block1", type: "text", data: { text: "Welcome to your new page!" } }
        ]
      }
    ];
    const slug = slugify(title);

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
    setTitle("");
    setSuccess("Page added successfully!");
    refreshPages();
    if (onPageAdded) onPageAdded();
  };

  return (
    <div>
      <h2>Add New Page</h2>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
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