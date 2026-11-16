export type ViewMode = "split" | "curtain" | "single";

export interface CameraState {
  scale: number;
  dx: number;
  dy: number;
}

export interface SamplePreset {
  id: string;
  label: string;
  description: string;
  fileName: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: "mountain-badge",
    label: "Mountain Supply Badge",
    description: "Layered peaks, sun disc & crisp geometric ring",
    fileName: "mountain-badge.png",
  },
  {
    id: "geometric-fox",
    label: "Geometric Fox Emblem",
    description: "Sharp angular facets & warm palette gradients",
    fileName: "geometric-fox.png",
  },
  {
    id: "studio-crest",
    label: "Vector Studio Crest",
    description: "Curves, circles & high-contrast typography shapes",
    fileName: "studio-crest.png",
  },
];

/**
 * Generate a crisp synthetic raster PNG File in-browser for instant sample testing.
 */
export async function createSampleImageFile(presetId: string): Promise<File> {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D context is unavailable");
  }

  ctx.clearRect(0, 0, size, size);

  if (presetId === "geometric-fox") {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(96, 112);
    ctx.lineTo(208, 176);
    ctx.lineTo(304, 176);
    ctx.lineTo(416, 112);
    ctx.lineTo(384, 320);
    ctx.lineTo(256, 420);
    ctx.lineTo(128, 320);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#fed7aa";
    ctx.beginPath();
    ctx.moveTo(128, 320);
    ctx.lineTo(256, 268);
    ctx.lineTo(384, 320);
    ctx.lineTo(256, 420);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(204, 248, 18, 0, Math.PI * 2);
    ctx.arc(308, 248, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(234, 344);
    ctx.lineTo(278, 344);
    ctx.lineTo(256, 376);
    ctx.closePath();
    ctx.fill();
  } else if (presetId === "studio-crest") {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "#4f46e5";
    ctx.beginPath();
    ctx.arc(256, 256, 188, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#06b6d4";
    ctx.beginPath();
    ctx.arc(256, 256, 134, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.moveTo(256, 132);
    ctx.lineTo(364, 344);
    ctx.lineTo(298, 344);
    ctx.lineTo(256, 256);
    ctx.lineTo(214, 344);
    ctx.lineTo(148, 344);
    ctx.closePath();
    ctx.fill();
  } else {
    // mountain-badge
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(256, 256, 190, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.arc(326, 174, 44, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.moveTo(76, 344);
    ctx.lineTo(198, 176);
    ctx.lineTo(318, 344);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(212, 344);
    ctx.lineTo(324, 208);
    ctx.lineTo(436, 344);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.moveTo(198, 176);
    ctx.lineTo(234, 226);
    ctx.lineTo(206, 214);
    ctx.lineTo(186, 232);
    ctx.lineTo(164, 222);
    ctx.closePath();
    ctx.fill();
  }

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) {
    throw new Error("Failed to create sample image");
  }

  const preset = SAMPLE_PRESETS.find((item) => item.id === presetId);
  return new File([blob], preset?.fileName || "sample.png", {
    type: "image/png",
  });
}
