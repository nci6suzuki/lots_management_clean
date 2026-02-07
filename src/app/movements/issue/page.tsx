import IssueForm from "./ui/IssueForm";
import { supabaseServer } from "@/lib/supabase/server";

export default async function Page() {
  const [{ data: branches }, { data: variants }] = await Promise.all([
    supabaseServer.from("branches").select("id,name").order("name"),
    supabaseServer.from("item_variants").select("id,size,items(id,item_code,name)").eq("is_active", true),
  ]);
  return <div className="grid"><h1 className="page-title">入出庫入力 / 出庫</h1><div className="card"><IssueForm branches={branches as any ?? []} variants={variants as any ?? []} /></div></div>;
}