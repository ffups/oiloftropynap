"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Section = { id: string; html: string };

export default function AboutPage() {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    supabase
      .from("pages")
      .select("content")
      .eq("title", "about")
      .single()
      .then(({ data }) => {
        if (data?.content?.sections && Array.isArray(data.content.sections)) {
          setSections(data.content.sections);
        } else {
          setSections([]);
        }
      });
  }, []);

  return (
    <div>
      {sections.map(section => (
        <div key={section.id} dangerouslySetInnerHTML={{ __html: section.html }} />
      ))}
    </div>
  );
}