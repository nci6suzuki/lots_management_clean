export const dynamic = "force-dynamic";
import "./globals.css";
import SideNav from "./components/SideNav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div className="app-shell">
          <SideNav />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}