"use client";

import { useState } from "react";
import { createItem } from "@/app/actions/inventory";

type Category = { id: string; name: string };

export default function ItemCreateForm({ categories }: { categories: Category[] }) {
  const [kind, setKind] = useState<"備" | "名" | "制">("備");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string | "">("");
  const [isUniform, setIsUniform] = useState(false);
  const [msg, setMsg] = useState("");

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h2>新規登録</h2>

      <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        <label>
          種別（備/名/制）
          <select value={kind} onChange={(e) => setKind(e.target.value as any)}>
            <option value="備">備品</option>
            <option value="名">名刺</option>
            <option value="制">制服</option>
          </select>
        </label>

        <label>
          名称
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          カテゴリ
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">未指定</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={isUniform}
            onChange={(e) => setIsUniform(e.target.checked)}
          />
          制服扱い
        </label>

        <button
          onClick={async () => {
            setMsg("");
            try {
              await createItem({
                kind,
                name,
                category_id: categoryId || null,
                is_uniform: isUniform,
              });
              setName("");
              setCategoryId("");
              setIsUniform(false);
              setMsg("登録しました。画面を更新すると一覧に反映されます。");
            } catch (e: any) {
              setMsg(`エラー: ${e.message}`);
            }
          }}
        >
          登録（自動採番）
        </button>

        {msg && <div style={{ color: msg.startsWith("エラー") ? "crimson" : "green" }}>{msg}</div>}
      </div>
    </div>
  );
}
