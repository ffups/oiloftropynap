"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [content, setContent] = useState<string>("Loading...");

  useEffect(() => {
    supabase
      .from("pages")
      .select("content")
      .eq("title", "home")
      .single()
      .then(({ data }) => {
        // If content is an object, extract the html property
        if (data?.content && typeof data.content === "object") {
          setContent(data.content.html || "No content found.");
        } else {
          setContent(data?.content || "No content found.");
        }
      });
  }, []);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
