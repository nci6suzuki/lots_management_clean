"use client";

import { useState } from "react";
import { createVariant } from "@/app/actions/inventory";

export default function VariantCreateForm({ items }: { items: { id: string; item_code: string; name: string }[] }) {
  const [itemId, setItemId] = useState(items[0]?.id ?? "");
  const [size, setSize] = useState("");
  const [sku, setSku] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <div className="form-grid">
      <h3>サイズ登録</h3>
      <label>品目<select value={itemId} onChange={(e) => setItemId(e.target.value)}>{items.map((it) => <option value={it.id} key={it.id}>{it.item_code} {it.name}</option>)}</select></label>
      <label>サイズ<input value={size} onChange={(e) => setSize(e.target.value)} placeholder="例: M" /></label>
      <label>SKU<input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="任意" /></label>
      <button onClick={async () => {
        setMsg("");
        try {
          await createVariant({ item_id: itemId, size: size || null, sku: sku || null });
          setSize(""); setSku("");
          setMsg("登録しました。画面更新で一覧反映されます。");
        } catch (e: any) {
          setMsg(`エラー: ${e.message}`);
        }
      }}>サイズ登録</button>
      {msg && <div style={{ color: msg.startsWith("エラー") ? "crimson" : "green" }}>{msg}</div>}
    </div>
  );
}