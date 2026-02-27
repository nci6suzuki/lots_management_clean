export const dynamic = "force-dynamic";
import "./globals.css";
import SideNav from "./components/SideNav";
import TopBar from "./components/TopBar";
import { getCurrentUser } from "@/lib/auth";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="ja">
      <body>
        {currentUser ? (
          <div className="app-shell appsheet-shell">
            <SideNav isAdmin={currentUser.role === "admin"} email={currentUser.email} />
            <div className="appsheet-main">
              <TopBar email={currentUser.email} />
              <main className="main appsheet-content">{children}</main>
            </div>
          </div>
        ) : (
          <main className="main">{children}</main>
        )}
      </body>
    </html>
  );
}