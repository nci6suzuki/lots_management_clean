import { supabaseServer } from "@/lib/supabase/server";
import BranchCreateForm from "./ui/BranchCreateForm";

export default async function BranchesPage() {
  const { data: branches } = await supabaseServer
    .from("branches")
    .select("id,code,name")
    .order("name");

  return (
    <div className="grid">
      <h1 className="page-title">拠点マスタ</h1>
      <div className="card">
        <BranchCreateForm />
      </div>
      <div className="card">
        <h3>登録済み拠点</h3>
        <table>
          <thead>
            <tr>
              <th>拠点コード</th>
              <th>拠点名</th>
            </tr>
          </thead>
          <tbody>
            {(branches ?? []).map((b) => (
              <tr key={b.id}>
                <td>{b.code}</td>
                <td>{b.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}