import { supabaseServer } from "@/lib/supabase/server";
import UniformClient from "./ui/UniformClient";

export default async function Page() {
  const [{ data: branches }, { data: people }, { data: variants }, { data: lendings }, { data: histories }] = await Promise.all([
    supabaseServer.from("branches").select("id,name").order("name"),
    supabaseServer.from("people").select("id,name").order("name"),
    supabaseServer.from("item_variants").select("id,size,items(id,item_code,name,is_uniform)").eq("is_active", true),
    supabaseServer.from("uniform_lendings").select("id,lent_at,returned_at,note,people(name),item_variants(size,items(item_code,name))").is("returned_at", null).order("lent_at", { ascending: false }),
    supabaseServer.from("uniform_lendings").select("id,lent_at,returned_at,note,people(name),item_variants(size,items(item_code,name))").not("returned_at", "is", null).order("returned_at", { ascending: false }).limit(20),
  ]);

  const uniformVariants = (variants ?? []).filter((v: any) => v.items?.is_uniform);

  return <div className="grid"><h1 className="page-title">制服管理</h1><div className="card"><UniformClient branches={branches ?? []} people={people ?? []} variants={uniformVariants as any} unreturned={lendings ?? []} histories={histories ?? []} /></div></div>;
}
