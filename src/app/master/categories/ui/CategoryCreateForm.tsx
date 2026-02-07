"use client";

import { useState } from "react";
import { createCategory } from "@/app/actions/inventory";

export default function CategoryCreateForm() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <div className="form-grid">
      <h3>カテゴリ登録</h3>
      <label>
        カテゴリ名
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例: 事務用品" />
      </label>
      <button
        disabled={!name.trim()}
        onClick={async () => {
          setMsg("");
          try {
            await createCategory({ name: name.trim() });
            setName("");
            setMsg("登録しました。画面更新で一覧に反映されます。");
          } catch (e: any) {
            setMsg(`エラー: ${e.message}`);
          }
        }}
      >
        カテゴリ登録
      </button>
      {msg && <div style={{ color: msg.startsWith("エラー") ? "crimson" : "green" }}>{msg}</div>}
    </div>
  );
}