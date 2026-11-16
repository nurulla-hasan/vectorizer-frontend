import { Shapes } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute size-16 animate-ping rounded-full bg-primary/15" />
        <div className="relative flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Shapes className="size-6 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
