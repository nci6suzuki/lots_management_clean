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

export async function getRefreshToken() {
  const store = await cookies();
  return store.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const accessToken = await getAccessToken();
    const refreshToken = await getRefreshToken();

    if (!accessToken && !refreshToken) return null;

    if (accessToken && refreshToken) {
      const { error: setSessionError } = await supabaseServer.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (setSessionError) {
        console.error("getCurrentUser setSession error:", setSessionError.message);
      }
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseServer.auth.getUser();

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