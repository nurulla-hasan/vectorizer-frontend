import { ImageUp, Layers, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className={cn("mx-auto py-16", CONTAINER_MAX_WIDTH, CONTAINER_GUTTER)}>
      <section className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="mr-1 size-3.5" />
          Raster to Vector Studio
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Convert Raster Images to Clean Vectors
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Upload PNG, JPG, or WebP artwork and inspect crisp, scalable vector
          paths with interactive zoom, split comparison, and export presets.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">
            <ImageUp className="mr-2 size-4" />
            Upload Image
          </Button>
          <Button variant="outline" size="lg">
            <Layers className="mr-2 size-4" />
            Try Sample
          </Button>
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Interactive Split View</CardTitle>
            <CardDescription>
              Compare original pixels side-by-side with fitted vector geometry.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Ready for dual-canvas or clip-path comparison and loupe inspection.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Precision Curves</CardTitle>
            <CardDescription>
              Smooth Béziers, crisp corners, and clean palette separation.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Built for logos, illustrations, icons, and print-ready artwork.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multi-Format Export</CardTitle>
            <CardDescription>
              Export clean SVG, PDF, EPS, and DXF output from one workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Starter template ready — plug in your vectorization engine next.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
