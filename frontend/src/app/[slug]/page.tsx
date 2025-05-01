"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { blockRegistry } from "@/components/utilities/blocks/blockRegistry";

type Block =
| { id: string; type: "text"; data: { text: string } }
  | { id: string; type: "image"; data: { url: string; alt?: string } };
// Add more block types as needed

type Section = { id: string; name: string; blocks: Block[] };

function renderBlock(block: Block) {
  const renderer = blockRegistry[block.type];
  if (renderer) return renderer(block);
  return <div key={block.id}>Unknown block type: {block.type}</div>;
}

export default function DynamicPage() {
  const { slug } = useParams();
  const [sections, setSections] = useState<Section[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("pages")
      .select("content")
      .eq("slug", slug)
      .single<{ content: { sections: Section[] } }>() // <-- Add this generic
      .then(({ data }) => {
        if (data?.content?.sections && Array.isArray(data.content.sections)) {
          setSections(data.content.sections as Section[]); // <-- Add this assertion
        } else {
          setNotFound(true);
        }
      });
  }, [slug]);

  if (notFound) {
    return <div>Page not found.</div>;
  }

  return (
    <div>
      {sections.map(section => (
        <div key={section.id}>
          {section.blocks.map(renderBlock)}
        </div>
      ))}
    </div>
  );
}