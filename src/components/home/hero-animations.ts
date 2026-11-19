import type { Variants } from "framer-motion";

export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const leftContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO },
  },
};

export const pipelineContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
};

export const pipelineItemVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: EASE_OUT_EXPO },
  },
};

export const PIPELINE_STEPS = [
  { label: "PNG / JPG", color: "border-sky-400 text-sky-400" },
  { label: "Trace", color: "border-violet-400 text-violet-400" },
  { label: "Bezier", color: "border-pink-400 text-pink-400" },
  { label: "SVG", color: "border-amber-400 text-amber-400" },
  { label: "PDF", color: "border-emerald-400 text-emerald-400" },
  { label: "DXF", color: "border-cyan-400 text-cyan-400" },
];

export const PALETTE_SWATCHES = [
  { hex: "#F6D55C", name: "Yellow" },
  { hex: "#FB923C", name: "Amber" },
  { hex: "#38BDF8", name: "Sky" },
  { hex: "#4ADE80", name: "Mint" },
  { hex: "#F472B6", name: "Rose" },
];

export const CARD_TABS = [
  { num: "01", label: "Split Compare", active: false },
  { num: "02", label: "Bezier Curves", active: true },
  { num: "03", label: "Wireframe Loupe", active: false },
  { num: "04", label: "Path Editor", active: false },
];

export const AVATAR_COLORS = [
  "bg-amber-400 text-primary-foreground",
  "bg-sky-400 text-primary-foreground",
  "bg-emerald-400 text-primary-foreground",
  "bg-pink-400 text-primary-foreground",
  "bg-violet-400 text-primary-foreground",
];

export const BOTTOM_HIGHLIGHTS = [
  {
    num: "01",
    title: "Drop any raster",
    desc: "PNG, JPG, WebP up to 50MP",
    accent: "text-sky-400",
  },
  {
    num: "02",
    title: "Vectorizer API trace",
    desc: "Sub-pixel cubic Bezier fitting",
    accent: "text-primary",
  },
  {
    num: "03",
    title: "Loupe & path editor",
    desc: "Inspect nodes & tweak colors live",
    accent: "text-pink-400",
  },
  {
    num: "04",
    title: "Production exports",
    desc: "Clean SVG, PNG 4×, PDF, EPS, DXF",
    accent: "text-emerald-400",
  },
];
