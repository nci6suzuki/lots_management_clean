import Link from "next/link";
import { requireUser } from "@/lib/auth";

export default async function Home() {
  await requireUser();
  const menus = [
    { href: "/master/items", label: "新規登録", icon: "✎" },
    { href: "/movements/receive", label: "入出庫管理", icon: "🕒" },
    { href: "/equipment", label: "備品検索", icon: "⌕" },
  ];
 
  return (
    <div className="grid">
      <h1 className="menu-title">メニュー</h1>
      <div className="menu-grid">
        {menus.map((menu) => (
          <Link href={menu.href} key={menu.href} className="menu-card">
            <div className="menu-icon">{menu.icon}</div>
            <div className="menu-label">{menu.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
