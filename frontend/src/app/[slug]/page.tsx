"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Section = { id: string; html: string };

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
      .single()
      .then(({ data }) => {
        if (data?.content?.sections && Array.isArray(data.content.sections)) {
          setSections(data.content.sections);
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
        <div key={section.id} dangerouslySetInnerHTML={{ __html: section.html }} />
      ))}
    </div>
  );
}