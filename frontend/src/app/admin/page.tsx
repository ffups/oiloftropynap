"use client";
import { useState } from "react";

export default function AdminPage() {
  const [view, setView] = useState<"pages" | "add" | null>(null);

  return (
    <div>
      <h1>Admin Panel</h1>
      <nav style={{ marginBottom: 24 }}>
        <button onClick={() => setView("pages")}>Manage Pages</button>
        <button onClick={() => setView("add")}>Add New Page</button>
      </nav>
      {!view && (
        <div>
          <p>Welcome to the admin panel. Choose an action above.</p>
        </div>
      )}
      {view === "pages" && (
        <div>
          {/* Replace with your actual PageList component */}
          <p>Page management component goes here.</p>
        </div>
      )}
      {view === "add" && (
        <div>
          {/* Replace with your actual NewPageEditor component */}
          <p>New page editor component goes here.</p>
        </div>
      )}
    </div>
  );
}