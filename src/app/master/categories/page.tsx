import { supabaseServer } from "@/lib/supabase/server";
import CategoryCreateForm from "./ui/CategoryCreateForm";

export default async function CategoriesPage() {
  const { data: categories } = await supabaseServer
    .from("categories")
    .select("id,name")
    .order("name");

  return (
    <div className="grid">
      <h1 className="page-title">カテゴリマスタ</h1>
      <div className="card">
        <CategoryCreateForm />
      </div>
      <div className="card">
        <h3>登録済みカテゴリ</h3>
        <table>
          <thead>
            <tr>
              <th>カテゴリ名</th>
            </tr>
          </thead>
          <tbody>
            {(categories ?? []).map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}