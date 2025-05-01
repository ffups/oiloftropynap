"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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
            <PageList pages={pages}  
            fetchPages={fetchPages} />
            
        </div>
    );
}