"use client";

import { useState } from "react";
import { calcMonthly, closeMonth } from "@/app/actions/inventory";

type Row = {
  month: string;
  branch_id: string;
  item_id: string;
  item_variant_id: string;
  item_code: string;
  item_name: string;
  category_name: string | null;
  qty: number;
  amount: number;
};

function defaultMonth() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export default function MonthlyClient() {
  const [month, setMonth] = useState(defaultMonth());
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState("");
  const [userId, setUserId] = useState(""); // 仮：本番はAuthのuser.idを入れる

  const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label>
          対象月（YYYY-MM）
          <input value={month} onChange={(e) => setMonth(e.target.value)} style={{ marginLeft: 8 }} />
        </label>

        <button
          onClick={async () => {
            setMsg("");
            try {
              const data = await calcMonthly(month);
              setRows(data as any);
              setMsg(`集計しました（${data.length}行）`);
            } catch (e: any) {
              setMsg(`エラー: ${e.message}`);
            }
          }}
        >
          集計
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label>
          締め実行ユーザーID（UUID）
          <input value={userId} onChange={(e) => setUserId(e.target.value)} style={{ marginLeft: 8, width: 360 }} />
        </label>

        <button
          onClick={async () => {
            setMsg("");
            try {
              await closeMonth({ month, user_id: userId });
              setMsg("締めました（スナップショット保存＋当月編集ロック）。");
            } catch (e: any) {
              setMsg(`エラー: ${e.message}`);
            }
          }}
        >
          締める
        </button>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <b>集計結果</b>
          <span>合計金額: {total.toLocaleString()}</span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">物品コード</th>
              <th align="left">物品名</th>
              <th align="left">カテゴリ</th>
              <th align="right">数量</th>
              <th align="right">金額</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={`${r.item_variant_id}-${idx}`} style={{ borderTop: "1px solid #eee" }}>
                <td>{r.item_code}</td>
                <td>{r.item_name}</td>
                <td>{r.category_name ?? "-"}</td>
                <td align="right">{Number(r.qty).toLocaleString()}</td>
                <td align="right">{Number(r.amount).toLocaleString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 12, color: "#666" }}>
                  まだ集計していません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {msg && <div style={{ color: msg.startsWith("エラー") ? "crimson" : "green" }}>{msg}</div>}
    </div>
  );
}
