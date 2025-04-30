"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/admin/login");
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <p>Welcome to the admin panel. Choose an action from the sidebar.</p>
    </div>
  );
}