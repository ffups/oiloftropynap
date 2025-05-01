"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/admin components/PageUmbrellaManagement/SidebarEditor/SidebarEditor";
import SectionsList from "@/components/admin components/PageUmbrellaManagement/SidebarEditor/SectionsList";

type Block =
  | { id: string; type: "text"; data: { text: string } }
  | { id: string; type: "image"; data: { url: string; alt?: string } };
// Add more block types as needed

type Section = { id: string; name: string; blocks: Block[] };


type PageContent = string | { html: string } | { sections: Section[] };
interface Page {
  title: string;
  slug: string;
  content?: PageContent;
}

export default function EditPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    async function fetchPage() {
      const { data } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .single<Page>();
      setPage(data);
      setLoading(false);

      if (
        data?.content &&
        typeof data.content === "object" &&
        "sections" in data.content &&
        Array.isArray((data.content as { sections?: unknown }).sections)
      ) {
        setSections((data.content as { sections: Section[] }).sections);
      } else {
        setSections([]);
      }
    }
    fetchPage();
  }, [slug]);

  const handleSectionsChange = (newSections: Section[]) => {
    setSections(newSections);
    setPage(prev =>
      prev
        ? {
            ...prev,
            content: { ...(typeof prev.content === "object" ? prev.content : {}), sections: newSections },
          }
        : prev
    );
  };

  if (loading) return <div>Loading...</div>;
  if (!page) return <div>Page not found.</div>;

  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <Sidebar
        title={page.title}
        sections={sections}
        sectionRefs={sectionRefs}
        pageSlug={page.slug}
        onSectionsChange={handleSectionsChange}
      />
      <main style={{ flex: 1, padding: 24 }}>
        <SectionsList sections={sections} sectionRefs={sectionRefs} />
      </main>
    </div>
  );
}