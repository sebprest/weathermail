import { betterAuth } from "better-auth";
import { createAuthClient } from "better-auth/react";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/lib/generated/prisma";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});

export const { signIn, signUp, useSession, signOut } = createAuthClient({
  baseURL: "http://localhost:3000",
});
