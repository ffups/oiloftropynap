import React from "react";
import AddSectionButton from "./add,delete,edit/AddSectionButton";
import DeleteSectionButton from "./add,delete,edit/DeleteSectionButton";
import EditSectionNameButton from "./add,delete,edit/EditSectionName";
type Section = { id: string; html: string };

interface SidebarProps {
  title: string;
  sections: Section[];
  sectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  pageSlug: string;
  onSectionsChange: (newSections: Section[]) => void;
}

export default function Sidebar({ title, sections, sectionRefs, pageSlug, onSectionsChange }: SidebarProps) {
  return (
    <aside
      style={{
        width: 220,
        borderRight: "1px solid #eee",
        padding: 16,
        marginRight: 24,
        minHeight: "100vh",
      }}
    >
      <h2>{title}</h2>
      <h4 style={{ marginTop: 0 }}>Sections</h4>
      {sections.length === 0 && <div>No sections</div>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {sections.map(section => (
          <li key={section.id} style={{ marginBottom: 12, display: "flex", alignItems: "center" }}>
            <button
              style={{
                border: "1px solid #ddd",
                borderRadius: 4,
                padding: "4px 8px",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "0.95em",
              }}
              onClick={() => {
                sectionRefs.current[section.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              <strong>{section.id}</strong>
              <div style={{
                fontSize: "0.85em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {section.html.replace(/<[^>]+>/g, "").slice(0, 40) || "<empty>"}
              </div>
            </button>
            <EditSectionNameButton
  sectionId={section.id}
  sections={sections}
  pageSlug={pageSlug}
  onSectionRenamed={onSectionsChange}
/>
            <DeleteSectionButton
              sectionId={section.id}
              sections={sections}
              pageSlug={pageSlug}
              onSectionDeleted={onSectionsChange}
            />
          </li>
        ))}
      </ul>
      <AddSectionButton
        pageSlug={pageSlug}
        sections={sections}
        onSectionAdded={onSectionsChange}
      />
    </aside>
  );
}