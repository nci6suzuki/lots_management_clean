import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export default async function Home() {
  await requireUser();
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [{ data: lots }, { data: movements }, { data: monthly }] = await Promise.all([
    supabaseServer.from("purchase_lots").select("qty_remaining, unit_cost"),
    supabaseServer.from("inventory_movements").select("type, qty").order("occurred_at", { ascending: false }).limit(8),
    supabaseServer.rpc("calc_monthly_transfer", { p_month: month }),
  ]);

  const stockQty = (lots ?? []).reduce((s, r: any) => s + Number(r.qty_remaining || 0), 0);
  const stockAmount = (lots ?? []).reduce((s, r: any) => s + Number(r.qty_remaining || 0) * Number(r.unit_cost || 0), 0);
  const monthlyAmount = (monthly ?? []).reduce((s: number, r: any) => s + Number(r.amount || 0), 0);
  
  return (
    <div className="grid">
      <h1 className="page-title">ダッシュボード</h1>
      <div className="grid grid-3">
        <div className="card"><div className="muted">在庫数量合計</div><div className="kpi">{stockQty.toLocaleString()}</div></div>
        <div className="card"><div className="muted">在庫金額（FIFOロット残）</div><div className="kpi">¥{stockAmount.toLocaleString()}</div></div>
        <div className="card"><div className="muted">{month} 月次費用</div><div className="kpi">¥{monthlyAmount.toLocaleString()}</div></div>
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h3 style={{ margin: 0 }}>最近の入出庫</h3>
          <div className="row">
            <Link href="/movements/receive"><button>入庫入力</button></Link>
            <Link href="/movements/issue"><button>出庫入力</button></Link>
          </div>
        </div>
        <table>
          <thead><tr><th>種別</th><th style={{ textAlign: "right" }}>数量</th></tr></thead>
          <tbody>
            {(movements ?? []).map((m: any, i: number) => (
              <tr key={i}><td>{m.type}</td><td style={{ textAlign: "right" }}>{Number(m.qty).toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
