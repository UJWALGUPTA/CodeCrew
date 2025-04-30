import { Loader2 } from "lucide-react";

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2 className={`animate-spin ${className || 'h-5 w-5'}`} />
  );
}

export function SpinnerFullPage() {
  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
      <Spinner className="h-8 w-8 text-primary" />
    </div>
  );
}