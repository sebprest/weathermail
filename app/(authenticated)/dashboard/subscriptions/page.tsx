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
import { redirect } from "next/navigation";
import NewSubscriptionButton from "./new-subscription-button";

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
