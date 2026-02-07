import { supabaseServer } from "@/lib/supabase/server";
import ItemCreateForm from "./ui/ItemCreateForm";
import { requireUser } from "@/lib/auth";

export default async function Page() {
  await requireUser();
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabaseServer.from("categories").select("id,name").order("name"),
    supabaseServer.from("items").select("id,item_code,name,kind,is_uniform,created_at").order("created_at", { ascending: false }),
  ]);

  return (
    <div className="grid">
      <h1 className="page-title">管理マスタ（品目）</h1>
      <div className="card"><ItemCreateForm categories={categories ?? []} /></div>
      <div className="card">
        <h3>登録済み品目</h3>
        <table>
          <thead><tr><th>コード</th><th>名称</th><th>種別</th><th>制服</th><th>作成</th></tr></thead>
          <tbody>
            {(items ?? []).map((it) => (
              <tr key={it.id}><td>{it.item_code}</td><td>{it.name}</td><td>{it.kind}</td><td>{it.is_uniform ? "○" : "-"}</td><td>{new Date(it.created_at).toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

