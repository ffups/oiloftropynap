"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminProfile() {
  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data?.user;
      setEmail(user?.email ?? null);
      setUserId(user?.id ?? null);

      if (user?.id) {
        // Fetch the profile row for this user
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("email, display_name")
          .eq("id", user.id)
          .single();
        if (profile) {
          setDisplayName(profile.display_name ?? "");
        }
        if (error) {
          console.log("Profile fetch error:", error);
        }
      }
    });
  }, []);

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    // Update display name in profiles table
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", userId);
    setMessage(error ? error.message : "Display name updated!");
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setMessage(error ? error.message : "Password updated!");
    setNewPassword("");
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>User Profile</h2>
      {email && (
        <div style={{ marginBottom: 16 }}>
          <strong>Email:</strong> {email}
        </div>
      )}
      <form onSubmit={handleNameUpdate} style={{ marginBottom: 24 }}>
        <label>
          Display Name:
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            style={{ marginLeft: 8 }}
            required
          />
        </label>
        <button type="submit" style={{ marginLeft: 8 }}>Update Name</button>
      </form>
      <form onSubmit={handlePasswordUpdate}>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            style={{ marginLeft: 8 }}
            required
          />
        </label>
        <button type="submit" style={{ marginLeft: 8 }}>Update Password</button>
      </form>
      {message && <div style={{ marginTop: 16 }}>{message}</div>}
    </div>
  );
}