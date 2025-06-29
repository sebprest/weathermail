import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { $Enums, Subscription } from "@/lib/generated/prisma";

function StatusBadge({ status }: { status: $Enums.SubscriptionStatus }) {
  const baseStyles =
    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset";

  if (status === $Enums.SubscriptionStatus.active) {
    return (
      <span
        className={`${baseStyles} bg-green-100 text-green-800 ring-green-200`}
      >
        Active
      </span>
    );
  }
  if (status === $Enums.SubscriptionStatus.inactive) {
    return (
      <span
        className={`${baseStyles} bg-yellow-100 text-yellow-800 ring-yellow-200`}
      >
        Inactive
      </span>
    );
  }
  return (
    <span className={`${baseStyles} bg-gray-100 text-gray-800 ring-gray-200`}>
      Unknown
    </span>
  );
}

export default async function SubscriptionTable({
  subscriptions,
}: {
  subscriptions: (Subscription & { location: { name: string } })[];
}) {
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-2">
        <div className="text-lg">No subscriptions yet!</div>
        <div className="text-gray-500">Why not create one?</div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.map((subscription) => (
          <TableRow key={subscription.id}>
            <TableCell>{subscription.name}</TableCell>
            <TableCell>{subscription.location.name}</TableCell>
            <TableCell>
              <StatusBadge status={subscription.status} />
            </TableCell>
            <TableCell className="flex items-center space-x-2 justify-end">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="pr-0 cursor-pointer">
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
