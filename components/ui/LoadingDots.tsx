export default function LoadingDots() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <span className="h-2 w-2 animate-in animate-out fade-in fade-out repeat-infinite duration-800 rounded-full bg-muted-foreground delay-0" />
      <span className="h-2 w-2 animate-in animate-out fade-in fade-out repeat-infinite duration-800 rounded-full bg-muted-foreground delay-200" />
      <span className="h-2 w-2 animate-in animate-out fade-in fade-out repeat-infinite duration-800 rounded-full bg-muted-foreground delay-400" />
    </div>
  );
}
