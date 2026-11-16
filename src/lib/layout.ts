export const CONTAINER_MAX_WIDTH = "max-w-360";
export const CONTAINER_GUTTER = "px-4 md:px-6";

// Shared warm surface so the sticky navbar and the hero read as one piece.
export const SURFACE_WARM = "bg-secondary";

// Navbar = announcement strip (sm+) + 4rem header. The strip is hidden on
// mobile, so below sm only the 4rem header sits above the page content.
export const HERO_HEIGHT =
  "min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-5.75rem)]";

// Short pages still fill the area below the sticky navbar.
export const PAGE_MIN_HEIGHT =
  "min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-5.75rem)]";

// Pages with internally-scrolling panes (messages) need a fixed height rather
// than a minimum, so the panes — and not the document — are the scrollers.
export const STICKY_HEIGHT =
  "h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5.75rem)]";
