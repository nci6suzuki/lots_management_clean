export const dynamic = "force-dynamic";
import "./globals.css";
import SideNav from "./components/SideNav";
import { getCurrentUser } from "@/lib/auth";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="ja">
      <body>
        {currentUser ? (
          <div className="app-shell">
            <SideNav isAdmin={currentUser.role === "admin"} email={currentUser.email} />
            <main className="main">{children}</main>
          </div>
        ) : (
          <main className="main">{children}</main>
        )}
      </body>
    </html>
  );
}