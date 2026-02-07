import ReceiveForm from "./ui/ReceiveForm";
import { supabaseServer } from "@/lib/supabase/server";

export default async function Page() {
  const [{ data: branches }, { data: variants }] = await Promise.all([
    supabaseServer.from("branches").select("id,name").order("name"),
    supabaseServer.from("item_variants").select("id,size,items(id,item_code,name,is_uniform)").eq("is_active", true),
  ]);
  return <div className="grid"><h1 className="page-title">入出庫入力 / 入庫</h1><div className="card"><ReceiveForm branches={branches as any ?? []} variants={variants as any ?? []} /></div></div>;
}