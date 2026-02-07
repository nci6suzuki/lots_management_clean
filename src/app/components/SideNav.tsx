"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";

export default function SideNav({ isAdmin, email }: { isAdmin: boolean; email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const groups = [
    {
      title: "メイン",
      items: [
        ["/", "ダッシュボード"],
        ["/stocks", "在庫一覧"],
        ["/monthly", "月次費用振替"],
        ["/uniforms", "制服管理"],
      ],
    },
    {
      title: "入出庫",
      items: [
        ["/movements/receive", "入庫入力"],
        ["/movements/issue", "出庫入力"],
        ["/movements/transfer", "拠点振替"],
      ],
    },
    {
      title: "マスタ",
      items: [
        ["/master/items", "品目マスタ"],
        ["/master/categories", "カテゴリマスタ"],
        ["/master/variants", "サイズ管理"],
        ["/master/branches", "拠点マスタ"],
        ["/master/people", "貸与先マスタ"],
      ],
    },
    ...(isAdmin
      ? [
          {
            title: "管理",
            items: [["/admin/users", "ユーザー管理"]],
          },
        ]
      : []),
  ] as const;

  return (
    <aside className="sidebar">
      <div className="brand">在庫・制服管理</div>
      <div className="muted" style={{ marginBottom: 12 }}>{email}</div>
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
      <button onClick={async () => {
        await logout();
        router.push("/login");
        router.refresh();
      }}>ログアウト</button>
    </aside>
  );
}