"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type"); // 'recovery' or 'signup'

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data?.user?.email ?? null);
    });
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    // Update password only
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Password updated! You can now log in.");
    setTimeout(() => {
      if (type === "signup") {
        router.push("/welcome");
      } else {
        router.push(`/admin/login?email=${encodeURIComponent(email ?? "")}`);
      }
    }, 2000);
  };

  return (
    <form onSubmit={handleReset}>
      <h2>{type === "signup" ? "Set Your Password" : "Reset Password"}</h2>
      {email && (
        <div style={{ marginBottom: 12 }}>
          <strong>Email:</strong> {email}
        </div>
      )}
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Set Password</button>
      {message && <div style={{ marginTop: 8 }}>{message}</div>}
    </form>
  );
}