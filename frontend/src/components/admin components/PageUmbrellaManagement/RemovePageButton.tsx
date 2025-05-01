import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { usePagesContext } from "@/context/PagesContext";

interface RemovePageButtonProps {
  pageId: string;
  onPageRemoved?: () => void;
}

export default function RemovePageButton({ pageId, onPageRemoved }: RemovePageButtonProps) {
  const { refreshPages } = usePagesContext();

  const handleRemove = async () => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;
    const { error } = await supabase.from("pages").delete().eq("id", pageId);
    if (!error) {
      refreshPages();
      if (onPageRemoved) {
        onPageRemoved();
      }
    }
  };

  return (
    <button
      style={{ marginLeft: 16, color: "red" }}
      onClick={handleRemove}
    >
      Remove
    </button>
  );
}