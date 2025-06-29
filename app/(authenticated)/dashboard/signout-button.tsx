"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { useTransition } from "react";

export default function SignoutButton() {
  const [isPending, startTransition] = useTransition();

  const Element = isPending ? Spinner : LogOut;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        startTransition(async () => {
          await signOut();
          redirect("/login");
        })
      }
    >
      <span className="sr-only">Sign out</span>
      <Element className="rounded-full" size="small" aria-hidden="true" />
    </Button>
  );
}
