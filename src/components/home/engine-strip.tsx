import {
  Cpu,
  FileCode2,
  FileText,
  Pencil,
  PenTool,
  Ruler,
  ScanSearch,
  Scissors,
  Sparkles,
  Square,
  type LucideIcon,
} from "lucide-react";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

interface StripItem {
  icon: LucideIcon;
  label: string;
}

const STRIP_ITEMS: StripItem[] = [
  { icon: Sparkles, label: "Hybrid AI + Potrace" },
  { icon: Cpu, label: "Rust VTracer" },
  { icon: Square, label: "Split-canvas compare" },
  { icon: ScanSearch, label: "Cyan wireframe loupe" },
  { icon: Pencil, label: "Manual path editing" },
  { icon: Scissors, label: "Fragment cleanup" },
  { icon: FileCode2, label: "SVG" },
  { icon: FileText, label: "PDF" },
  { icon: PenTool, label: "EPS" },
  { icon: Ruler, label: "DXF" },
];

const STATS = [
  { value: "3", label: "tracing engines" },
  { value: "4", label: "export formats" },
  { value: "5", label: "free credits" },
  { value: "0", label: "design software" },
];

function StripGroup({ dataAttr }: { dataAttr?: string }) {
  return (
    <div
      data-marquee-dupe={dataAttr}
      className="flex shrink-0 items-center gap-8 pr-8"
    >
      {STRIP_ITEMS.map((item) => (
        <span
          key={item.label}
          className="flex items-center gap-2 text-sm whitespace-nowrap text-muted-foreground"
        >
          <item.icon className="size-4 text-primary" />
          {item.label}
          <span
            aria-hidden="true"
            className="ml-6 size-1 rotate-45 bg-border"
          />
        </span>
      ))}
    </div>
  );
}

export function EngineStrip() {
  return (
    <section
      aria-label="Capabilities and formats"
      className="relative border-b border-border/60 bg-background"
    >
      <div className="vk-edge-fade relative overflow-hidden py-5">
        <div className="vk-marquee flex w-max items-center">
          <StripGroup />
          <StripGroup dataAttr="dupe" />
        </div>
      </div>

      <div className="border-t border-border/60">
        <dl
          className={cn(
            "mx-auto grid w-full grid-cols-2 gap-x-6 gap-y-7 py-8 sm:grid-cols-4",
            CONTAINER_MAX_WIDTH,
            CONTAINER_GUTTER,
          )}
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left"
            >
              <dt className="order-2 text-xs tracking-wide text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="order-1 font-heading text-3xl font-bold tracking-tight text-foreground">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
