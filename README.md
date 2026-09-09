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
