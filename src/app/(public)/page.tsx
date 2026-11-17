import { VectorizerStudio } from "@/components/vectorizer/vectorizer-studio";
import { CONTAINER_GUTTER, CONTAINER_MAX_WIDTH } from "@/lib/layout";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className={cn("mx-auto py-8 sm:py-10", CONTAINER_MAX_WIDTH, CONTAINER_GUTTER)}>
      <VectorizerStudio />
    </div>
  );
}
