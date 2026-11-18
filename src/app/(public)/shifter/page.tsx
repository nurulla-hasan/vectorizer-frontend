import type { Metadata } from "next";
import ImageShifter from "@/components/shifter/ImageShifter";

export const metadata: Metadata = {
  title: "Image Shifter | TraceCraft",
  description:
    "Generate 5 pixel-shifted lossless PNG variations with uniform +50px canvas expansion for consistent vectorization.",
};

export default function ShifterPage() {
  return <ImageShifter />;
}
