"use client";

import { useMemo, useState } from "react";

type Variant = {
  id: string;
  size: string | null;
  items: { item_code: string; name: string };
};

export default function SearchableVariantSelect({
  variants,
  value,
  onChange,
}: {
  variants: Variant[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [keyword, setKeyword] = useState("");

  const filteredVariants = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return variants;

    return variants.filter((variant) => {
      const label = `${variant.items.item_code} ${variant.items.name} ${variant.size ?? ""}`.toLowerCase();
      return label.includes(q);
    });
  }, [keyword, variants]);

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="物品コード・名称・サイズで絞り込み"
        aria-label="物品の絞り込み"
      />
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {filteredVariants.map((variant) => (
          <option key={variant.id} value={variant.id}>
            {variant.items.item_code} {variant.items.name}
            {variant.size ? ` / ${variant.size}` : ""}
          </option>
        ))}
      </select>
      {filteredVariants.length === 0 && (
        <div style={{ color: "#666", fontSize: 12 }}>一致する候補がありません。絞り込み条件を変更してください。</div>
      )}
    </div>
  );
}