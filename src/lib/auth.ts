import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export type AppRole = "admin" | "user";

export type CurrentUser = {
  id: string;
  email: string;
  role: AppRole;
};

const ACCESS_TOKEN_COOKIE = "lm_access_token";

export async function getAccessToken() {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    const {
      data: { user },
      error,
    } = await supabaseServer.auth.getUser(accessToken);

    if (error || !user?.id || !user.email) return null;

    const { data: profile } = await supabaseServer
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role === "admin" ? "admin" : "user";

    return {
      id: user.id,
      email: user.email,
      role,
    };
  } catch {
    // Supabase 接続不良や想定外エラー時は未ログイン扱いにして安全側に倒す
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/");
  return user;
}

export { ACCESS_TOKEN_COOKIE };