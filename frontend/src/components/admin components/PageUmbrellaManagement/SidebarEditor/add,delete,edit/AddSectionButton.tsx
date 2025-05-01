import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Section = { id: string; html: string };

interface AddSectionButtonProps {
  pageSlug: string;
  sections: Section[];
  onSectionAdded: (newSections: Section[]) => void;
}

export default function AddSectionButton({ pageSlug, sections, onSectionAdded }: AddSectionButtonProps) {
  const [adding, setAdding] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [sectionName, setSectionName] = useState("");

  const handleShowInput = () => {
    setInputVisible(true);
    setSectionName("");
  };

  const handleAddSection = async () => {
    if (!sectionName.trim()) {
      alert("Section name cannot be empty.");
      return;
    }
    if (sections.some(section => section.id === sectionName.trim())) {
      alert("Section name must be unique.");
      return;
    }
    setAdding(true);
    const newSection: Section = { id: sectionName.trim(), html: "" };
    const updatedSections = [...sections, newSection];

    const { error } = await supabase
      .from("pages")
      .update({ content: { sections: updatedSections } })
      .eq("slug", pageSlug);

    setAdding(false);

    if (!error) {
      onSectionAdded(updatedSections);
      setInputVisible(false);
      setSectionName("");
    } else {
      alert("Failed to add section.");
      console.error(error);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      {!inputVisible ? (
        <button
          style={{
            width: "100%",
            padding: "8px 0",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontSize: "1em",
            cursor: "pointer",
          }}
          onClick={handleShowInput}
          disabled={adding}
        >
          Add New Section
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            type="text"
            placeholder="Section name"
            value={sectionName}
            onChange={e => setSectionName(e.target.value)}
            disabled={adding}
            style={{
              padding: "6px 8px",
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: "1em",
            }}
            autoFocus
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleAddSection}
              disabled={adding}
              style={{
                flex: 1,
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "8px 0",
                fontSize: "1em",
                cursor: "pointer",
              }}
            >
              {adding ? "Adding..." : "Confirm"}
            </button>
            <button
              onClick={() => {
                setInputVisible(false);
                setSectionName("");
              }}
              disabled={adding}
              style={{
                flex: 1,
                background: "#eee",
                color: "#333",
                border: "none",
                borderRadius: 4,
                padding: "8px 0",
                fontSize: "1em",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}