import React from "react";

type Page = {
  id: string;
  title: string;
  slug?: string;
  updated_at?: string;
};

export default function PageList({ pages }: { pages: Page[] }) {
  return (
    <ul>
      {pages.map(page => (
        <li key={page.id}>
          <strong>{page.title}</strong>
          {page.slug && <> (<code>{page.slug}</code>)</>}
          {page.updated_at && (
            <span style={{ color: "#888", marginLeft: 8 }}>
              Updated: {new Date(page.updated_at).toLocaleDateString()}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}