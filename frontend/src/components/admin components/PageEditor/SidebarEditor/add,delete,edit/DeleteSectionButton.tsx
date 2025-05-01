import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Block =
  | { id: string; type: "text"; data: { text: string } }
  | { id: string; type: "image"; data: { url: string; alt?: string } };
// Add more block types as needed

type Section = { id: string; name: string; blocks: Block[] };


interface DeleteSectionButtonProps {
  sectionId: string;
  sections: Section[];
  pageSlug: string;
  onSectionDeleted: (newSections: Section[]) => void;
}

export default function DeleteSectionButton({
  sectionId,
  sections,
  pageSlug,
  onSectionDeleted,
}: DeleteSectionButtonProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;
    setDeleting(true);
    const updatedSections = sections.filter(section => section.id !== sectionId);

    // Update the database
    const { error } = await supabase
      .from("pages")
      .update({ content: { sections: updatedSections } })
      .eq("slug", pageSlug);

    setDeleting(false);

    if (!error) {
      onSectionDeleted(updatedSections);
    } else {
      alert("Failed to delete section.");
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      style={{
        marginLeft: 8,
        color: "#fff",
        background: "#d32f2f",
        border: "none",
        borderRadius: 4,
        padding: "2px 8px",
        cursor: "pointer",
        fontSize: "0.9em",
      }}
      title="Delete section"
    >
      {deleting ? "Deleting..." : "D"}
    </button>
  );
}