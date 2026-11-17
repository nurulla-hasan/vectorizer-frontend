import Link from "next/link";
import { ArrowRight, LifeBuoy } from "lucide-react";
import { FaqList, type FaqListItem } from "@/components/common/faq-list";
import { Badge } from "@/components/ui/badge";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

const FAQ_ITEMS: FaqListItem[] = [
  {
    value: "try-without-account",
    question: "Do I need an account to try it?",
    answer:
      "No — you can upload an image and explore the full interactive preview without signing in. An account is only required when you export, and new accounts start with 5 free credits.",
  },
  {
    value: "upload-formats",
    question: "Which image formats can I upload?",
    answer:
      "PNG, JPG, WebP, GIF, BMP, and TIFF files up to 5 MB. The studio also supports pasting images directly from the clipboard.",
  },
  {
    value: "export-formats",
    question: "What can I export?",
    answer:
      "Every export is a clean, scalable vector file: SVG for the web, PDF and EPS for print, and DXF for CAD and cutting workflows.",
  },
  {
    value: "credits",
    question: "How do credits work?",
    answer:
      "Each export uses one credit. Signing up grants 5 free credits immediately — no card required — and previewing or tuning traces never costs anything.",
  },
  {
    value: "detail-control",
    question: "Can I control how detailed the trace is?",
    answer:
      "Yes. The tuning sidebar lets you adjust color count, path smoothing, corner sharpening, and the tracing engine, with a live preview so you can see the result before exporting.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="relative overflow-hidden py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-muted/40"
      />
      <div
        aria-hidden="true"
        className="vk-dot-grid vk-dot-fade pointer-events-none absolute inset-0 opacity-30"
      />

      <div
        className={cn(
          "relative mx-auto w-full",
          CONTAINER_MAX_WIDTH,
          CONTAINER_GUTTER,
        )}
      >
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="self-start lg:sticky lg:top-24">
            <Badge variant="secondary">FAQ</Badge>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Questions, answered
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">
              Quick answers about uploads, exports, and credits.
            </p>

            <div className="mt-7 max-w-sm rounded-2xl border border-border/70 bg-card/80 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <LifeBuoy className="size-4 text-primary" />
                Still curious?
              </div>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                The fastest answer is trying it — the studio is open and needs
                no account.
              </p>
              <Link
                href="/studio"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Open the studio
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/80 p-2 shadow-sm sm:p-4">
            <FaqList items={FAQ_ITEMS} />
          </div>
        </div>
      </div>
    </section>
  );
}
