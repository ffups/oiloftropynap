import React from "react";
import type { Block, Section } from "@/types/blocks";
import { blockRegistry } from "@/components/utilities/blocks/blockRegistry";

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
              <h3>{section.name}</h3>
              {section.blocks.map((block: Block) => {
                const renderer = blockRegistry[block.type];
                if (renderer) return renderer(block);
                return <div key={block.id}>Unknown block type: {block.type}</div>;
              })}
            </div>
          ))
        ) : (
          <em>No content</em>
        )}
      </div>
    </div>
  );
}