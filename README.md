# 1ShopNepal

A MERN stack e-commerce application built for BSc CSIT 6th Semester Laboratory Project.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js, MongoDB, Mongoose

## Project Structure

```
ecommerce/
├── frontend/          # React frontend (Vite)
│   └── src/
│       ├── components/    # Reusable UI components
│       │   ├── common/    # Generic components (Button, Input, etc.)
│       │   └── layout/    # Layout components (Navbar, Footer, Sidebar)
│       ├── pages/         # Page-level components (Home, Products, Cart)
│       ├── layouts/       # Page layout wrappers
│       ├── context/       # React Context providers (Auth, Cart)
│       ├── hooks/         # Custom React hooks
│       ├── services/      # API service functions
│       ├── utils/         # Helper/utility functions
│       └── assets/        # Static files (images, icons)
│
└── backend/           # Express API server
    ├── config/        # DB connection, environment config
    ├── controllers/   # Route handler logic
    ├── middleware/     # Custom Express middleware
    ├── models/        # Mongoose schemas and models
    ├── routes/        # API route definitions
    ├── services/      # Business logic / external service calls
    └── utils/         # Helper/utility functions
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
cp .env.example .env   # Configure your MongoDB URI
npm run dev
```

## SEO Features

1ShopNepal is a client-side rendered React SPA (Vite + React Router), so all SEO that can be
implemented in that architecture is implemented here.

### Dynamic metadata (client-side)

A reusable `<Seo />` component (`frontend/src/components/common/Seo.jsx`) backed by
`frontend/src/utils/seo.js` updates the document head on every navigation:

- **Dynamic page titles** — e.g. `Product Name | 1Shop Nepal`
- **Meta descriptions** — auto-truncated to ~160 characters
- **Canonical URLs** — `rel="canonical"` built from the site origin + canonical path
- **Open Graph metadata** — `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:site_name`
- **Twitter Card metadata** — `summary_large_image` when an image is available
- **`robots` meta** — `noindex, nofollow` on account/checkout/payment/admin pages

### Page coverage

| Page | Title | Notes |
| --- | --- | --- |
| Home | `1Shop Nepal — Nepal's One-Stop Online Shopping Store` | WebSite + Organization JSON-LD (`@graph`), SearchAction |
| Products | `Shop All Products` / `Search: <term>` / `<Category>` | canonical points to `/products` (query params stripped) |
| Category | `<Category name> \| 1Shop Nepal` | category image used as `og:image`, BreadcrumbList JSON-LD |
| Product details | `<Product name> \| 1Shop Nepal` | description from product, Product + BreadcrumbList JSON-LD |
| Login / Register / Cart / Cart-related pages | static titles | indexed |
| Account / Orders / Wishlist / Checkout / Order success / Payment pages | static titles | `noindex` |

### SEO-friendly product slugs

Products already store a URL-safe `slug` (generated from the name on create/update,
`backend/utils/generateSlug.js`). Product pages are reachable by both slug and legacy ObjectId:

- `GET /api/products/:id` now resolves either a 24-hex ObjectId **or a slug** (falling back to
  `findOne({ slug })`), so old `/products/<id>` links keep working.
- The catalog now links to `/products/<slug>` (ProductCard, cart items, wishlist, recommendations).
- Canonical URLs and the sitemap use the slug form.

### Semantic HTML

- `MainLayout` wraps routed content in `<main>`, with existing `nav`/`header`/`footer` landmarks.
- Product cards render as `<article>`.
- Breadcrumbs on product and checkout pages use `aria-label="Breadcrumb"`.

### robots.txt and sitemap.xml

- **Frontend** ships `frontend/public/robots.txt` (copied into the build) that allows crawling,
  blocks `/admin`, `/checkout`, `/payment/` and `/api/`, and points to `/sitemap.xml`.
- **Backend** serves both files dynamically (`backend/controllers/seoController.js`,
  `routes/seoRoutes.js`, mounted in `app.js`):
  - `GET /sitemap.xml` — XML sitemap with static pages, every category (`/categories/<slug>`) and
    every product (`/products/<slug>`, with `lastmod`). Base URL comes from the `CLIENT_URL` env var.
  - `GET /robots.txt` — robots file with an absolute `Sitemap:` URL for the crawler origin.
- In production the frontend and backend should be served behind a single origin (or reverse
  proxied) so `robots.txt` / `sitemap.xml` are reachable at the site root.

### Structured data (schema.org)

Injected as JSON-LD into `<head>` (`<script id="seo-jsonld">`), replaced on every navigation:

- **Home:** `WebSite` (with `SearchAction`) + `Organization`
- **Product details:** `Product` (name, image, description, brand, sku) + `Offer` (price in `NPR`,
  `InStock`/`OutOfStock`, `NewCondition`) + `aggregateRating` (rating + reviewCount) +
  `BreadcrumbList`
- **Category:** `BreadcrumbList`

---

## Phase 24 — Complete Application Testing

End-to-end tests were executed against the running application (backend API on
`http://localhost:5000`, MongoDB Atlas, Khalti in **mock** mode because no secret key is set).

**Method.** Because every customer and admin flow in the UI is backed by the REST API, the full
test suite was run as scripted API transactions (`Invoke-RestMethod`, PowerShell) covering the
actual register → … → logout journey a real user performs, plus the complete admin workflow.
The Khalti flow was exercised through the built-in development **mock gateway**
(`KHALTI_SECRET_KEY` empty), which simulates a successful payment.

**Test accounts created for this run**
- Customer: `phase<timestamp>.cust@test.com` / `Customer@123`
- Admin: `admin.test@1shopnepal.com` / `Admin@123` (role granted directly in the DB)

### Summary

| Area | Tests | Passed | Failed |
| --- | --- | --- | --- |
| Customer flows (C1–C17) | 17 | 17 | 0 |
| Admin flows (A1–A13) | 13 | 13 | 0 |
| Edge cases / security (E1–E10) | 15 | 15 | 0 |
| Deep edge probes (P1–P7) | 7 | 7 | 0 |
| **Total** | **52** | **52** | **0** |

### Bugs found & fixed

| ID | Bug | Impact | Fix |
| --- | --- | --- | --- |
| BUG-1 | `DELETE /api/categories/:id` silently deleted a category **even while it still contained products** (`categoryController.deleteCategory` removed the document unconditionally) | All products in that category were orphaned (dangling `category` reference): they disappeared from category filtering and rendered on product pages with no category. Reproduced, then the affected seeded data was restored. | `deleteCategory` now checks `Product.countDocuments({ category })` and rejects deletion with **HTTP 400** — `Category "<name>" has N product(s). Move or delete them before removing this category.` Fixed in `backend/controllers/categoryController.js`. |

No other defects were found. All 52 test cases pass after the fix (category deletion with active
products returns 400 and leaves the category + products intact).

### Customer tests

| Test Case | Expected Result | Actual Result | Status |
| --- | --- | --- | --- |
| C1 — Register a new account | 201, token returned | 201, role=customer | ✅ PASS |
| C2 — Login with credentials | 200, token returned | 200, role=customer | ✅ PASS |
| C3 — Browse categories | 200, ≥ 6 categories | 200, count=6 | ✅ PASS |
| C4 — Search products ("phone") | 200, matching results | 200, total=3 | ✅ PASS |
| C5 — Filter products (category + price + sort + in-stock) | 200, filters applied | 200, total=4 | ✅ PASS |
| C6 — View product details | 200, product returned | 200, "Iphone 16 pro max" | ✅ PASS |
| C7 — Add product to wishlist | 201, count=1 | 201, count=1 | ✅ PASS |
| C8 — Remove wishlist item | 200, count=0 | 200, count=0 | ✅ PASS |
| C9 — Add product to cart | 201, added | 201 | ✅ PASS |
| C10 — Change cart quantity | 200, qty=3 | 200, qty=3 | ✅ PASS |
| C11 — Remove cart item | 200, cart empty | 200, items=0 | ✅ PASS |
| C12 — Checkout & place order (COD) | 201, order created | 201, total=215000, status=pending | ✅ PASS |
| C13 — Khalti payment initiate (mock) | 200, mock payment URL | 200, mode=mock, pidx issued | ✅ PASS |
| C14 — Complete / verify payment | 200, paid + confirmed | 200, pay=paid, status=confirmed | ✅ PASS |
| C15 — View placed order | 200, order returned | 200, id matches | ✅ PASS |
| C16 — Review purchased product | 201, review created | 201, rating=5 | ✅ PASS |
| C17 — Logout | Protected route rejects no token | 401 | ✅ PASS |

### Admin tests

| Test Case | Expected Result | Actual Result | Status |
| --- | --- | --- | --- |
| A1 — Admin login | 200, role=admin | 200, role=admin | ✅ PASS |
| A2 — Dashboard stats | 200, stats object | 200, products=24 | ✅ PASS |
| A3 — Create category | 201, category created | 201, slug issued | ✅ PASS |
| A4 — Edit category | 200, name updated | 200, "… Updated" | ✅ PASS |
| A5 — Delete category | 200, deleted | 200, deleted successfully | ✅ PASS |
| A6 — Create product | 201, product created | 201, stock=12 | ✅ PASS |
| A7 — Edit product | 200, price updated | 200, price=2200 | ✅ PASS |
| A8 — Delete product | 200, deleted | 200, deleted successfully | ✅ PASS |
| A9 — Update stock | 200, stock=5 | 200, stock=5 | ✅ PASS |
| A10 — View orders | 200, order list | 200, count matches DB | ✅ PASS |
| A11 — Update order status | 200, status=shipped → delivered | 200, both transitions OK | ✅ PASS |
| A12 — View users | 200, user list | 200, count=7 | ✅ PASS |
| A13 — Manage reviews (list + delete) | 200, list + 200 removed | 200 / 200 "Review removed" | ✅ PASS |

### Edge-case & security tests

| Test Case | Expected Result | Actual Result | Status |
| --- | --- | --- | --- |
| E1 — Invalid login (wrong password) | 401 | 401 | ✅ PASS |
| E2 — Duplicate registration (same email) | 400 | 400 | ✅ PASS |
| E3a — Protected route without token | 401 | 401 | ✅ PASS |
| E3b — Invalid / tampered token | 401 | 401 | ✅ PASS |
| E4a — Customer calls admin stats API | 403 | 403 | ✅ PASS |
| E4b — Customer creates a category | 403 | 403 | ✅ PASS |
| E4c — Customer updates order status | 403 | 403 | ✅ PASS |
| E5 — Place order with empty cart | 400 | 400 | ✅ PASS |
| E6 — Add out-of-stock product to cart | 400 | 400 | ✅ PASS |
| E6b — Cart quantity above stock | 400 / not-in-cart | 404 "Item is not in the cart" | ✅ PASS |
| E7a — Non-existent product ID | 404 | 404 | ✅ PASS |
| E7b — Invalid product ID format | 404 | 404 | ✅ PASS |
| E8 — Invalid / non-existent order ID | 404 | 404 | ✅ PASS |
| E9a — Verify unknown payment session | 404 | 404 | ✅ PASS |
| E9b — Initiate payment on already-paid order | 400 | 400 | ✅ PASS |
| E10 — Unknown API route (network/API failure fallback) | 404 JSON | 404 | ✅ PASS |

### Deep edge probes

| Test Case | Expected Result | Actual Result | Status |
| --- | --- | --- | --- |
| P1 — Delete category **with** products | 400, refused | **Pre-fix 200 + category removed (BUG-1). Post-fix 400, refused** | ✅ PASS (fixed) |
| P2 — Products must stay linked after category deletion attempt | Category + products intact | 400 on delete, product still links to category | ✅ PASS |
| P3 — Cancelling a COD order restores stock | stock restored (+qty) | before=2 → after=3 | ✅ PASS |
| P4 — Double-cancel does not double-restock | stock restores once only | remains 3 | ✅ PASS |
| P5 — Disabled user login is blocked | 401 | 401 | ✅ PASS |
| P6 — Admin cannot self-demote | 400 | 400 | ✅ PASS |
| P7 — Duplicate product review is blocked | 400 | 400 | ✅ PASS |
