import Link from "next/link";
import { Layers, Shapes, Sparkles, Zap } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  {
    icon: Zap,
    title: "Instant tracing",
    description: "Turn PNG, JPG, or WebP files into clean vector paths in seconds.",
  },
  {
    icon: Layers,
    title: "Studio-grade exports",
    description: "Download crisp SVG, PDF, EPS, and DXF files ready for any workflow.",
  },
  {
    icon: Sparkles,
    title: "5 free credits",
    description: "Create an account and start exporting immediately — no card required.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-studio-surface lg:flex-row">
      {/* Dot-grid notebook background (same as Hero) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 vk-dot-grid opacity-40"
      />

      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-dashed border-studio-border/80 p-10 lg:flex lg:w-1/2 xl:p-14">

        <Link href="/" className="relative z-10 inline-flex items-center gap-2.5">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shapes className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-studio-foreground">
            TraceCraft
          </span>
        </Link>

        <div className="relative z-10 max-w-md space-y-6">
          <h2 className="font-heading text-4xl font-bold tracking-tight text-studio-foreground xl:text-5xl">
            Trace pixels into perfect vectors.
          </h2>
          <p className="text-base text-studio-muted">
            Upload a raster image and export clean, scalable artwork — no design
            software required.
          </p>

          <ul className="space-y-4 pt-2">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-studio-border bg-studio-panel text-trace">
                  <Icon className="size-4" />
                </span>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-studio-foreground">
                    {title}
                  </p>
                  <p className="text-sm text-studio-muted">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 font-mono text-xs text-studio-muted">
          © {new Date().getFullYear()} TraceCraft · Clean vectors, every time.
        </p>
      </aside>

      <section className="relative flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 p-4 sm:p-6">
          <Logo size="md" className="lg:invisible" />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="default"
              className="hidden sm:inline-flex"
              render={<Link href="/studio" />}
            >
              Back to studio
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pt-2 pb-10 sm:px-6">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </section>
    </div>
  );
}
