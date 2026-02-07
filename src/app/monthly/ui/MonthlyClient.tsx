"use client";

import { useMemo, useState } from "react";
import { calcMonthly, closeMonth } from "@/app/actions/inventory";

type Row = { month: string; branch_id: string; item_variant_id: string; item_code: string; item_name: string; category_name: string | null; qty: number; amount: number; };

const defaultMonth = () => `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

export default function MonthlyClient() {
  const [month, setMonth] = useState(defaultMonth());
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState("");
  const total = useMemo(() => rows.reduce((s, r) => s + Number(r.amount || 0), 0), [rows]);

  const exportCsv = () => {
    const header = ["month", "item_code", "item_name", "category", "qty", "amount"];
    const lines = rows.map((r) => [r.month, r.item_code, r.item_name, r.category_name ?? "", String(r.qty), String(r.amount)].join(","));
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `monthly-${month}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid">
      <div className="row">
        <label>対象月<input value={month} onChange={(e) => setMonth(e.target.value)} style={{ marginLeft: 6 }} /></label>
        <button onClick={async () => { setMsg(""); try { const data = await calcMonthly(month); setRows(data as Row[]); setMsg(`集計しました (${data.length}行)`); } catch (e: any) { setMsg(`エラー: ${e.message}`); } }}>集計</button>
        <button onClick={exportCsv} disabled={!rows.length}>CSV出力</button>
      </div>

      <div className="row">
        <button onClick={async () => { setMsg(""); try { await closeMonth({ month }); setMsg("月次締め完了（編集ロック）"); } catch (e: any) { setMsg(`エラー: ${e.message}`); } }}>締める</button>
      </div>

      <div className="muted">合計金額: ¥{total.toLocaleString()}</div>
      <table>
        <thead><tr><th>品目コード</th><th>品目名</th><th>カテゴリ</th><th style={{ textAlign: "right" }}>数量</th><th style={{ textAlign: "right" }}>金額</th></tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}><td>{r.item_code}</td><td>{r.item_name}</td><td>{r.category_name ?? "-"}</td><td style={{ textAlign: "right" }}>{Number(r.qty).toLocaleString()}</td><td style={{ textAlign: "right" }}>{Number(r.amount).toLocaleString()}</td></tr>)}</tbody>
      </table>

      {msg && <div style={{ color: msg.startsWith("エラー") ? "crimson" : "green" }}>{msg}</div>}
    </div>
  );
}
