"use client";
import PageList from "./PageList";

type Page = {
  id: string;
  title: string;
  slug?: string;
  updated_at?: string;
};

interface PageUmbrellaManagementProps {
  pages: Page[];
  fetchPages: () => Promise<void>;
}

export default function PageUmbrellaManagement({ pages, fetchPages }: PageUmbrellaManagementProps) {
  return (
    <div>
      <h3>All Pages</h3>
      <PageList pages={pages} fetchPages={fetchPages} />
    </div>
  );
}