"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditPage() {
  const { slug } = useParams<{ slug: string }>();
  interface Page {
    title: string;
    slug: string;
    [key: string]: string | number | boolean | null; // Add other fields as needed
  }

  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      const { data } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .single();
      setPage(data);
      setLoading(false);
    }
    fetchPage();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!page) return <div>Page not found.</div>;

  return (
    <div>
      <h2>edit {page.title}</h2>
      {/* Add your edit form here */}
      <pre>{JSON.stringify(page, null, 2)}</pre>
    </div>
  );
}