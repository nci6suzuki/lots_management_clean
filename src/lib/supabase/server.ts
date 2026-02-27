import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL が未設定です");
}

if (!anonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY が未設定です");
}

if (!serviceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY が未設定です");
}

// 通常の認証・参照用
export const supabaseServer = createClient(url, anonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// 管理者権限が必要な処理専用
export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});