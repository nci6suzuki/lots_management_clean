import MonthlyClient from "./ui/MonthlyClient";

export default function Page() {
  return (
    <div style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>月次費用振替</h1>
      <MonthlyClient />
    </div>
  );
}
