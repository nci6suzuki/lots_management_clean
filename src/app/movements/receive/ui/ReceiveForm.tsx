"use client";

import { useMemo, useState } from "react";
import { receiveStock } from "@/app/actions/inventory";
import SearchableVariantSelect from "@/app/components/SearchableVariantSelect";

type Branch = { id: string; name: string };
type Variant = {
  id: string;
  size: string | null;
  items: { id: string; item_code: string; name: string; is_uniform: boolean };
};

export default function ReceiveForm({ branches, variants }: { branches: Branch[]; variants: Variant[] }) {
  const [type, setType] = useState<"purchase" | "return" | "adjust">("purchase");
  const [branchId, setBranchId] = useState(branches[0]?.id ?? "");
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [unitCost, setUnitCost] = useState(0);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");

  const selectedVariant = useMemo(() => variants.find((v) => v.id === variantId), [variants, variantId]);

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, maxWidth: 720 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <label>
          種別
          <select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="purchase">購入</option>
            <option value="return">回収（単価0）</option>
            <option value="adjust">棚卸調整（+）</option>
          </select>
        </label>

        <label>
          拠点
          <select value={branchId} onChange={(e) => setBranchId(e.target.value)}>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          物品（サイズ含む）
          <SearchableVariantSelect variants={variants} value={variantId} onChange={setVariantId} />
        </label>

        <label>
          数量
          <input
            type="number"
            value={qty}
            min={1}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10)))}
          />
        </label>

        <label>
          単価（購入のみ）
          <input
            type="number"
            value={type === "purchase" ? unitCost : 0}
            min={0}
            disabled={type !== "purchase"}
            onChange={(e) => setUnitCost(Math.max(0, parseFloat(e.target.value || "0")))}
          />
        </label>

        <label>
          備考
          <input value={note} onChange={(e) => setNote(e.target.value)} />
        </label>

        <button
          disabled={!variantId || !branchId}
          onClick={async () => {
            setMsg("");
            try {
              await receiveStock({
                type,
                branch_id: branchId,
                item_variant_id: variantId,
                qty,
                unit_cost: type === "purchase" ? unitCost : 0,
                note,
              });
              setMsg("登録しました。");
              setNote("");
            } catch (e: any) {
              setMsg(`エラー: ${e.message}`);
            }
          }}
        >
          入庫登録
        </button>

        {selectedVariant?.items.is_uniform && type === "return" && (
          <div style={{ color: "#666" }}>※ 回収は要件どおり単価0でロットを作ります。</div>
        )}

        {msg && <div style={{ color: msg.startsWith("エラー") ? "crimson" : "green" }}>{msg}</div>}
      </div>
    </div>
  );
}