import IssueForm from "./ui/IssueForm";
import { supabaseServer } from "@/lib/supabase/server";

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
      <h1>出庫（FIFO：貸与 / 拠点振替 / 調整-）</h1>
      <IssueForm branches={branches ?? []} variants={variants ?? []} />
    </div>
  );
}
