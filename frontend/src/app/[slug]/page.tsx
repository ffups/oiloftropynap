"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Block =
  | { id: string; type: "text"; data: { text: string } }
  | { id: string; type: "image"; data: { url: string; alt?: string } };
// Add more block types as needed

type Section = { id: string; name: string; blocks: Block[] };

function renderBlock(block: Block) {
  switch (block.type) {
    case "text":
      return <p key={block.id}>{block.data.text}</p>;
    case "image":
      return (
        <img
          key={block.id}
          src={block.data.url}
          alt={block.data.alt || ""}
          style={{ maxWidth: "100%" }}
        />
      );
    default:
      return <div key={block.id}>Unknown block type: {block.type}</div>;
  }
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