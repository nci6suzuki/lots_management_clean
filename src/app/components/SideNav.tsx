"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups = [
  { title: "メイン", items: [
    ["/", "ダッシュボード"],
    ["/stocks", "在庫一覧"],
    ["/monthly", "月次費用振替"],
    ["/uniforms", "制服管理"],
  ]},
  { title: "入出庫", items: [
    ["/movements/receive", "入庫入力"],
    ["/movements/issue", "出庫入力"],
    ["/movements/transfer", "拠点振替"],
  ]},
  { title: "マスタ", items: [
    ["/master/items", "品目マスタ"],
    ["/master/variants", "サイズ管理"],
  ]},
] as const;

export default function SideNav() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="brand">在庫・制服管理</div>
      {groups.map((g) => (
        <div className="nav-group" key={g.title}>
          <div className="nav-title">{g.title}</div>
          {g.items.map(([href, label]) => (
            <Link key={href} href={href} className={`nav-link ${pathname === href ? "active" : ""}`}>
              {label}
            </Link>
          ))}
        </div>
      ))}
    </aside>
  );
}