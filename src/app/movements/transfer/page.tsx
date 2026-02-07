import { supabaseServer } from "@/lib/supabase/server";
import TransferForm from "./ui/TransferForm";

export default async function Page() {
  const [{ data: branches }, { data: variants }] = await Promise.all([
    supabaseServer.from("branches").select("id,name").order("name"),
    supabaseServer.from("item_variants").select("id,size,items(id,item_code,name)").eq("is_active", true),
  ]);
  return <div className="grid"><h1 className="page-title">拠点振替</h1><div className="card"><TransferForm branches={branches as any ?? []} variants={variants as any ?? []} /></div></div>;
}