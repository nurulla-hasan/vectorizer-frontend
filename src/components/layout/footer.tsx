import { Logo } from "@/components/common/logo";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div
        className={cn(
          "mx-auto flex flex-col items-center justify-between gap-4 py-8 sm:flex-row",
          CONTAINER_MAX_WIDTH,
          CONTAINER_GUTTER
        )}
      >
        <Logo size="sm" />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Vectorizer. Built with Next.js & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
