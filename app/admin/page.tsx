import { redirect } from "next/navigation";
import { getSession } from "@/lib/server/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminIndex() {
  const session = await getSession();
  redirect(session ? "/admin/dashboard/" : "/admin/login/");
}
