import { supabaseServer } from "@/lib/supabase/server";

export default async function Page() {
  // purchase_lots を集計して残数を出す（最小）
  const { data, error } = await supabaseServer
    .from("purchase_lots")
    .select("branch_id, item_variant_id, qty_remaining, branches(name), item_variants(size, items(item_code,name))");

  if (error) throw new Error(error.message);

  // サーバー側で軽く集計
  const map = new Map<string, any>();
  for (const row of data ?? []) {
    const key = `${row.branch_id}-${row.item_variant_id}`;
    const cur = map.get(key) ?? {
      branch: (row as any).branches?.name ?? "",
      item_code: (row as any).item_variants?.items?.item_code ?? "",
      item_name: (row as any).item_variants?.items?.name ?? "",
      size: (row as any).item_variants?.size ?? "",
      qty: 0,
    };
    cur.qty += row.qty_remaining;
    map.set(key, cur);
  }
  const rows = Array.from(map.values()).sort((a, b) => (a.branch + a.item_code).localeCompare(b.branch + b.item_code));

  return (
    <div style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>在庫一覧</h1>
      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">拠点</th>
              <th align="left">物品コード</th>
              <th align="left">物品名</th>
              <th align="left">サイズ</th>
              <th align="right">残数</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderTop: "1px solid #eee" }}>
                <td>{r.branch}</td>
                <td>{r.item_code}</td>
                <td>{r.item_name}</td>
                <td>{r.size || "-"}</td>
                <td align="right">{Number(r.qty).toLocaleString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 12, color: "#666" }}>
                  在庫がありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
