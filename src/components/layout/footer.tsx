import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

const PRODUCT_LINKS = [
  { href: "/studio", label: "Studio" },
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
];

const EXPORT_FORMATS = ["SVG", "PDF", "EPS", "DXF"];

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 bg-muted/30">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <div
        className={cn(
          "mx-auto flex w-full flex-col gap-10 py-10 sm:py-12",
          CONTAINER_MAX_WIDTH,
          CONTAINER_GUTTER,
        )}
      >
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs space-y-3">
            <Logo size="sm" />
            <p className="text-sm leading-6 text-muted-foreground">
              Raster-to-vector studio with split-canvas comparison, wireframe
              loupe, and hand-editable paths.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <nav aria-label="Product" className="space-y-2.5">
              <p className="text-xs font-semibold tracking-wider text-foreground uppercase">
                Product
              </p>
              {PRODUCT_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="space-y-2.5">
              <p className="text-xs font-semibold tracking-wider text-foreground uppercase">
                Exports
              </p>
              {EXPORT_FORMATS.map((format) => (
                <span
                  key={format}
                  className="block font-mono text-sm text-muted-foreground"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Vectorizer. Built with Next.js &
            Tailwind CSS.
          </p>
          <p className="text-xs text-muted-foreground">
            Designed for clean vectors.
          </p>
        </div>
      </div>
    </footer>
  );
}
