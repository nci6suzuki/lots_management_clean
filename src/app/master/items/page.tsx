"use client"

import { supabaseServer } from "@/lib/supabase/server";
import ItemCreateForm from "./ui/ItemCreateForm";

export default async function Page() {
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabaseServer.from("categories").select("id,name").order("name"),
    supabaseServer.from("items").select("id,item_code,name,kind,is_uniform,created_at").order("created_at", { ascending: false }),
  ]);

  return (
    <div style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>品目マスタ</h1>

      <ItemCreateForm categories={categories ?? []} />

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
        <h2>登録済み</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left">コード</th>
              <th align="left">名称</th>
              <th align="left">種別</th>
              <th align="left">制服</th>
              <th align="left">作成</th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((it) => (
              <tr key={it.id} style={{ borderTop: "1px solid #eee" }}>
                <td>{it.item_code}</td>
                <td>{it.name}</td>
                <td>{it.kind}</td>
                <td>{it.is_uniform ? "はい" : "いいえ"}</td>
                <td>{new Date(it.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ color: "#666" }}>
        ※ サイズ（variants）は次で追加：/master/variants（次のコードで用意）
      </p>
    </div>
  );
}

