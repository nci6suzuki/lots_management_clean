"use client";

import { useState } from "react";
import { lendUniformFIFO, returnUniform } from "@/app/actions/inventory";

type Branch = { id: string; name: string };
type Person = { id: string; name: string };
type Variant = { id: string; size: string | null; items: { item_code: string; name: string } };
type LendingRow = any;

function today() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export default function UniformClient(props: {
  branches: Branch[];
  people: Person[];
  variants: Variant[];
  unreturned: LendingRow[];
}) {
  const [branchId, setBranchId] = useState(props.branches[0]?.id ?? "");
  const [personId, setPersonId] = useState(props.people[0]?.id ?? "");
  const [variantId, setVariantId] = useState(props.variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [lentAt, setLentAt] = useState(today());
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");

  const [returnDate, setReturnDate] = useState(today());

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, maxWidth: 760 }}>
        <h2>貸与（FIFO出庫＋台帳登録）</h2>
        <div style={{ display: "grid", gap: 8 }}>
          <label>
            拠点（出庫元）
            <select value={branchId} onChange={(e) => setBranchId(e.target.value)}>
              {props.branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </label>

          <label>
            貸与先
            <select value={personId} onChange={(e) => setPersonId(e.target.value)}>
              {props.people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>

          <label>
            制服（サイズ含む）
            <select value={variantId} onChange={(e) => setVariantId(e.target.value)}>
              {props.variants.map((v) => (
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
            貸与日
            <input value={lentAt} onChange={(e) => setLentAt(e.target.value)} />
          </label>

          <label>
            備考
            <input value={note} onChange={(e) => setNote(e.target.value)} />
          </label>

          <button
            onClick={async () => {
              setMsg("");
              try {
                await lendUniformFIFO({
                  person_id: personId,
                  item_variant_id: variantId,
                  qty,
                  from_branch_id: branchId,
                  lent_at: lentAt,
                  note,
                });
                setMsg("貸与登録しました（FIFO出庫＋台帳）。ページ更新で未回収一覧に反映されます。");
                setNote("");
              } catch (e: any) {
                setMsg(`エラー: ${e.message}`);
              }
            }}
          >
            貸与登録
          </button>

          {msg && <div style={{ color: msg.startsWith("エラー") ? "crimson" : "green" }}>{msg}</div>}
        </div>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        <h2>未回収一覧</h2>

        <div style={{ marginBottom: 8 }}>
          回収日：
          <input value={returnDate} onChange={(e) => setReturnDate(e.target.value)} style={{ marginLeft: 8 }} />
          <span style={{ marginLeft: 12, color: "#666" }}>
            ※回収すると「単価0」で入庫し、台帳にreturned_atが入ります
          </span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">貸与日</th>
              <th align="left">貸与先</th>
              <th align="left">制服</th>
              <th align="left">備考</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {props.unreturned.map((r: any) => (
              <tr key={r.id} style={{ borderTop: "1px solid #eee" }}>
                <td>{r.lent_at}</td>
                <td>{r.people?.name ?? "-"}</td>
                <td>
                  {r.item_variants?.items?.item_code} {r.item_variants?.items?.name}
                  {r.item_variants?.size ? ` / ${r.item_variants.size}` : ""}
                </td>
                <td>{r.note ?? ""}</td>
                <td align="right">
                  <button
                    onClick={async () => {
                      setMsg("");
                      try {
                        await returnUniform({
                          lending_id: r.id,
                          branch_id: branchId, // 回収入庫先（ここでは出庫元と同じ拠点に戻す前提）
                          returned_at: returnDate,
                          note: "回収",
                        });
                        setMsg("回収しました。ページ更新で未回収から消えます。");
                      } catch (e: any) {
                        setMsg(`エラー: ${e.message}`);
                      }
                    }}
                  >
                    回収
                  </button>
                </td>
              </tr>
            ))}
            {props.unreturned.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 12, color: "#666" }}>未回収はありません</td>
              </tr>
            )}
          </tbody>
        </table>

        {msg && <div style={{ marginTop: 8, color: msg.startsWith("エラー") ? "crimson" : "green" }}>{msg}</div>}
      </div>
    </div>
  );
}
