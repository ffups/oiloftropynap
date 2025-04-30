"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AddNewPage from "./AddNewPage";
import PageList from "./PageList";

type Page = {
    id: string;
    title: string;
    slug?: string;
    updated_at?: string;
};

export default function PageUmbrellaManagement() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewPageEditor, setShowNewPageEditor] = useState(false);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
  
    const fetchPages = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("pages")
            .select("id, title, slug, updated_at");
        setPages(data || []);
        setLoading(false);
    };
    useEffect(() => {
        fetchPages();
    }, []);

    if (loading) return <div>Loading pages...</div>;

    return (
        <div>
            <h3>All Pages</h3>
            <PageList pages={pages} onPageRemoved={fetchPages} />
            <button
                onClick={() => setShowNewPageEditor(v => !v)}
            >
                {showNewPageEditor ? "hide" : "create ny page"}
            </button>
            {showNewPageEditor && (
                <div style={{ marginBottom: 24 }}>
                    <AddNewPage
                        title={title}
                        slug={slug}
                        content={content}
                        onTitleChange={setTitle}
                        onSlugChange={setSlug}
                        onContentChange={setContent}
                        onPageAdded={fetchPages}
                    />
                </div>
            )}
        </div>
    );
}