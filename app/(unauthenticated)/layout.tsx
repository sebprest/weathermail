export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="w-full max-w-[400px] py-10">{children}</main>
    </div>
  );
}
