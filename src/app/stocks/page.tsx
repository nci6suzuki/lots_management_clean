import { supabaseServer } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export default async function StocksPage() {
  await requireUser();
  const { data, error } = await supabaseServer
    .from("purchase_lots")
    .select("branch_id, item_variant_id, qty_remaining, unit_cost, branches(name), item_variants(size, items(item_code,name))");

  if (error) throw new Error(error.message);

  const map = new Map<string, any>();
  for (const row of data ?? []) {
    const key = `${row.branch_id}-${row.item_variant_id}`;
    const cur = map.get(key) ?? {
      branch: (row as any).branches?.name ?? "",
      item_code: (row as any).item_variants?.items?.item_code ?? "",
      item_name: (row as any).item_variants?.items?.name ?? "",
      size: (row as any).item_variants?.size ?? "",
      qty: 0,
      amount: 0,
    };
    cur.qty += Number(row.qty_remaining || 0);
    cur.amount += Number(row.qty_remaining || 0) * Number((row as any).unit_cost || 0);
    map.set(key, cur);
  }
  const rows = Array.from(map.values()).sort((a, b) => (a.branch + a.item_code).localeCompare(b.branch + b.item_code));

  return (
    <div className="grid">
      <h1 className="page-title">在庫一覧</h1>
      <div className="card">
        <table>
          <thead><tr><th>拠点</th><th>物品コード</th><th>物品名</th><th>サイズ</th><th style={{ textAlign: "right" }}>残数</th><th style={{ textAlign: "right" }}>金額</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}><td>{r.branch}</td><td>{r.item_code}</td><td>{r.item_name}</td><td>{r.size || "-"}</td><td style={{ textAlign: "right" }}>{r.qty.toLocaleString()}</td><td style={{ textAlign: "right" }}>¥{r.amount.toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
