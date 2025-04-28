"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PageEditor from "@/components/PageEditor";
import NewPageEditor from "@/components/NewPageEditor";
import LivePreview from "@/components/LivePreview";

type Page = {
    id: string;
    title: string;
    content: { html: string }; // content is an object with an html property
};

export default function AdminPage() {
    const [pages, setPages] = useState<Page[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState<string>("");
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    useEffect(() => {
        supabase.from("pages").select("*").then(({ data }) => {
            setPages(data || []);
        });
    }, []);

    const startEdit = (page: Page) => {
        setEditingId(page.id);
        setEditingContent(page.content?.html || "");
    };

    const saveEdit = async (id: string) => {
        await supabase.from("pages").update({ content: { html: editingContent } }).eq("id", id);
        setPages(pages =>
            pages.map(p => (p.id === id ? { ...p, content: { html: editingContent } } : p))
        );
        setEditingId(null);
    };

    const addPage = async () => {
        if (!newTitle) return;
        await supabase.from("pages").insert([
            { title: newTitle, content: { html: newContent } }
        ]);
        const { data } = await supabase.from("pages").select("*");
        setPages(data || []);
        setNewTitle("");
        setNewContent("");
    };

    return (
        <div>
            <h1>Admin Page Editor</h1>
            <ul>
                {pages.map(page => (
                    <li key={page.id}>
                        <h2>{page.title}</h2>
                        {editingId === page.id ? (
                            <PageEditor
                                value={editingContent}
                                onChange={setEditingContent}
                                onSave={() => saveEdit(page.id)}
                                onCancel={() => setEditingId(null)}
                            />
                        ) : (
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: page.content?.html || "" }} />
                                <button onClick={() => startEdit(page)}>Edit</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <NewPageEditor
              title={newTitle}
              content={newContent}
              onTitleChange={setNewTitle}
              onContentChange={setNewContent}
              onAdd={addPage}
            />
            <LivePreview html={editingContent} />
        </div>
    );
}