import { supabaseServer } from "@/lib/supabase/server";
import PersonCreateForm from "./ui/PersonCreateForm";

export default async function PeoplePage() {
  const { data: people } = await supabaseServer
    .from("people")
    .select("id,code,name")
    .order("name");

  return (
    <div className="grid">
      <h1 className="page-title">貸与先マスタ</h1>
      <div className="card">
        <PersonCreateForm />
      </div>
      <div className="card">
        <h3>登録済み貸与先</h3>
        <table>
          <thead>
            <tr>
              <th>貸与先コード</th>
              <th>貸与先名</th>
            </tr>
          </thead>
          <tbody>
            {(people ?? []).map((p) => (
              <tr key={p.id}>
                <td>{p.code}</td>
                <td>{p.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}