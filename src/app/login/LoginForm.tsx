"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <div className="card" style={{ maxWidth: 420, margin: "48px auto" }}>
      <h1 className="page-title">ログイン</h1>
      <div className="grid">
        <label>メールアドレス<input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>パスワード<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button
          onClick={async () => {
            setMsg("");
            try {
              await login({ email, password });
              router.push("/");
              router.refresh();
            } catch (e: any) {
              setMsg(`エラー: ${e.message}`);
            }
          }}
        >
          ログイン
        </button>
        {msg && <div style={{ color: "crimson" }}>{msg}</div>}
      </div>
    </div>
  );
}