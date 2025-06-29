"use client"
import SubscriptionForm from "@/components/subscription-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function NewSubscriptionButton() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                <SubscriptionForm closeDialog={() => { setOpen(false) }} />
            </DialogContent>
        </Dialog>
    );
}