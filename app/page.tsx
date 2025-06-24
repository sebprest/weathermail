import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!!session) {
    return redirect("/dashboard/subscriptions");
  }

  return redirect("/login");
}
