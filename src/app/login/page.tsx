import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const current = await getCurrentUser();
  if (current) redirect("/");

  return <LoginForm />;
}