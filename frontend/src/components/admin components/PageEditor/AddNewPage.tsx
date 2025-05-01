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
      alert("title bitchhhh.");
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
      if (
        error.code === "23505" || // Postgres unique_violation
        (error.message && error.message.toLowerCase().includes("duplicate"))
      ) {
        alert("you cant be having two of the same names now can ya.");
      } else {
        alert("something broke:" + error.message);
      }
      return;
    }
    setSuccess("It was not a complete failure!");
    setTitle("");
    if (onPageAdded) onPageAdded();
    refreshPages();
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
        {submitting ? "Adding..." : "Add "}
      </button>
      {success && <div style={{ color: "green", marginTop: 8 }}>{success}</div>}
    </div>
  );
}