import Link from "next/link";
import { PenLine } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PageWrapper } from "@/components/common/page-wrapper";
import { Button } from "@/components/ui/button";

export default function StudioPage() {
  return (
    <PageWrapper className="flex flex-1 items-center justify-center">
      <EmptyState
        icon={<PenLine className="size-6" />}
        title="Vector Studio is under construction"
        description="The image-to-vector workflow is being rebuilt from scratch. Check back soon for the new studio."
        action={
          <Button render={<Link href="/" />}>
            <span>Back to home</span>
          </Button>
        }
      />
    </PageWrapper>
  );
}
