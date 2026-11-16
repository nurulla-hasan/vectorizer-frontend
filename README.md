# Bongaon Bazar (বনগাঁও বাজার)

An authentic Bangladeshi village food & artisanal pantry e-commerce storefront — bringing homemade shutki vorta, traditional achar, pure ghee, and Probashi family gift combos from Bongaon village to doorsteps across Bangladesh with **4–7 days nationwide Cash on Delivery (COD)**.

> **Current Stage:** UI/UX prototype powered by localized mock data (`src/data/mock-bazar.ts`), ready for backend API, persistent cart, and form-submission wiring.

---

## ✨ Key Features & Routes

- **`/` (Home):** Hero banner, category grid, featured products, category showcase, village story, 3-step Probashi ordering guide, customer reviews, and closing CTA.
- **`/products` (Catalog):** Filterable & sortable product catalog with category tabs and price range slider.
- **`/products/[slug]` (Product Detail):** Interactive image gallery, pack-size selector, quantity controls, highlights, and ingredients.
- **`/cart` (Shopping Cart):** Interactive quantity controls, item removal, empty-cart state, and sticky COD order summary.
- **`/checkout` (Checkout):** Cash on Delivery (COD) address form with sticky order summary.
- **`/order-success` (Order Confirmation):** Order reference and delivery window summary.
- **Bilingual (`bn` / `en`) & Theming:** Full Bangla & English localization via `next-intl` and Light/Dark mode support via `next-themes`.

---

## ⚡ Tech Stack

- **Framework:** Next.js `16.4.4` (App Router, Turbopack) & React `19.3.0`
- **Styling & UI:** Tailwind CSS v4, Shadcn UI (`@base-ui/react`), `lucide-react`, `framer-motion`
- **i18n & Theming:** `next-intl` (`messages/bn`, `messages/en`) & `next-themes`
- **Forms, State & API Ready:** TanStack React Query v5, TanStack Form + Zod v4, `ofetch`, Sonner toasts

---

## 📁 Project Structure

```text
├── messages/
│   ├── bn/                      # Bengali UI & page copy
│   └── en/                      # English UI & page copy
├── public/
│   └── images/                  # Brand logo, hero & product photography
├── src/
│   ├── app/                     # App Router pages (/, /products, /cart, /checkout, /order-success)
│   ├── components/
│   │   ├── card/                # ProductCard & ProductVisual
│   │   ├── common/              # Logo, PageWrapper, SectionHeading, toggles, etc.
│   │   ├── home/                # Home page sections
│   │   ├── layout/              # Navbar, DesktopNav, MobileNav, Footer
│   │   └── ui/                  # Shadcn / Base UI primitives
│   ├── data/
│   │   └── mock-bazar.ts        # Bilingual mock catalog, categories, reviews & cart preview
│   ├── lib/                     # Layout constants, API client, toast & error helpers
│   ├── services/                # API clients & React Query hooks
│   ├── types/                   # Shared TypeScript interfaces
│   └── validations/             # Zod v4 schemas
├── AGENTS.md                    # Project engineering & UI rules
└── next.config.ts               # Next.js configuration
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables (Optional for Prototype)

Copy `.env.example` to `.env.local` if connecting a backend API:

```bash
cp .env.example .env.local
```

### 3. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## 🛠️ Verification & Build

```bash
# TypeScript type-check
pnpm exec tsc --noEmit

# Linting
pnpm lint

# Production build
pnpm build
```

---

## 📄 License

MIT
