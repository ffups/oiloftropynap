import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
type Block =
  | { id: string; type: "text"; data: { text: string } }
  | { id: string; type: "image"; data: { url: string; alt?: string } };
// Add more block types as needed

type Section = { id: string; name: string; blocks: Block[] };


interface EditSectionNameButtonProps {
  sectionId: string;
  sections: Section[];
  pageSlug: string;
  onSectionRenamed: (newSections: Section[]) => void;
}

export default function EditSectionNameButton({
  sectionId,
  sections,
  pageSlug,
  onSectionRenamed,
}: EditSectionNameButtonProps) {
  const [editing, setEditing] = useState(false);
  const [newId, setNewId] = useState(sectionId);
  const [saving, setSaving] = useState(false);

  const handleRename = async () => {
    if (
      !newId.trim() ||
      newId === sectionId ||
      sections.some(section => section.id === newId && section.id !== sectionId)
    ) {
      alert("Section name must be unique.");
      setEditing(false);
      return;
    }
    setSaving(true);
    // Rename the section id
    const updatedSections = sections.map(section =>
      section.id === sectionId ? { ...section, id: newId } : section
    );
    const { error } = await supabase
      .from("pages")
      .update({ content: { sections: updatedSections } })
      .eq("slug", pageSlug);

    setSaving(false);
    setEditing(false);

    if (!error) {
      onSectionRenamed(updatedSections);
    } else {
      alert("Failed to rename section.");
      console.error(error);
    }
  };

  if (editing) {
    return (
      <span style={{ marginLeft: 8 }}>
        <input
          value={newId}
          onChange={e => setNewId(e.target.value)}
          disabled={saving}
          style={{ width: 80, fontSize: "0.95em" }}
        />
        <button
          onClick={handleRename}
          disabled={saving}
          style={{
            marginLeft: 4,
            color: "#fff",
            background: "#1976d2",
            border: "none",
            borderRadius: 4,
            padding: "2px 8px",
            cursor: "pointer",
            fontSize: "0.9em",
          }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => setEditing(false)}
          disabled={saving}
          style={{
            marginLeft: 4,
            color: "#333",
            background: "#eee",
            border: "none",
            borderRadius: 4,
            padding: "2px 8px",
            cursor: "pointer",
            fontSize: "0.9em",
          }}
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      style={{
        marginLeft: 8,
        color: "#fff",
        background: "#388e3c",
        border: "none",
        borderRadius: 4,
        padding: "2px 8px",
        cursor: "pointer",
        fontSize: "0.9em",
      }}
      title="Edit section name"
    >
      E
    </button>
  );
}