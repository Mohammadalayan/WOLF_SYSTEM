import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}
console.log("URL:", supabaseUrl);
console.log("API Key exists:", !!supabaseKey);
export const supabase = createClient(supabaseUrl, supabaseKey);