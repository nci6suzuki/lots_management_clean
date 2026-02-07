"use client";

import { useState } from "react";
import { createBranch } from "@/app/actions/inventory";

export default function BranchCreateForm() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <div className="form-grid">
      <h3>拠点登録</h3>
      <label>
        拠点名
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例: 本社" />
      </label>
      <button
        disabled={!name.trim()}
        onClick={async () => {
          setMsg("");
          try {
            await createBranch({ name: name.trim() });
            setName("");
            setMsg("登録しました。画面更新で一覧に反映されます。");
          } catch (e: any) {
            setMsg(`エラー: ${e.message}`);
          }
        }}
      >
        拠点登録
      </button>
      {msg && <div style={{ color: msg.startsWith("エラー") ? "crimson" : "green" }}>{msg}</div>}
    </div>
  );
}