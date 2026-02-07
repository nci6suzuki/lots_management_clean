import { requireUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import UserManagementClient from "./ui/UserManagementClient";

export default async function UsersAdminPage() {
  const current = await requireUser();

  if (current.role !== "admin") {
    return (
      <div className="grid">
        <h1 className="page-title">ユーザー管理</h1>
        <div className="card">
          <p>この画面は admin 権限ユーザーのみ利用できます。</p>
          <p>現在ログイン中ユーザー: {current.email}</p>
          <p>ユーザーID: <code>{current.id}</code></p>
          <p className="muted">Supabase SQL Editor で次を実行して admin に昇格してください。</p>
          <pre>{`update public.user_profiles\nset role = 'admin'\nwhere id = '${current.id}';`}</pre>
        </div>
      </div>
    );
  }

  const [{ data: authUsers, error: usersError }, { data: profiles }] = await Promise.all([
    supabaseServer.auth.admin.listUsers(),
    supabaseServer.from("user_profiles").select("id,role"),
  ]);

  if (usersError) throw new Error(usersError.message);

  const roleMap = new Map((profiles ?? []).map((p: any) => [p.id, p.role]));
  const users = (authUsers?.users ?? [])
    .filter((u) => !!u.email)
    .map((u) => ({
      id: u.id,
      email: u.email!,
      role: (roleMap.get(u.id) === "admin" ? "admin" : "user") as "admin" | "user",
    }));

  return (
    <div className="grid">
      <h1 className="page-title">ユーザー管理</h1>
      <UserManagementClient users={users} currentUserId={current.id} />
    </div>
  );
}