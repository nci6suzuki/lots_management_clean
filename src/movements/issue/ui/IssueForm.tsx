"use client";

import { useState } from "react";
import { issueStockFIFO } from "@/app/actions/inventory";

type Branch = { id: string; name: string };
type Variant = {
  id: string;
  size: string | null;
  items: { id: string; item_code: string; name: string };
};

export default function IssueForm({ branches, variants }: { branches: Branch[]; variants: Variant[] }) {
  const [type, setType] = useState<"lend" | "transfer" | "adjust">("lend");
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
          種別
          <select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="lend">貸与（出庫）</option>
            <option value="transfer">拠点振替（出庫）</option>
            <option value="adjust">棚卸調整（-）</option>
          </select>
        </label>

        <label>
          出庫元（from）
          <select value={fromBranchId} onChange={(e) => setFromBranchId(e.target.value)}>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </label>

        {type === "transfer" && (
          <label>
            振替先（to）
            <select value={toBranchId} onChange={(e) => setToBranchId(e.target.value)}>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </label>
        )}

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
          <input type="number" value={qty} min={1} onChange={(e) => setQty(parseInt(e.target.value || "1", 10))} />
        </label>

        <label>
          備考
          <input value={note} onChange={(e) => setNote(e.target.value)} />
        </label>

        <button
          onClick={async () => {
            setMsg("");
            try {
              await issueStockFIFO({
                type,
                from_branch_id: fromBranchId,
                to_branch_id: type === "transfer" ? toBranchId : null,
                item_variant_id: variantId,
                qty,
                note,
              });
              setMsg("FIFO出庫しました。");
              setNote("");
            } catch (e: any) {
              // 在庫不足はRPCが例外を投げる
              setMsg(`エラー: ${e.message}`);
            }
          }}
        >
          出庫登録（FIFO）
        </button>

        {msg && <div style={{ color: msg.startsWith("エラー") ? "crimson" : "green" }}>{msg}</div>}
      </div>
    </div>
  );
}
