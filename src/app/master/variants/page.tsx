import { supabaseServer } from "@/lib/supabase/server";
import VariantCreateForm from "./ui/VariantCreateForm";

export default async function VariantsPage() {
  const [{ data: items }, { data: variants }] = await Promise.all([
    supabaseServer.from("items").select("id,item_code,name").order("item_code"),
    supabaseServer.from("item_variants").select("id,size,sku,is_active,items(item_code,name)").order("created_at", { ascending: false }),
  ]);

  return (
    <div className="grid">
      <h1 className="page-title">サイズ管理</h1>
      <div className="card"><VariantCreateForm items={items ?? []} /></div>
      <div className="card">
        <h3>登録済みサイズ</h3>
        <table>
          <thead><tr><th>品目</th><th>サイズ</th><th>SKU</th><th>有効</th></tr></thead>
          <tbody>
            {(variants ?? []).map((v: any) => (
              <tr key={v.id}><td>{v.items?.item_code} {v.items?.name}</td><td>{v.size || "-"}</td><td>{v.sku || "-"}</td><td>{v.is_active ? "有効" : "停止"}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}