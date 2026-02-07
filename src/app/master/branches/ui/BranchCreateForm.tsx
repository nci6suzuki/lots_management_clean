"use client";

import { useState } from "react";
import { createBranch } from "@/app/actions/inventory";

export default function BranchCreateForm() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <div className="form-grid">
      <h3>拠点登録</h3>
      <label>
        拠点コード
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="例: TOKYO" />
      </label>
      <label>
        拠点名
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例: 本社" />
      </label>
      <button
        disabled={!code.trim() || !name.trim()}
        onClick={async () => {
          setMsg("");
          try {
            await createBranch({ code: code.trim(), name: name.trim() });
            setCode("");
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