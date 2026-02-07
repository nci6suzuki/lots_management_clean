"use client";

import { useState } from "react";
import { createPerson } from "@/app/actions/inventory";

export default function PersonCreateForm() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <div className="form-grid">
      <h3>貸与先登録</h3>
      <label>
        貸与先コード
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="例: EMP001" />
      </label>
      <label>
        貸与先名
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例: 山田 太郎" />
      </label>
      <button
        disabled={!code.trim() || !name.trim()}
        onClick={async () => {
          setMsg("");
          try {
            await createPerson({ code: code.trim(), name: name.trim() });
            setCode("");
            setName("");
            setMsg("登録しました。画面更新で一覧に反映されます。");
          } catch (e: any) {
            setMsg(`エラー: ${e.message}`);
          }
        }}
      >
        貸与先登録
      </button>
      {msg && <div style={{ color: msg.startsWith("エラー") ? "crimson" : "green" }}>{msg}</div>}
    </div>
  );
}