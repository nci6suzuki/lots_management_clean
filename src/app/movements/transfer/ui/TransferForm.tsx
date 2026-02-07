"use client";

import { useState } from "react";
import { transferStockFIFO } from "@/app/actions/inventory";

type Branch = { id: string; name: string };
type Variant = {
  id: string;
  size: string | null;
  items: { id: string; item_code: string; name: string };
};

export default function TransferForm({ branches, variants }: { branches: Branch[]; variants: Variant[] }) {
  const [fromBranchId, setFromBranchId] = useState(branches[0]?.id ?? "");
  const [toBranchId, setToBranchId] = useState(branches[0]?.id ?? "");
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, maxWidth: 720 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <label>
          出庫元（from）
          <select value={fromBranchId} onChange={(e) => setFromBranchId(e.target.value)}>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </label>

        <label>
          振替先（to）
          <select value={toBranchId} onChange={(e) => setToBranchId(e.target.value)}>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </label>

        <label>
          物品（サイズ含む）
          <select value={variantId} onChange={(e) => setVariantId(e.target.value)}>
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.items.item_code} {v.items.name}{v.size ? ` / ${v.size}` : ""}
              </option>
            ))}
          </select>
        </label>

        <label>
          数量
          <input type="number" min={1} value={qty} onChange={(e) => setQty(parseInt(e.target.value || "1", 10))} />
        </label>

        <label>
          備考
          <input value={note} onChange={(e) => setNote(e.target.value)} />
        </label>

        <button
          onClick={async () => {
            setMsg("");
            try {
              await transferStockFIFO({
                item_variant_id: variantId,
                qty,
                from_branch_id: fromBranchId,
                to_branch_id: toBranchId,
                note,
              });
              setMsg("拠点振替しました（FIFOで出庫→同単価で入庫）。");
              setNote("");
            } catch (e: any) {
              setMsg(`エラー: ${e.message}`);
            }
          }}
        >
          振替実行（FIFO）
        </button>

        {msg && <div style={{ color: msg.startsWith("エラー") ? "crimson" : "green" }}>{msg}</div>}
      </div>
    </div>
  );
}