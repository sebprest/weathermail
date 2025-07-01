"use client";

import SubscriptionForm from "@/components/subscription-form/subscription-form";
import { updateSubscription } from "@/components/subscription-form/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Prisma } from "@/lib/generated/prisma";
import { useState } from "react";

export default function EditSubscriptionButton({
  subscription,
}: {
  subscription: Prisma.SubscriptionGetPayload<{ include: { location: true } }>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="sm" className="cursor-pointer" asChild>
        <DialogTrigger>Edit</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogTitle>Edit Subscription</DialogTitle>
        <DialogDescription>Edit the subscription details</DialogDescription>
        <SubscriptionForm
          closeDialog={() => {
            setOpen(false);
          }}
          onSubmit={updateSubscription}
          id={subscription.id}
          defaultValues={subscription}
        />
      </DialogContent>
    </Dialog>
  );
}
