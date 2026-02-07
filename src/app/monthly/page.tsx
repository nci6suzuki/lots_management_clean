import MonthlyClient from "./ui/MonthlyClient";
import { requireUser } from "@/lib/auth";

export default async function Page() {
  await requireUser();
  return <div className="grid"><h1 className="page-title">月次費用振替</h1><div className="card"><MonthlyClient /></div></div>;
}
