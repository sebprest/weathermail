import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import SubscriptionTable from "./subscription-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import SubscriptionForm from "@/app/(authenticated)/_components/subscription-form";
import { DialogTitle } from "@radix-ui/react-dialog";
import { redirect } from "next/navigation";

function NewSubscriptionButton() {
  "use client";

  return (
    <Dialog>
      <Button className="cursor-pointer" asChild>
        <DialogTrigger>
          <Plus className="mr-2 h-4 w-4" />
          New subscription
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogTitle>New Subscription</DialogTitle>
        <DialogDescription className="sr-only">
          Create a new subscription
        </DialogDescription>
        <SubscriptionForm />
      </DialogContent>
    </Dialog>
  );
}

export default async function SubscriptionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return redirect("/login");
  }

  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      location: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Card>
      <CardHeader className="flex items-center justify-between flex-col sm:flex-row">
        <div>
          <CardTitle>Email Subscriptions</CardTitle>
          <CardDescription>
            Manage all weather email subscriptions
          </CardDescription>
        </div>
        <NewSubscriptionButton />
      </CardHeader>
      <CardContent>
        <SubscriptionTable subscriptions={subscriptions} />
      </CardContent>
    </Card>
  );
}
