"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type PageContent = string | { html: string };
interface Page {
  title: string;
  slug: string;
  content?: PageContent;
}

export default function EditPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      const { data } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .single<Page>();
      setPage(data);
      setLoading(false);
    }
    fetchPage();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!page) return <div>Page not found.</div>;

  return (
    <div>
      <h2>{page.title}</h2>
      <div>
        <strong>Slug:</strong> {page.slug}
      </div>
      <div style={{ marginTop: 16 }}>
        <strong>Content:</strong>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {typeof page.content === "string"
            ? page.content
            : page.content && "html" in page.content
            ? page.content.html
            : JSON.stringify(page.content, null, 2)}
        </pre>
      </div>
    </div>
  );
}