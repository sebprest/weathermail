import { Cloud } from "lucide-react";
import SignoutButton from "./SignoutButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-blue-300" />
            <h1 className="text-xl font-semibold">WeatherMail</h1>
          </div>

          <div className="flex items-center gap-4">
            <SignoutButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto mt-8">{children}</main>
    </>
  );
}
