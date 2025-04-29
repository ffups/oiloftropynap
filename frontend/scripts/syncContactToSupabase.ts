// syncContactToSupabase.ts
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function sync() {
  // Read your local file
  const html = await fs.readFile(path.join(__dirname, "content/contact.html"), "utf-8");
  // Or, if using JSON:
  // const { html } = JSON.parse(await fs.readFile(path.join(__dirname, "content/contact.json"), "utf-8"));

  // Update the contact page by slug
  await supabase
    .from("pages")
    .update({ content: { html } })
    .eq("slug", "contact");

  console.log("Contact page synced!");
}

sync();