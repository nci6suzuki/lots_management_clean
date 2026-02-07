"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createManagedUser, deleteManagedUser, updateUserRole } from "@/app/actions/auth";

type ManagedUser = {
  id: string;
  email: string;
  role: "admin" | "user";
};

export default function UserManagementClient({ users, currentUserId }: { users: ManagedUser[]; currentUserId: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  return (
    <div className="grid">
      <div className="card">
        <h3>ユーザー作成</h3>
        <div className="grid">
          <label>メールアドレス<input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label>初期パスワード<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          <label>
            権限
            <select value={role} onChange={(e) => setRole(e.target.value as "admin" | "user")}> 
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </label>
          <button onClick={async () => {
            setMsg("");
            try {
              await createManagedUser({ email, password, role });
              setEmail("");
              setPassword("");
              setMsg("ユーザーを作成しました。");
              router.refresh();
            } catch (e: any) {
              setMsg(`エラー: ${e.message}`);
            }
          }}>作成</button>
        </div>
      </div>

      <div className="card">
        <h3>登録ユーザー</h3>
        <table>
          <thead>
            <tr><th>メールアドレス</th><th>権限</th><th>操作</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>
                  <select
                    defaultValue={u.role}
                    onChange={async (e) => {
                      setMsg("");
                      try {
                        await updateUserRole({ userId: u.id, role: e.target.value as "admin" | "user" });
                        setMsg("権限を更新しました。");
                        router.refresh();
                      } catch (err: any) {
                        setMsg(`エラー: ${err.message}`);
                      }
                    }}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td>
                  <button disabled={u.id === currentUserId} onClick={async () => {
                    setMsg("");
                    try {
                      await deleteManagedUser({ userId: u.id });
                      setMsg("ユーザーを削除しました。");
                      router.refresh();
                    } catch (err: any) {
                      setMsg(`エラー: ${err.message}`);
                    }
                  }}>削除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {msg && <div style={{ color: msg.startsWith("エラー") ? "crimson" : "green" }}>{msg}</div>}
    </div>
  );
}