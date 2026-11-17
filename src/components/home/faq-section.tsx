import { FaqList, type FaqListItem } from "@/components/common/faq-list";
import { SectionHeading } from "@/components/common/section-heading";
import { SectionWrapper } from "@/components/common/section-wrapper";

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
    <SectionWrapper id="faq" bg="muted" padding="lg">
      <SectionHeading
        badge="FAQ"
        title="Questions, answered"
        description="Quick answers about uploads, exports, and credits."
        descriptionClassName="mt-3"
      />

      <div className="mx-auto mt-8 max-w-3xl">
        <FaqList items={FAQ_ITEMS} />
      </div>
    </SectionWrapper>
  );
}
