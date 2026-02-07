
import ReceiveForm from "./ui/ReceiveForm";
import { supabaseServer } from "@/lib/supabase/server";

export default async function Page() {
  const [{ data: branches }, { data: variants }] = await Promise.all([
    supabaseServer.from("branches").select("id,name").order("name"),
    supabaseServer
      .from("item_variants")
      .select("id,size,items(id,item_code,name,is_uniform)")
      .eq("is_active", true),
  ]);

  return (
    <div style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>入庫（購入 / 回収 / 調整+）</h1>
      <ReceiveForm branches={branches ?? []} variants={variants ?? []} />
    </div>
  );
}
