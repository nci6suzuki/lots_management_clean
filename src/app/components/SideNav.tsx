"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";
import type { ReactNode } from "react";

type NavItem = { href: string; label: string; icon: "home" | "box" | "swap" | "chart" | "calendar" | "users" };

function RailIcon({ name }: { name: NavItem["icon"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  const iconMap: Record<NavItem["icon"], ReactNode> = {
    home: <path d="M3 10.2L12 3l9 7.2M5.5 9.5V21h13V9.5" {...common} />,
    box: (
      <>
        <path d="M12 3l8 4.4v9.2L12 21 4 16.6V7.4L12 3z" {...common} />
        <path d="M4 7.4L12 12l8-4.6M12 12v9" {...common} />
      </>
    ),
    swap: (
      <>
        <path d="M4 8h13" {...common} />
        <path d="M14 4l4 4-4 4" {...common} />
        <path d="M20 16H7" {...common} />
        <path d="M10 12l-4 4 4 4" {...common} />
      </>
    ),
    chart: (
      <>
        <path d="M4 20h16" {...common} />
        <path d="M7 17v-5M12 17V7M17 17v-8" {...common} />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="16" rx="2" {...common} />
        <path d="M8 3v4M16 3v4M4 10h16" {...common} />
      </>
    ),
    users: (
      <>
        <path d="M15 19v-1.2c0-2.1-1.8-3.8-4-3.8s-4 1.7-4 3.8V19" {...common} />
        <circle cx="11" cy="9" r="2.8" {...common} />
        <path d="M19.5 19v-1c0-1.5-1-2.7-2.4-3.2" {...common} />
        <path d="M16.5 6.8a2.3 2.3 0 010 4.4" {...common} />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className="rail-icon" aria-hidden="true">
      {iconMap[name]}
    </svg>
  );
}

export default function SideNav({ isAdmin }: { isAdmin: boolean; email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const items: NavItem[] = [
    { href: "/", label: "メニュー", icon: "home" },
    { href: "/equipment", label: "備品一覧", icon: "box" },
    { href: "/movements/receive", label: "入出庫管理", icon: "swap" },
    { href: "/stocks", label: "在庫一覧", icon: "chart" },
    { href: "/monthly", label: "月次費用", icon: "calendar" },
    ...(isAdmin ? [{ href: "/admin/users", label: "ユーザー管理", icon: "users" as const }] : []),
  ];

  const isActive = (href: string) => pathname === href || (href === "/movements/receive" && pathname.startsWith("/movements"));

  return (
    <aside className="icon-rail">
      <div className="rail-top" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="rail-icon rail-logo"><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></svg>
      </div>
      <nav className="rail-nav">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className={`rail-link ${isActive(item.href) ? "active" : ""}`} title={item.label}>
            <RailIcon name={item.icon} />
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
        <svg viewBox="0 0 24 24" className="rail-icon" aria-hidden="true"><path d="M10 17l-5-5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 12h9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><path d="M19 5v14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>
    </aside>
  );
}