"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ACCESS_TOKEN_COOKIE, requireAdmin, requireUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

const LoginSchema = z.object({
  email: z.string().email("メールアドレス形式で入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});

export async function login(input: { email: string; password: string }) {
  const data = LoginSchema.parse(input);

  const { data: sessionData, error } = await supabaseServer.auth.signInWithPassword(data);
  if (error || !sessionData.session?.access_token) {
    throw new Error(error?.message ?? "ログインに失敗しました");
  }

  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, sessionData.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionData.session.expires_in,
  });

  return { ok: true };
}

export async function logout() {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  return { ok: true };
}

const RoleSchema = z.enum(["admin", "user"]);

export async function createManagedUser(input: { email: string; password: string; role: "admin" | "user" }) {
  await requireAdmin();

  const data = z
    .object({
      email: z.string().email(),
      password: z.string().min(6),
      role: RoleSchema,
    })
    .parse(input);

  const { data: created, error } = await supabaseServer.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
  });
  if (error || !created.user) throw new Error(error?.message ?? "ユーザー作成に失敗しました");

  const { error: profileError } = await supabaseServer.from("user_profiles").upsert({
    id: created.user.id,
    role: data.role,
  });

  if (profileError) throw new Error(profileError.message);

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function updateUserRole(input: { userId: string; role: "admin" | "user" }) {
  await requireAdmin();

  const data = z.object({ userId: z.string().uuid(), role: RoleSchema }).parse(input);

  const { error } = await supabaseServer.from("user_profiles").upsert({
    id: data.userId,
    role: data.role,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function deleteManagedUser(input: { userId: string }) {
  const current = await requireAdmin();
  const data = z.object({ userId: z.string().uuid() }).parse(input);

  if (current.id === data.userId) {
    throw new Error("自分自身は削除できません");
  }

  const { error } = await supabaseServer.auth.admin.deleteUser(data.userId);
  if (error) throw new Error(error.message);

  await supabaseServer.from("user_profiles").delete().eq("id", data.userId);

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function whoAmI() {
  const user = await requireUser();
  return user;
}