import { headers } from "next/headers";
import SignoutButton from "./SignoutButton";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    console.log("redirecting to login");
  }

  return (
    <div>
      Hi {session?.user?.name} 👋
      <SignoutButton />
    </div>
  );
}
