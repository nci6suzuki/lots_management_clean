"use client";

import { usePathname } from "next/navigation";

const searchPlaceholderMap: Record<string, string> = {
  "/": "Search メニュー",
  "/equipment": "Search 備品一覧",
  "/stocks": "Search 在庫一覧",
  "/movements/issue": "Search 入出庫管理",
  "/movements/receive": "Search 入出庫管理",
  "/movements/transfer": "Search 入出庫管理",
};

export default function TopBar({ email }: { email: string }) {
  const pathname = usePathname();
  const placeholder = searchPlaceholderMap[pathname] ?? "Search";

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn" aria-label="menu">☰</button>
        <div className="topbar-title">備品管理2025</div>
      </div>

      <div className="topbar-search-wrap">
        <span className="topbar-search-icon">⌕</span>
        <input className="topbar-search" placeholder={placeholder} readOnly />
      </div>

      <div className="topbar-right">
        <button className="icon-btn" aria-label="reload">↻</button>
        <div className="avatar" title={email}>{(email?.[0] ?? "U").toUpperCase()}</div>
      </div>
    </header>
  );
}