import { supabaseServer } from "@/lib/supabase/server";
import TransferForm from "./ui/TransferForm";

export default async function Page() {
  const [{ data: branches }, { data: variants }] = await Promise.all([
    supabaseServer.from("branches").select("id,name").order("name"),
    supabaseServer
      .from("item_variants")
      .select("id,size,items(id,item_code,name)")
      .eq("is_active", true),
  ]);

  return (
    <div style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>拠点振替（FIFO：出庫＋入庫）</h1>
      <TransferForm branches={branches ?? []} variants={variants ?? []} />
    </div>
  );
}