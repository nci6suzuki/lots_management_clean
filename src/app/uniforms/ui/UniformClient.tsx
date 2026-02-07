"use client";

import { useState } from "react";
import { lendUniformFIFO, returnUniform } from "@/app/actions/inventory";

type Branch = { id: string; name: string };
type Person = { id: string; name: string };
type Variant = { id: string; size: string | null; items: { item_code: string; name: string } };

const today = () => `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

export default function UniformClient(props: { branches: Branch[]; people: Person[]; variants: Variant[]; unreturned: any[]; histories: any[] }) {
  const [branchId, setBranchId] = useState(props.branches[0]?.id ?? "");
  const [personId, setPersonId] = useState(props.people[0]?.id ?? "");
  const [variantId, setVariantId] = useState(props.variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [lentAt, setLentAt] = useState(today());
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");
  const [returnDate, setReturnDate] = useState(today());

  return (
    <div className="grid">
      <h3>貸与登録</h3>
      <div className="form-grid">
        <label>拠点<select value={branchId} onChange={(e) => setBranchId(e.target.value)}>{props.branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
        <label>貸与先<select value={personId} onChange={(e) => setPersonId(e.target.value)}>{props.people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label>制服<select value={variantId} onChange={(e) => setVariantId(e.target.value)}>{props.variants.map((v) => <option key={v.id} value={v.id}>{v.items.item_code} {v.items.name}{v.size ? ` / ${v.size}` : ""}</option>)}</select></label>
        <label>数量<input type="number" min={1} value={qty} onChange={(e) => setQty(parseInt(e.target.value || "1", 10))} /></label>
        <label>貸与日<input value={lentAt} onChange={(e) => setLentAt(e.target.value)} /></label>
        <label>備考<input value={note} onChange={(e) => setNote(e.target.value)} /></label>
        <button onClick={async () => {
          setMsg("");
          try {
            await lendUniformFIFO({ person_id: personId, item_variant_id: variantId, qty, from_branch_id: branchId, lent_at: lentAt, note });
            setMsg("貸与登録しました"); setNote("");
          } catch (e: any) { setMsg(`エラー: ${e.message}`); }
        }}>貸与登録</button>
      </div>

      <h3>未回収一覧</h3>
      <div className="row"><label>回収日<input value={returnDate} onChange={(e) => setReturnDate(e.target.value)} style={{ marginLeft: 6 }} /></label></div>
      <table>
        <thead><tr><th>貸与日</th><th>貸与先</th><th>制服</th><th>備考</th><th></th></tr></thead>
        <tbody>
          {props.unreturned.map((r: any) => (
            <tr key={r.id}><td>{r.lent_at}</td><td>{r.people?.name}</td><td>{r.item_variants?.items?.item_code} {r.item_variants?.items?.name}{r.item_variants?.size ? ` / ${r.item_variants.size}` : ""}</td><td>{r.note ?? ""}</td><td><button onClick={async () => {
              setMsg("");
              try { await returnUniform({ lending_id: r.id, branch_id: branchId, returned_at: returnDate, note: "回収" }); setMsg("回収しました"); } catch (e: any) { setMsg(`エラー: ${e.message}`); }
            }}>回収</button></td></tr>
          ))}
        </tbody>
      </table>

      <h3>回収履歴（直近20件）</h3>
      <table>
        <thead><tr><th>貸与日</th><th>回収日</th><th>貸与先</th><th>制服</th></tr></thead>
        <tbody>{props.histories.map((h: any) => <tr key={h.id}><td>{h.lent_at}</td><td>{h.returned_at}</td><td>{h.people?.name}</td><td>{h.item_variants?.items?.item_code} {h.item_variants?.items?.name}</td></tr>)}</tbody>
      </table>
      {msg && <div style={{ color: msg.startsWith("エラー") ? "crimson" : "green" }}>{msg}</div>}
    </div>
  );
}
