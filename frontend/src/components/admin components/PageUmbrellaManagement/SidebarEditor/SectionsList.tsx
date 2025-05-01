import React from "react";

type Section = { id: string; html: string };

interface SectionsListProps {
  sections: Section[];
  sectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export default function SectionsList({ sections, sectionRefs }: SectionsListProps) {
  return (
    <div style={{ marginTop: 16 }}>
      <div>
        {sections.length > 0 ? (
          sections.map(section => (
            <div
              key={section.id}
              ref={el => {
                sectionRefs.current[section.id] = el;
              }}
              style={{ marginBottom: 32, padding: 8, border: "1px solid #eee", borderRadius: 4 }}
            >
              <div dangerouslySetInnerHTML={{ __html: section.html }} />
            </div>
          ))
        ) : (
          <em>No content</em>
        )}
      </div>
    </div>
  );
}