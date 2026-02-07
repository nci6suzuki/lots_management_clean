import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dev-anon-key";

export const supabaseClient = createClient(url, key);
