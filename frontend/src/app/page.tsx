"use client";
import { useEffect, useState } from 'react';

type Post = {
  _id: string;
  title: string;
  contentHtml: string;
};

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/posts')
      .then(res => res.json())
      .then(data => {
        console.log('API response:', data);
        // Map API docs to expected Post shape
        const mappedPosts = Array.isArray(data.docs)
          ? data.docs.map((doc: any) => ({
              _id: doc.id?.toString() ?? '', // Use id as _id
              title: doc.title ?? '',
              contentHtml: doc.content?.html ?? '', // Adjust if your content object uses a different key
            }))
          : [];
        setPosts(mappedPosts);
      })
      .catch(() => setPosts([]));
  }, []);

  const handleContentChange = (index: number, html: string) => {
    setPosts(prev =>
      prev.map((post, i) =>
        i === index ? { ...post, contentHtml: html } : post
      )
    );
  };

  const handleSave = async (post: Post) => {
    setSaving(post._id);
    await fetch(`http://localhost:3001/api/posts/${post._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: { html: post.contentHtml } }), // <-- correct structure
    });
    setSaving(null);
  };

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts
          .filter(post => post._id) // Only render posts with a valid _id
          .map((post, idx) => (
            <li key={post._id}>
              <h2>{post.title}</h2>
              <div
                contentEditable
                suppressContentEditableWarning
                style={{
                  border: '1px solid #ccc',
                  padding: '8px',
                  minHeight: '40px',
                  marginBottom: '12px',
                }}
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                onInput={e =>
                  handleContentChange(
                    idx,
                    (e.target as HTMLDivElement).innerHTML
                  )
                }
              />
              <button
                onClick={() => handleSave(post)}
                disabled={saving === post._id}
              >
                {saving === post._id ? 'Saving...' : 'Save'}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}