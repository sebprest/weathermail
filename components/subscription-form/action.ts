"use server";

import z from "zod/v4";
import { subscriptionFormSchema } from "./validation";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createSubscription({
  name,
  location,
  status,
}: z.infer<typeof subscriptionFormSchema>) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  await prisma.subscription.create({
    data: {
      name,
      status,
      user: {
        connect: {
          id: session.user.id,
        },
      },
      location: {
        connectOrCreate: {
          where: {
            name_latitude_longitude: {
              name: location.name,
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
          create: {
            latitude: location.latitude,
            longitude: location.longitude,
            name: location.name,
          },
        },
      },
    },
  });
}
