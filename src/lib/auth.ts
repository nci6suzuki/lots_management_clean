import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export type AppRole = "admin" | "user";

export type CurrentUser = {
  id: string;
  email: string;
  role: AppRole;
};

export const ACCESS_TOKEN_COOKIE = "lm_access_token";
export const REFRESH_TOKEN_COOKIE = "lm_refresh_token";

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
      error: userError,
    } = await supabaseServer.auth.getUser(accessToken);

    if (userError || !user?.id || !user.email) {
      return null;
    }

    const { data: profile, error: profileError } = await supabaseServer
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("getCurrentUser profile error:", profileError.message);
      return null;
    }

    const role: AppRole = profile?.role === "admin" ? "admin" : "user";

    return {
      id: user.id,
      email: user.email,
      role,
    };
  } catch (error: any) {
    console.error("getCurrentUser failed:", error?.message, error?.cause);
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