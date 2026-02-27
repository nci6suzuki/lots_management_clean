import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

type StockRow = { item: string; branch: string; qty: number };

type MovementRow = {
  occurred_at: string;
  qty: number;
  branches?: { name?: string };
  item_variants?: { size?: string | null; items?: { item_code?: string; name?: string } };
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

function formatItemLabel(row: MovementRow) {
  const code = row.item_variants?.items?.item_code ?? "";
  const name = row.item_variants?.items?.name ?? "";
  const size = row.item_variants?.size ? ` / ${row.item_variants.size}` : "";
  return `${code} ${name}${size}`.trim();
}

export default async function EquipmentPage() {
  await requireUser();

  const [{ data: lots }, { data: recentIssues }, { data: recentReceives }] = await Promise.all([
    supabaseServer
      .from("purchase_lots")
      .select("qty_remaining, branches(name), item_variants(size, items(item_code,name))"),
    supabaseServer
      .from("inventory_movements")
      .select("occurred_at, qty, branches(name), item_variants(size, items(item_code,name))")
      .eq("type", "ISSUE")
      .order("occurred_at", { ascending: false })
      .limit(10),
    supabaseServer
      .from("inventory_movements")
      .select("occurred_at, qty, branches(name), item_variants(size, items(item_code,name))")
      .eq("type", "RECEIVE")
      .order("occurred_at", { ascending: false })
      .limit(10),
  ]);

  const aggregated = new Map<string, StockRow>();
  for (const row of lots ?? []) {
    const itemName = `${(row as any).item_variants?.items?.item_code ?? ""} ${(row as any).item_variants?.items?.name ?? ""}${(row as any).item_variants?.size ? ` / ${(row as any).item_variants?.size}` : ""}`.trim();
    const branch = (row as any).branches?.name ?? "未設定";
    const key = `${branch}-${itemName}`;

    const current = aggregated.get(key) ?? { item: itemName, branch, qty: 0 };
    current.qty += Number(row.qty_remaining ?? 0);
    aggregated.set(key, current);
  }

  const stockRows = Array.from(aggregated.values()).sort((a, b) => a.qty - b.qty);
  const totalKinds = stockRows.length;
  const totalQty = stockRows.reduce((sum, row) => sum + row.qty, 0);
  const lowStockRows = stockRows.filter((row) => row.qty <= 5);

  const branchSummary = new Map<string, number>();
  for (const row of stockRows) {
    branchSummary.set(row.branch, (branchSummary.get(row.branch) ?? 0) + row.qty);
  }
  const branchCards = Array.from(branchSummary.entries())
    .map(([branch, qty]) => ({ branch, qty }))
    .sort((a, b) => b.qty - a.qty);

  const timeline = [
    ...(recentReceives ?? []).map((row) => ({ type: "入庫", color: "receive", row: row as MovementRow })),
    ...(recentIssues ?? []).map((row) => ({ type: "出庫", color: "issue", row: row as MovementRow })),
  ]
    .sort((a, b) => new Date(b.row.occurred_at).getTime() - new Date(a.row.occurred_at).getTime())
    .slice(0, 14);

  return (
    <div className="grid equipment-page">
      <div className="equipment-header card">
        <div>
          <h1 className="page-title">備品管理</h1>
          <div className="muted">入出庫管理ビュー（AppSheet風レイアウト）</div>
        </div>
        <div className="equipment-actions">
          <Link href="/movements/receive"><button>入庫登録</button></Link>
          <Link href="/movements/issue"><button>出庫登録</button></Link>
          <Link href="/stocks"><button>在庫一覧</button></Link>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card equipment-kpi"><div className="muted">備品種別数</div><div className="kpi">{totalKinds.toLocaleString()}</div></div>
        <div className="card equipment-kpi"><div className="muted">在庫合計数</div><div className="kpi">{totalQty.toLocaleString()}</div></div>
        <div className="card equipment-kpi"><div className="muted">在庫僅少（5以下）</div><div className="kpi">{lowStockRows.length.toLocaleString()}</div></div>
      </div>

      <div className="grid grid-2-eq">
        <div className="card">
          <h3 className="section-title">拠点別 在庫サマリー</h3>
          <div className="equipment-branch-grid">
            {branchCards.map((branch) => (
              <div key={branch.branch} className="equipment-branch-card">
                <div className="muted">{branch.branch}</div>
                <div className="equipment-branch-qty">{branch.qty.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">最新アクティビティ</h3>
          <div className="equipment-timeline">
            {timeline.map((entry, idx) => (
              <div key={idx} className="equipment-timeline-row">
                <span className={`equipment-badge ${entry.color}`}>{entry.type}</span>
                <div className="equipment-timeline-main">
                  <div>{entry.row.branches?.name} / {formatItemLabel(entry.row)}</div>
                  <div className="muted">{formatDate(entry.row.occurred_at)}</div>
                </div>
                <div className="equipment-timeline-qty">{entry.row.qty.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">在庫注意リスト（残数が少ない順）</h3>
        <table>
          <thead><tr><th>拠点</th><th>備品</th><th style={{ textAlign: "right" }}>残数</th><th>状態</th></tr></thead>
          <tbody>
            {stockRows.slice(0, 20).map((row, idx) => (
              <tr key={idx}>
                <td>{row.branch}</td>
                <td>{row.item}</td>
                <td style={{ textAlign: "right" }}>{row.qty.toLocaleString()}</td>
                <td>
                  <span className={`equipment-status ${row.qty <= 5 ? "danger" : row.qty <= 10 ? "warn" : "ok"}`}>
                    {row.qty <= 5 ? "要補充" : row.qty <= 10 ? "注意" : "通常"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}