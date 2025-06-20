"use client";

import { Button } from "@/components/ui/button";
import LoadingDots from "@/components/ui/LoadingDots";
import { signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { useTransition } from "react";

export default function SignoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() =>
        startTransition(async () => {
          await signOut();
          redirect("/login");
        })
      }
    >
      {isPending ? <LoadingDots /> : "Sign out"}
    </Button>
  );
}
