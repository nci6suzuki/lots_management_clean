"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";

type NavItem = { href: string; label: string; icon: string };

export default function SideNav({ isAdmin }: { isAdmin: boolean; email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const items: NavItem[] = [
    { href: "/", label: "メニュー", icon: "☷" },
    { href: "/equipment", label: "備品一覧", icon: "≣" },
    { href: "/movements/receive", label: "入出庫管理", icon: "▣" },
    { href: "/stocks", label: "在庫一覧", icon: "ⓘ" },
    { href: "/monthly", label: "月次費用", icon: "⌗" },
    ...(isAdmin ? [{ href: "/admin/users", label: "ユーザー管理", icon: "⚙" }] : []),
  ];

  const isActive = (href: string) => pathname === href || (href === "/movements/receive" && pathname.startsWith("/movements"));

  return (
    <aside className="icon-rail">
      <div className="rail-top">◫</div>
      <nav className="rail-nav">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className={`rail-link ${isActive(item.href) ? "active" : ""}`} title={item.label}>
            <span>{item.icon}</span>
          </Link>
        ))}
      </nav>
      <button
        className="rail-logout"
        title="ログアウト"
        onClick={async () => {
          await logout();
          router.push("/login");
          router.refresh();
        }}
      >
        ⎋
      </button>
    </aside>
  );
}