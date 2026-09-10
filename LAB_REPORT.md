# Lab Report — 1ShopNepal E-Commerce Application

<!--
  Replace the placeholder fields below with your own details before submission.
  TODO: Name, Roll No., Institution, Date
-->

| Field | Details |
|---|---|
| **Project Title** | 1ShopNepal — A Full-Stack E-Commerce Web Application |
| **Submitted By** | ________________________________________ |
| **Roll No.** | ____________________ |
| **Class / Semester** | B.Sc. CSIT, 6th Semester |
| **Submission Date** | ____________________ |

---

## 1. Introduction

**1ShopNepal** is a full-stack e-commerce web application built as a B.Sc. CSIT 6th Semester
laboratory project. It allows customers to browse an online catalog, search and filter products,
manage a shopping cart and wishlist, write reviews and ratings, and complete purchases using
**Cash on Delivery (COD)** or the **eSewa** online wallet via the official **eSewa ePay (V2)**
payment gateway, integrated and verified against the real eSewa **TEST/sandbox** environment. The
application also provides an administrator panel for managing products, categories, orders, users,
and reviews.

The project demonstrates a modern **MERN (MongoDB, Express.js, React, Node.js)** architecture with a
RESTful API backend and a responsive single-page-application (SPA) frontend. It covers end-to-end
e-commerce functionality: **authentication, catalog management, shopping cart, wishlist, product
reviews/ratings, checkout, eSewa payment, and order management**, with all price calculations and
stock control handled securely on the server.

Technical terms used in this report:

- **MERN stack** — a popular combination of four technologies: MongoDB (database), Express.js
  (backend framework), React (frontend library), and Node.js (server runtime).
- **REST API** — a style of web API where the client sends HTTP requests (GET, POST, PUT, DELETE)
  to URLs and receives JSON data in response.
- **JWT** — **J**SON **W**eb **T**oken, a small signed text token used to remember that a user is
  logged in without keeping session state on the server.
- **ODM** — **O**bject-**D**ocument **M**apper (Mongoose here); it lets us define database schemas
  and write queries in JavaScript instead of raw MongoDB commands.
- **SPA** — **S**ingle-**P**age **A**pplication; the browser loads the page once and React then
  swaps components in and out as the user navigates.

## 2. Objectives

1. To design and build a complete client–server e-commerce system using the MERN stack.
2. To implement secure user authentication and role-based authorization (customer vs. admin).
3. To provide a browsable, searchable, and filterable product catalog with category organization.
4. To implement a shopping cart and wishlist with real-time quantity and stock validation.
5. To support product reviews and ratings with automatically computed average ratings.
6. To implement a checkout flow for **Cash on Delivery** and **eSewa** (ePay V2, TEST sandbox)
   payments with server-side price calculation, inventory reduction, and order tracking statuses.
7. To provide an admin interface for managing products, categories, orders, users, and reviews.
8. To add a rule-based **product recommendation** feature and basic **SEO** (metadata, sitemap,
   robots.txt).

## 3. Tools & Technologies

| Technology | Version | Purpose |
|---|---|---|
| **MongoDB** (Atlas) | — | NoSQL document database |
| **Mongoose** | 8.6 | ODM for MongoDB — schemas, validation, queries |
| **Express.js** | 4.21 | HTTP server & REST API framework |
| **Node.js** | 24 | JavaScript runtime (backend) |
| **React** | 19.2 | Frontend UI library |
| **Vite** | 7.3 | Frontend build tool / dev server |
| **Tailwind CSS** | 4.3 | Utility-first CSS styling |
| **React Router** | 7.18 | Client-side routing |
| **lucide-react** | 1.43 | Icon library |
| **react-toastify** | 11.1 | Toast / notification messages |
| **jsonwebtoken + bcrypt** | 9 / 6 | Authentication & password hashing |
| **Multer** | 2.x | Profile image upload (stored locally) |
| **CORS + dotenv** | 2.x / 16.x | Cross-origin access & configuration |

## 4. System Architecture

The application follows a **three-tier client–server architecture**:

```
┌────────────────────┐       HTTP/JSON (REST)        ┌─────────────────────────────────┐
│   React Frontend   │ ────────────────────────────► │   Express API (Node.js)          │
│   (Vite + Tailwind)│ ◄──────────────────────────── │   Controllers → Services         │
│   Port 5173        │        JSON responses         │   JWT middleware (protect/admin) │
│                    │                               │   Error-handling middleware      │
└────────────────────┘                               └──────────────┬──────────────────┘
                                                                    │ Mongoose ODM
                                                                    ▼
                                                        ┌───────────────────────┐
                                                        │  MongoDB (Atlas)      │
                                                        │  users, products,     │
                                                        │  categories, carts,   │
                                                        │  wishlists, orders,   │
                                                        │  reviews              │
                                                        └───────────────────────┘
```

- **Frontend:** React SPA with client-side routing. State is managed with React Context
  (`AuthContext`, `CartContext`, `WishlistContext`). All HTTP calls go through a central service
  layer (`src/services/api.js`) which attaches the JWT automatically.
- **Backend:** Express REST API exposing `/api/*` endpoints. Custom application middleware
  (`protect`, `admin`) secures routes; a final error-handling middleware normalizes every failure
  into a consistent JSON response.
- **Database:** Seven MongoDB collections: `users`, `categories`, `products`, `carts`, `wishlists`,
  `orders`, `reviews` (see Section 8).

### Folder Structure

```
1shopNepal/
├── backend/                  # Express API
│   ├── app.js                # App setup + route registration
│   ├── server.js             # Entry point (env, DB connect, listen)
│   ├── config/               # DB connection
│   ├── controllers/          # Request handlers (auth, product, cart, order, ...)
│   ├── middleware/           # authMiddleware, errorMiddleware, requestLogger, uploadMiddleware
│   ├── models/               # Mongoose schemas & models
│   ├── routes/               # API route definitions (13 route files)
│   ├── services/             # recommendationService.js (scoring logic)
│   ├── utils/                # asyncHandler, generateToken, generateSlug, esewa
│   ├── seeder.js             # Seed categories
│   └── seedProducts.js       # Seed products
└── frontend/                 # React SPA
    └── src/
        ├── pages/            # Page components (Home, Cart, Checkout, Orders, Admin, ...)
        ├── pages/admin/      # Admin page components (AdminProducts, AdminOrders, ...)
        ├── components/       # Reusable components (Navbar, ProductCard, Reviews, ...)
        ├── components/admin/ # Admin UI (AdminLayout, ProductForm)
        ├── components/home/  # Home page sections (Hero, Categories, Deals, ...)
        ├── context/          # Auth / Cart / Wishlist providers
        ├── layouts/          # MainLayout (Navbar + Footer + page content)
        ├── services/         # api.js — central fetch wrapper + API objects
        ├── utils/            # seo.js, auth.js (token helpers)
        └── App.jsx           # Route definitions
```

## 5. Features

### 5.1 Authentication & Authorization
- User registration and login with **bcrypt** password hashing.
- **JWT** issued on login/register (valid 7 days), stored in `localStorage`, attached to every API
  request via the `request()` wrapper.
- Role-based access: `customer` and `admin` only. Admin-only routes are protected both on the server
  (the `admin` middleware) and on the client (the `AdminRoute` component).
- Accounts can be enabled/disabled by an admin; a disabled account receives `401` at login and on
  every protected request.
- Profile editing (name, email, phone) and profile-image upload.

### 5.2 Catalog & Products
- Product catalog with category browsing, **search** (name/brand/description), **filtering**
  (category, price range, in-stock), **sorting** (price, newest, rating, name), and **pagination**.
- Product details page: image gallery, discount/price, stock status, specifications, plus
  recommended/related products.
- Product lookup by MongoDB id **or** URL-friendly slug.
- Admin: create, edit, delete, and set product images via image URLs.
- Demo catalog: the `seed:products` script seeds **41 realistic products** across the 6 categories
  (9 electronics, 7 fashion, 7 groceries, 6 beauty, 6 home-living, 6 accessories). Each product uses
  a real brand name (Samsung, Apple, Nike, Casio, etc.), realistic NPR pricing, and **two verified,
  working image URLs** each — every seeded image was checked and returns HTTP 200.

### 5.3 Shopping Cart & Wishlist
- One cart persisted per user; add/update/remove/clear with **server-side stock validation** and
  effective (discounted) pricing.
- Wishlist with add/remove/clear and **move-to-cart**.

### 5.4 Reviews & Ratings
- Signed-in users can write **one review per product** (enforced by a unique `(user, product)`
  index).
- Ratings are 1–5 stars with an optional comment.
- Average rating and review count are recomputed server-side (MongoDB aggregation) after every
  review create/update/delete and stored on the product for fast display.
- Users can edit/delete their own review; **admins can remove any review**.

### 5.5 Checkout & Orders
- Checkout collects the shipping address (name, phone, street, city, district, zip) and a payment
  method.
- Payment methods: **Cash on Delivery (COD)** and **eSewa** (real eSewa ePay V2 integration against
  the eSewa TEST/sandbox gateway). Bank transfer appears as a "coming soon" label only.
- **All prices are computed on the server** from the current database prices — client totals are
  never trusted.
- Subtotal, shipping fee (**free — the delivery charge is Rs. 0**), and grand total. eSewa sees
  `amount = subtotal`, `product_delivery_charge = 0`, and `total_amount = subtotal`.
- Placing an order **decrements product stock** (for COD immediately, for eSewa when the payment is
  server-confirmed) and **clears the cart**.
- Order history page and a per-order detail page.
- Admin can move orders through statuses: **Pending → Confirmed → Processing → Shipped →
  Delivered** (or **Cancelled**). Cancelling a pending order restores stock.
- Payment statuses: **Pending, Paid, Failed, Refunded**.

## 6. API Reference (Summary)

All endpoints are under `http://localhost:5000/api` unless noted. Protected endpoints require the
header `Authorization: Bearer <token>`. A detailed version of this table is in Section 29.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/health` | public | Server health check |
| POST | `/auth/register` | public | Create account (name, email, password) |
| POST | `/auth/login` | public | Log in |
| GET | `/auth/me` | user | Current user profile |
| PUT | `/auth/me` | user | Update profile |
| POST | `/auth/profile-image` | user | Upload profile picture (single image) |
| GET | `/auth/admin-check` | admin | Check admin access |
| GET | `/categories` | public | List categories (with product counts) |
| GET | `/categories/:id` | public | Category details |
| POST | `/categories` | admin | Create category |
| PUT / DELETE | `/categories/:id` | admin | Update / delete category (delete blocked if products exist) |
| GET | `/products` | public | List products (search/filter/sort/paginate) |
| GET | `/products/:id` | public | Product detail (id or slug) |
| POST | `/products` | admin | Create product |
| PUT / DELETE | `/products/:id` | admin | Update / delete product |
| GET | `/recommendations/:productId` | public | Recommended + related products |
| GET/POST | `/cart` | user | Read cart / add item |
| PUT/DELETE | `/cart/:productId` | user | Update quantity / remove item |
| DELETE | `/cart` | user | Clear cart |
| GET/POST | `/wishlist` | user | Read / add to wishlist |
| DELETE | `/wishlist` | user | Clear wishlist |
| DELETE | `/wishlist/:productId` | user | Remove from wishlist |
| POST | `/wishlist/:productId/move-to-cart` | user | Move item to cart |
| GET | `/products/:productId/reviews` | public | List reviews for a product |
| POST | `/products/:productId/reviews` | user | Create review (one per product) |
| PUT | `/reviews/:id` | owner | Edit review |
| DELETE | `/reviews/:id` | owner/admin | Delete review |
| POST | `/orders` | user | Place a COD order (shippingAddress + `cod`) |
| GET | `/orders` | user | My orders |
| GET | `/orders/:id` | owner/admin | Order detail |
| PUT | `/orders/:id/status` | admin | Update order/payment status |
| POST | `/payments/esewa/initiate` | user | Validate cart, create a pending eSewa order, return signed eSewa payment data |
| POST | `/payments/esewa/verify` | user | Verify the redirect callback, confirm payment, claim + finalize the order |
| GET | `/admin/stats` | admin | Dashboard statistics |
| GET | `/admin/orders` | admin | All orders (filter/search/paginate) |
| GET | `/admin/users` | admin | All users (search) |
| PUT | `/admin/users/:id` | admin | Change role / active status |
| GET | `/admin/reviews` | admin | All reviews (search/paginate) |
| GET | `/sitemap.xml` *(server root)* | public | XML sitemap |
| GET | `/robots.txt` *(server root)* | public | robots.txt |

## 7. Business Rules (Server-Side)

Prices, stock, and statuses are always decided on the server:

- **Effective price:** `discountPrice` when it is lower than `price`, otherwise `price`. Used in the
  cart and order totals.
- **Cart pricing:** the effective price is stored in each cart item when it is added/updated.
- **Order pricing:** recomputed at order time from the **current** product prices in the database —
  the request body cannot influence subtotal/shipping/total.
- **Shipping:** free for every order — the delivery charge is Rs. 0 (the eSewa form also sends
  `product_delivery_charge = 0`).
- **Inventory:** adding to cart and placing an order both enforce `quantity ≤ stock`. Placing an
  order subtracts stock; cancelling a pending order adds it back (guarded by a `stockDeducted` flag
  so stock is never restored twice).
- **Stock decrement timing:** COD orders decrement stock immediately at placement; eSewa orders
  decrement stock only after the backend server-to-server confirms the payment with eSewa. A pending
  order cancelled by an admin restores stock exactly once (guarded by `stockDeducted`).
- **Reviews:** the unique `(user, product)` index guarantees one review per user per product; after
  every create/update/delete, `product.rating` becomes the rounded average and `product.reviewCount`
  the number of reviews.
- **Categories:** a category that still has products cannot be deleted (HTTP 400).
- **Duplicate names:** product name and category name are converted to slugs; a duplicate slug is
  rejected with HTTP 400.
- **Admins cannot change their own role/status** (to avoid locking themselves out accidentally).

## 8. Database Design (Mongoose Schemas)

- **User** — `name`, `email` (unique), `password` (bcrypt-hashed, `select:false`), `phone`
  (10 digits), `profileImage`, `role` (`customer|admin`), `isActive`, `addresses[]`, `wishlist[]`
  (legacy array).
- **Category** — `name` (unique), `slug` (unique), `description`, `image`.
- **Product** — `name` (max 200), `slug` (unique), `description` (max 2000), `price` (≥ 0),
  `discountPrice` (must be ≤ price), `images[]`, `category` (ref), `brand`, `stock`, 
  `specifications` (map of key → value, e.g. brand/color), `rating` (0–5, default 0), `reviewCount`
  (default 0).
- **Cart** — one per user (`user` unique); `items[]` where each item is `{ product (ref), quantity,
  price }`.
- **Wishlist** — one per user (`user` unique); `products[]` of product refs.
- **Order** — `user` (ref), `items[]` (product ref, name, quantity, price **snapshot**),
  `shippingAddress` (fullName, phone, addressLine, city, district, zipCode), `subtotal`,
  `shippingCost`, `totalAmount`, `paymentMethod` (`cod|esewa`), `paymentStatus`
  (`pending|paid|failed|refunded`), `orderStatus`
  (`pending|confirmed|processing|shipped|delivered|cancelled`), `transactionId` (the eSewa
  `transaction_uuid` generated at initiation), `esewaRefId` (eSewa's `transaction_code` after a
  confirmed payment), `stockDeducted` (boolean).
- **Review** — `user` (ref), `product` (ref), `rating` (1–5), `comment` (max 1000); unique
  `(user, product)` compound index.

## 9. Implementation Highlights

1. **Secure auth flow** — passwords hashed with bcrypt; a JWT is verified on every protected request
   by the `protect` middleware, which loads the live user from the database (so a disabled account
   is rejected immediately).
2. **Server-side price integrity** — order totals are derived only from products in the database,
   never from the client, preventing price-tampering attacks.
3. **Stock management** — atomic stock checks during cart and order operations; COD deducts at
   placement while eSewa deducts only after server-side payment confirmation; a cancelled pending
   order restores stock once.
4. **Review rating aggregation** — MongoDB aggregation computes the average rating + count after
   every review operation and stores them on the product for fast reads.
5. **Explainable recommendation engine** — a simple weighted heuristic (no machine learning) with
   human-readable "why" reasons shown in the UI (see Section 25).
6. **Real payment gateway (eSewa TEST)** — a complete eSewa ePay V2 checkout using HMAC-SHA256
   request signatures and a server-to-server status check, verified against eSewa's TEST/sandbox
   environment with the official test merchant credentials (see Section 24).
7. **SEO support** — per-page meta tags (title, description, Open Graph, Twitter, canonical),
   JSON-LD structured data on the home page, a generated XML sitemap and robots.txt (see Section 32).
8. **Central request layer** — a single `request()` wrapper in `src/services/api.js` centralizes
   JSON, token attachment, and error handling.
9. **Consistent error handling** — a final error middleware converts Mongoose, Multer, and thrown
   errors into uniform JSON responses, hiding internals in production.
10. **Environment-driven config** — `.env` holds the DB URI, JWT secret, client origin, optional DNS
    server, and the eSewa TEST credentials (product code, secret key).
11. **Idempotent payment verification** — the eSewa verify endpoint atomically claims the order
    (`findOneAndUpdate` on a `pending` order with `stockDeducted: false`) so duplicate or concurrent
    callback verifications (e.g., React `<StrictMode>`'s double effect in development) can never
    double-process a payment, double-deduct stock, or throw a Mongoose `VersionError`.

## 10. Running the Application

### Prerequisites
- Node.js (v20+) and npm
- MongoDB URI (cloud Atlas or local) and a JWT secret

### Backend
```bash
cd backend
npm install
cp .env.example .env      # configure MONGO_URI, JWT_SECRET, CLIENT_URL (+ ESEWA_SECRET_KEY)
npm run seed:categories   # optional: seed the 6 categories
npm run seed:products     # optional: seed 41 realistic products (Section 5.2)
npm run dev               # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

Open `http://localhost:5173`, register an account, and start shopping. For admin access, set the
new user's `role` to `admin` in the database (or use a pre-seeded admin account).

## 11. Testing

Testing was performed manually against the live API (PowerShell `Invoke-RestMethod`) and in-browser:

- **Auth:** invalid credentials → 401; protected routes without token → 401; duplicate email → 400;
  disabled account → 401.
- **Cart/wishlist:** add/update/remove/clear; quantity limited by stock; move-to-cart merges into
  the cart.
- **Reviews:** unauthenticated → 401; duplicate review → 400; rating out of 1–5 → 400;
  owner-only edit; admin delete; average rating & count update after each operation.
- **Orders (end-to-end):** login → add to cart → cart summary → checkout → place order →
  order-success → order history → order details.
  Verified: subtotal/shipping/total computed server-side (shipping = Rs. 0); stock decremented;
  cart cleared; non-owner access → 403; invalid order status → 400; cancellation restores stock.
- **eSewa (TEST/sandbox):** `initiate` returns the signed V2 form fields; the checkout submits a
  hidden form and redirects to the real eSewa TEST payment page; paying with the official sandbox
  customer ID (`9711111111`, password `Test@123`, OTP `123456`) returns to the success page.
- **eSewa verification:** the callback `data` is decoded server-side, its HMAC signature is
  re-computed and compared, `status = COMPLETE` is required, and the amount, product code, and order
  ownership must match. The transparent status API
  (`…/api/epay/transaction/status/`) is then queried server-to-server as an authoritative check.
- **eSewa failure path:** cancelled/failed transactions land on the failure page with the reason
  eSewa returned; the backend does not mark the order as paid.
- **Concurrency-safety:** duplicating the verify request (React StrictMode double-effect) is handled
  — only one request processes the order, the rest receive `Payment already verified`, and no
  Mongoose VersionError or double stock deduction occurs.
- **Admin module:** dashboard stats, order status updates, user role/status toggles, review
  deletion, product/category CRUD with validation errors.
- **Frontend:** `npm run lint` and `npm run build` pass.

A full test report covering 52 test cases (customer, admin, edge, and probe cases) is also maintained
in the project `README.md`.

[Screenshots: insert here — registration, product listing, product detail with reviews, cart,
checkout with COD/eSewa options, eSewa TEST login page, eSewa payment success page, order success,
order history, order detail, admin dashboard, admin products, admin orders]

## 12. Conclusion

The project successfully implements a modern, full-stack e-commerce application. All core workflows
— user registration and login, catalog browsing, cart and wishlist management, product reviews and
ratings, Cash-on-Delivery **and** eSewa (TEST) checkout, the recommendation feature, and order
lifecycle management — function end to end. Security measures such as JWT authentication, role-based
access, server-side price calculation, HMAC-signed payment requests, and inventory validation ensure
that business-critical data cannot be tampered with from the client.

## 13. Future Work

- Activate **live eSewa production credentials** (eSewa provides them after successful TEST
  transactions) and add **bank transfer and iPIN-based card payments** (currently display labels
  only).
- **Purchase-confirmation emails** and notifications on order status changes (not implemented yet —
  see Section 24).
- **Web analytics** (e.g., Google Analytics 4) for visitor tracking (not implemented — see
  Section 33).
- Customer-initiated order cancellation and return/refund flows.
- Full saved **address book** UI (the data model already supports multiple addresses).
- Automated unit/E2E test suite (Jest, Supertest, Playwright) and CI pipeline.
- Better product search relevance (text index / fuzzy matching) and product Q&A.

## 14. References

1. Mongoose Documentation — https://mongoosejs.com/docs/
2. Express.js Guide — https://expressjs.com/
3. React Documentation — https://react.dev/
4. Vite Guide — https://vitejs.dev/guide/
5. Tailwind CSS Documentation — https://tailwindcss.com/docs
6. JWT (JSON Web Tokens) — https://jwt.io/
7. MongoDB Documentation — https://www.mongodb.com/docs/
8. eSewa Developer Documentation (including TEST credentials) — https://developer.esewa.com.np/

## 15. Frontend Architecture

The frontend is a React SPA created with Vite. The module tree (bottom of `App.jsx`) is:

- **Entry point** — `main.jsx` wraps the app in `<StrictMode>` and `<BrowserRouter>` and mounts
  three providers in order: `AuthProvider → CartProvider → WishlistProvider → App`.
- **Routing** — React Router v7. Pages live inside a shared `MainLayout` (Navbar + Footer +
  `ScrollToTop` + page content). Routes that need a logged-in user are wrapped in `ProtectedRoute`,
  and admin routes are wrapped in `AdminRoute` and an `AdminLayout` with a sidebar (Section 30).
- **Lazy loading** — `ContactUs` and `DataPolicy` are loaded with `React.lazy` + `<Suspense>` so
  they do not slow down the initial page load.
- **State management** — three React Context providers make global state available anywhere without
  prop-drilling:
  - `AuthContext` — the logged-in user, login/register/logout, profile updates, and restoring the
    session from the stored token when the app reloads.
  - `CartContext` — the user's cart, with `addToCart`, `updateItem`, `removeItem`, `clearCart`, and
    computed helpers (`total`, `count`, and loaded product lookups).
  - `WishlistContext` — wishlist ids/products and `toggleWishlist` with toast feedback.
- **API layer** — every page calls the API through `src/services/api.js`. The `request()` helper
  sets `Content-Type: application/json`, attaches `Authorization: Bearer <token>` when a token
  exists, parses JSON, and throws an `Error` carrying the server message and status code. A separate
  `requestMultipart()` handles file uploads without setting the content type (the browser adds the
  multipart boundary itself).

## 16. Backend Architecture

The backend is an Express application. Its main files:

- **`server.js`** — loads environment variables with `dotenv`, optionally overrides the system DNS
  servers (via `dns.setServers`) when MongoDB Atlas hostnames cannot resolve on the network,
  connects to MongoDB, and starts listening on `PORT` (default 5000).
- **`app.js`** — builds the Express pipeline:
  1. `cors({ origin: process.env.CLIENT_URL })` — only the configured frontend origin may call the
     API.
  2. `express.json()` — parses JSON request bodies.
  3. `express.static('/uploads')` — serves uploaded avatar images.
  4. `requestLogger` — logs method, URL, status, and duration for each request.
  5. Route groups — `/api`, `/api/auth`, `/api/categories`, `/api/products`,
     `/api/recommendations`, `/api/cart`, `/api/wishlist`, `/api/orders`,
     `/api/payments`, `/api/admin`, plus `/sitemap.xml` and `/robots.txt`.
  6. `notFound` then `errorHandler` — the last two middlewares handle 404s and convert every error
     into a JSON response.

### Request lifecycle

```
Browser → CORS/JSON/Logger → route → [protect] → [admin] → controller → Mongoose → MongoDB
                                                     │
                                       asyncHandler catches errors ↓
                                   errorHandler → { success:false, message, status }
```

- Controllers are wrapped with `asyncHandler`, a small utility that forwards any thrown error or
  rejected promise to the error middleware automatically.
- `protect` and `admin` middlewares gate protected/admin routes (Section 18).
- The `errorHandler` maps:
  - `MulterError LIMIT_FILE_SIZE` → 400 "File too large" (images are limited to 5 MB),
  - `MulterError LIMIT_FILE_COUNT` → 400 (max 6 files),
  - `CastError` → 400 "Invalid resource identifier",
  - Mongoose `ValidationError` → 400 with the joined validation messages,
  - duplicate key (error code 11000) → 400 "Duplicate value entered",
  - all other errors → their own status/message; the stack trace is only shown outside production.

## 17. Database Collections (Detailed)

| Collection | Key fields | Purpose |
|---|---|---|
| `users` | name, email, phone, profileImage, role, isActive, addresses[] | Account management |
| `categories` | name, slug, description, image | Product grouping |
| `products` | name, slug, price, discountPrice, images[], category, brand, stock, specifications, rating, reviewCount | Catalog |
| `carts` | user (unique), items[{product, quantity, price}] | Shopping cart |
| `wishlists` | user (unique), products[] | Saved items |
| `orders` | user, items[] (snapshot), shippingAddress, subtotal, shippingCost, totalAmount, paymentMethod, paymentStatus, orderStatus, transactionId, esewaRefId, stockDeducted | Orders & payments |
| `reviews` | user, product, rating, comment (unique user+product) | Ratings & feedback |

Relationships are stored as **references** (ObjectIds). For example, a product holds a `category`
ObjectId, and an item in an order holds the product ObjectId plus a **snapshot** of its name and
price so that order history stays correct even if the product is edited or deleted later.

## 18. Authentication & Authorization

- **Registration** (`POST /api/auth/register`) — validates name (2–100 chars), email (must look like
  an email, lowercased), and password (≥ 6 chars), rejects duplicate emails, hashes the password
  with bcrypt (10 salt rounds), creates the user, and returns a JWT.
- **Login** (`POST /api/auth/login`) — checks email + password with `bcrypt.compare`; returns a JWT
  and the user profile.
- **JWT** — signed with `JWT_SECRET`, valid for **7 days**. It contains only the user id. The client
  keeps it in `localStorage` and sends it as `Authorization: Bearer <token>`.
- **`protect` middleware** — reads the token, verifies it, loads the user from the database, and
  rejects requests from disabled (`isActive: false`) accounts with a clear 401 message.
- **`admin` middleware** — requires `role === 'admin'`, otherwise 403.
- **Role model** — only two roles: `customer` (default) and `admin`. Roles are set by an admin
  (Section 28); admins cannot change their own role or status.
- **Profile** — `PUT /api/auth/me` updates profile fields; `POST /api/auth/profile-image` uploads an
  avatar image that is saved locally under `backend/uploads/avatars` and served statically.
- **What is NOT implemented:** email verification, "forgot/reset password", and third-party login
  (e.g., Google). Passwords have no reset flow in this project.

## 19. Product Catalog — Search, Filter, Sort, Pagination

The single catalog endpoint `GET /api/products` supports these query parameters:

| Parameter | Example | Behaviour |
|---|---|---|
| `search` | `?search=phone` | Case-insensitive search in name, brand, and description |
| `category` | `?category=electronics` | Filter by category **slug** (unknown slug returns an empty list) |
| `minPrice` / `maxPrice` | `?minPrice=1000&maxPrice=50000` | Narrow by price (applies to `price`) |
| `inStock` | `?inStock=true` | `true` → stock > 0; `false` → stock = 0 |
| `sort` | `?sort=price_asc` | `price_asc`, `price_desc`, `newest`, `rating`, `name` (default: newest) |
| `page` / `limit` | `?page=2&limit=12` | Pagination; default 12, maximum 100 |

Response shape: `{ success, count, total, page, pages, products }`. The `rating` sort orders by
`rating` then by `reviewCount`. `GET /api/products/:id` accepts a 24-character Mongo id **or** the
product slug, so product pages can use human-readable URLs (used by the sitemap too).

The frontend `Products` page renders these filters in the sidebar, keeps selections in the URL, and
shows "in stock / out of stock" states on each card. The product detail page shows a multi-image
gallery, discount badge, specifications table, and the recommended/related lists (Section 25).

## 20. Shopping Cart

- **Server-backed:** a cart document exists per user (`GET /api/cart`). Guest users see a prompt to
  log in; the cart is always tied to the account, not the browser.
- **Cart item price:** stored at add time as the effective (discounted) price — the client cannot
  choose a price.
- **Stock validation:** adding or increasing quantity checks `product.stock`; exceeding it returns a
  clear 400 message.
- **Subtotal:** the frontend shows a subtotal, but the authoritative subtotal/shipping/total are
  recomputed on the server when the order is placed.
- **Cart context** caches the item list and recomputes `total`/`count` reactively so the navbar badge
  and cart page stay in sync; guarded actions show toast notifications on errors.

## 21. Wishlist

- One wishlist per user. `POST /api/wishlist` adds a product (duplicates → 409), `DELETE
  /api/wishlist/:productId` removes one, `DELETE /api/wishlist` clears all.
- Product details are populated before being returned, so the frontend can reuse `ProductCard`.
- **Move-to-cart** (`POST /api/wishlist/:productId/move-to-cart`) moves an item and keeps quantities
  consistent with the cart.
- The heart icon on product cards toggles wishlist membership with toast feedback.

## 22. Reviews & Ratings

- **Rules** — one review per user per product (unique compound index); rating 1–5; comment up to
  1000 characters; only the owner may edit or delete their review; any admin may delete a review.
- **Recomputation** — after every create/update/delete, the server runs an aggregation: it groups
  reviews by product and writes the average rating (rounded to 1 decimal) into `product.rating` and
  the count into `product.reviewCount`. Listing reviews is therefore cheap and always current.
- **UI** — the product page shows the average rating card (big number + star row + review count), a
  review form (or a "you already reviewed" notice for the current user), and the list of reviews with
  edit/delete buttons for the owner and an admin delete button for admins; a `StarRating` component is
  reused across these views.

## 23. Checkout & Order Management

- **Checkout page** collects fullName, phone, addressLine, city, district, zipCode, and a payment
  method chosen from **COD** or **eSewa** (bank transfer is shown as a "coming soon" label only).
- **COD server flow (`POST /api/orders`):**
  1. Validates the shipping address; only `cod` is accepted on this endpoint (eSewa orders are
     created by `POST /api/payments/esewa/initiate` instead — see Section 24).
  2. Loads the user's cart; rejects an empty cart.
  3. Loads every product, validates quantities against stock, and builds order items using the
     effective price at that moment.
  4. Computes `subtotal`, `shippingCost` (always Rs. 0 — delivery is free), and `totalAmount`.
  5. Creates the order with `paymentStatus: pending`, `orderStatus: pending`, and immediately
     deducts stock and clears the cart for COD.
- **Order history (`GET /api/orders`)** and a detail page show items, shipping address, payment
  method/status, and a status badge (plus the eSewa `transactionId`/`esewaRefId`). Non-owners can
  read an order only if they are admins (403 otherwise).
- **Admin status updates (`PUT /api/orders/:id/status`)** accept any valid `orderStatus` or
  `paymentStatus`. Cancelling an order whose payment is still pending restores the stock (once,
  guarded by `stockDeducted`).

## 24. Payment Gateway — eSewa (ePay V2, TEST) and Email Notifications

### eSewa integration
The project integrates the official **eSewa ePay V2 (epay)** gateway and is tested against eSewa's
**TEST/sandbox** environment (`rc.esewa.com.np`). There is no simulated mock mode — real sandbox
requests are made with the official eSewa test merchant code.

- **Configuration (`.env`):**
  - `ESEWA_PRODUCT_CODE` — merchant/service code, `EPAYTEST` for the sandbox.
  - `ESEWA_SECRET_KEY` — the test secret key from the eSewa merchant portal.
  - `ESEWA_PAYMENT_URL` — `https://rc-epay.esewa.com.np/api/epay/main/v2/form`.
  - `CLIENT_URL` — used to build the `success_url` / `failure_url` returned to eSewa.
- **Initiating a payment (`POST /api/payments/esewa/initiate`):**
  1. Validates the shipping address and the logged-in user's cart; rejects an empty cart.
  2. Re-prices every item from the database, enforces `quantity ≤ stock`, and computes `subtotal`,
     `shippingCost` (Rs. 0) and `totalAmount` server-side.
  3. Creates the **pending** order (payment method `esewa`) and generates a unique
     `transaction_uuid`.
  4. Builds the ePay V2 form fields: `amount`, `tax_amount`, `product_service_charge`,
     `product_delivery_charge`, `product_code`, `total_amount`, `transaction_uuid`, `success_url`,
     `failure_url`, `signed_field_names`, and `signature`.
  5. The signature is an **HMAC-SHA256** digest (base64) over the signed fields joined as
     `total_amount=<…>,transaction_uuid=<…>,product_code=<…>` — exactly the key=value order declared
     in `signed_field_names`.
  6. The frontend posts these fields as a **hidden HTML form** to `ESEWA_PAYMENT_URL`, leaving the
     site; the customer signs in with an eSewa TEST account and completes the payment.
- **Verifying a payment (`POST /api/payments/esewa/verify`):**
  eSewa redirects to `/payment/esewa/success` (or `/failure`) with a base64-encoded `data` JSON.
  The backend:
  1. Decodes the payload and looks up the order by `transaction_uuid` (scoped to the current user).
  2. Re-computes and compares the returned **HMAC signature**.
  3. Requires `status = COMPLETE`, the matching `total_amount`, the matching `product_code`, and an
     existing pending order.
  4. Performs an authoritative **server-to-server status query**
     (`GET https://rc.esewa.com.np/api/epay/transaction/status/?product_code=…&total_amount=…&transaction_uuid=…`)
     and only proceeds when it also reports `COMPLETE`.
  5. **Atomically claims** the order with `findOneAndUpdate` conditioned on
     `paymentStatus: 'pending'` and `stockDeducted: false`, so a duplicate or concurrent callback
     (e.g., React `<StrictMode>`'s double effect in development) can never double-process it. The
     losing request simply receives `Payment already verified`.
  6. Decrements stock **exactly once** (guarded `$inc` per item), sets `stockDeducted`, stores
     eSewa's `transaction_code` in `esewaRefId`, clears the cart (best-effort), and confirms the
     order.
- **Failure handling:** a cancelled/failed payment redirects to `/payment/esewa/failure`, which
  decodes the payload and shows the reason eSewa returned, plus any `message` — the order stays
  un-confirmed and unpaid. eSewa automatically refunds failed transactions.
- **TEST credentials (official eSewa sandbox):** eSewa ID `9711111111` / `9711111112` /
  `9711111113`, password `Test@123`, MPIN `1122`, OTP/token `123456`.
- **Protections in the code:** ownership checks, one transaction per generated `transaction_uuid`,
  amount + product-code equality, response-signature verification, an authoritative server-side
  status check, and an atomic claim that prevents double stock deduction.

### Purchase confirmation email — NOT IMPLEMENTED
No email library (nodemailer/SMTP/SendGrid/Mailgun/Resend) is installed and no email is sent by the
backend. When an order is placed or a payment is verified, no confirmation email is generated. This
feature is listed under Future Work (Section 13). A future implementation would add a transaction
mailer (e.g., nodemailer with SMTP configuration sent from `Order` events).

## 25. Product Recommendations

The backend exposes `GET /api/recommendations/:productId`, returning:

```json
{ "product": {…}, "recommended": […], "related": […] }
```

- `recommended` — up to 8 best-scoring products across the whole catalog, interleaved between
  same-category and cross-category items so the grid shows variety.
- `related` — up to 8 same-category products, best-scoring first.

**Algorithm — a simple weighted heuristic (no machine learning):** every other product is compared
with the viewed product and given a score out of 100:

| Criterion | Weight | How it is computed |
|---|---|---|
| Category match | +40 | Same category or not |
| Price similarity | +25 | Closer prices → more points (relative difference) |
| Rating quality | +15 | `rating / 5` |
| Popularity | +20 | `reviewCount` relative to the most-reviewed product |
| **Maximum** | **100** | |

Example from the source comments: a candidate sharing the category (+40), priced 10% apart
(+22.5), rated 4.5/5 (+13.5), and popular (+18) scores **94/100**. The response also includes the
human-readable **reasons** ("same category", "similar price", "highly rated", "popular") that the UI
can show, which makes the algorithm easy to explain and verify.

## 26. Admin Module — Dashboard & Statistics

`GET /api/admin/stats` (admin only) returns:

- `totalUsers`, `totalProducts`, `totalOrders`,
- `totalRevenue` — sum of `totalAmount` for orders that are **not cancelled**,
- `orderStatusSummary` — counts per order status,
- `recentOrders` — the 5 most recent orders (with the customer's name and email),
- `bestSellingProducts` — the top 5 products by units sold (aggregation that unwinds order items and
  groups by product), including sold quantity, revenue, and a stock level.

The `AdminDashboard` page renders stat cards, order-status chips, a recent-orders table, and a
best-sellers list.

## 27. Admin Module — Products & Categories

- **Products (`/admin/products`, `/admin/products/create`, `/admin/products/edit/:id`):**
  - Create from a form (name, brand, description, price, discountPrice, stock, category,
    specifications map) with server-side validation.
  - Product images are set as image URLs (up to 6) pasted into the form (Section 35).
  - Inline stock editing and deletion from the products list, with toast feedback.
- **Categories (`/admin/categories`):** list with product counts, create/edit modal, and delete. A
  category containing products cannot be deleted (HTTP 400) — this was a fix for a found bug
  (category deletion corrupting catalog references).

## 28. Admin Module — Orders, Users & Reviews

- **Orders (`/admin/orders`):** paginated list (default 20/page), filterable by order status and
  searchable by customer name, city, or order id. Status is advanced with a dropdown using the flow
  Pending → Confirmed → Processing → Shipped → Delivered (or Cancelled); cancelled-pending orders
  restore stock.
- **Users (`/admin/users`):** searchable list; an admin can promote/demote to `admin`/`customer` and
  enable/disable accounts. Switching a user to `customer` or disabling them revokes access on their
  next request (the `protect` middleware re-checks the live user). Admins cannot change their own
  role/status.
- **Reviews (`/admin/reviews`):** paginated list (default 20/page) with comment search and one-click
  deletion of any review (the product's average rating is recomputed automatically).

## 29. API Documentation (Detailed)

**Authentication** — base `http://localhost:5000/api`

- `POST /auth/register` — body `{ name, email, password }` → `{ token, user }`
- `POST /auth/login` — body `{ email, password }` → `{ token, user }`
- `GET /auth/me` (user) → `{ user }`
- `PUT /auth/me` (user) — updates profile fields → `{ user }`
- `POST /auth/profile-image` (user, multipart `image`) → `{ user }`
- `GET /auth/admin-check` (admin) → `{ success }`
- Errors: 400 validation, 401 bad credentials/disabled account, 403 not admin.

**Categories & Products**

- `GET /categories` → `{ categories }` (each with `productCount` via aggregation)
- `GET /products?…` → `{ count, total, page, pages, products }` (params in Section 19)
- `GET /products/:id` (id or slug) → `{ product }`
- `POST /products` (admin) — body `{ name, description, price, discountPrice, images[],
  category, brand, stock, specifications }`
- `PUT /products/:id` (admin) — partial update; slug regenerated when the name changes
- `DELETE /products/:id` (admin)
- `POST /categories` (admin), `PUT|DELETE /categories/:id` (admin)

**Cart & Wishlist** — all `user`

- `GET /cart` → `{ items, subtotal, itemCount }` · `POST /cart` `{ productId, quantity }` ·
  `PUT /cart/:productId` `{ quantity }` · `DELETE /cart/:productId` · `DELETE /cart`
- `GET /wishlist` → `{ products }` · `POST /wishlist` `{ productId }` ·
  `DELETE /wishlist/:productId` · `DELETE /wishlist` ·
  `POST /wishlist/:productId/move-to-cart`

**Reviews**

- `GET /products/:productId/reviews` (public) → `{ reviews }` (each review populated with the
  reviewer's name; average rating and count are read from the product document)
- `POST /products/:productId/reviews` (user) `{ rating, comment }` — one per user/product
- `PUT /reviews/:id` (owner) · `DELETE /reviews/:id` (owner or admin)

**Orders** — `user`

- `POST /orders` — body `{ shippingAddress {fullName, phone, addressLine, city, district,
  zipCode}, paymentMethod }` → created order
- `GET /orders` → `{ orders }` · `GET /orders/:id` (owner/admin)
- `PUT /orders/:id/status` (admin) — body `{ orderStatus?, paymentStatus? }`

**Payments (eSewa)** — user

- `POST /payments/esewa/initiate` `{ shippingAddress }` → validates the cart, creates the pending
  eSewa order, returns `{ orderId, transactionUuid, paymentUrl, paymentData }` where `paymentData`
  holds the signed V2 form fields.
- `POST /payments/esewa/verify` `{ data }` → decodes the callback `data`, verifies the signature and
  the server-to-server status, then atomically claims and confirms the order
  (`{ success, message, order }`).

**Admin** — admin only

- `GET /admin/stats`, `GET /admin/orders`, `GET /admin/users`, `PUT /admin/users/:id`,
  `GET /admin/reviews` (params described in Sections 26–28)

**SEO** — public, at the server root (no `/api` prefix)

- `GET /sitemap.xml` · `GET /robots.txt`

## 30. React Pages & Routes

All routes are rendered inside `MainLayout`. `ProtectedRoute` redirects guests to `/login`;
`AdminRoute` redirects non-admins to `/`.

| Route | Page | Access |
|---|---|---|
| `/` | Home | public |
| `/categories`, `/products` | Products (catalog + filters) | public |
| `/categories/:slug`, `/category/:slug` | CategoryPage | public |
| `/products/:id` | ProductDetails | public |
| `/login`, `/register` | Login, Register | public |
| `/cart` | Cart | public (login prompt for guests) |
| `/contact` | ContactUs | public (lazy) |
| `/privacy-policy` | DataPolicy | public (lazy) |
| `/wishlist` | Wishlist | user |
| `/checkout` | Checkout | user |
| `/order-success` | OrderSuccess | user |
| `/payment/esewa/success` | EsewaSuccess | user |
| `/payment/esewa/failure` | EsewaFailure | public |
| `/orders` | Orders | user |
| `/orders/:id` | OrderDetails | user |
| `/account` | Account | user |
| `/admin` | AdminDashboard → AdminLayout | admin |
| `/admin/products` | AdminProducts | admin |
| `/admin/products/create` | AdminCreateProduct | admin |
| `/admin/products/edit/:id` | AdminEditProduct | admin |
| `/admin/categories` | AdminCategories | admin |
| `/admin/orders` | AdminOrders | admin |
| `/admin/users` | AdminUsers | admin |
| `/admin/reviews` | AdminReviews | admin |

## 31. Reusable Components

| Component | Purpose |
|---|---|
| `MainLayout` | Navbar + footer + scroll-to-top wrapper for all pages |
| `Navbar` | Logo, search box, categories dropdown, cart badge, user menu, logout |
| `Footer` | Links, categories, support, social icons |
| `ProductCard` | Product tile with image, price, discount %, stock, add-to-cart / wishlist icons |
| `StatusBadge` | Colored badge for order and payment statuses |
| `Seo` | Sets per-page title/meta/Open Graph/Twitter/canonical + optional JSON-LD |
| `ReviewsSection`, `ReviewItem` | Loads and lists reviews with average rating, count, and per-review controls |
| `ReviewForm`, `StarRating` | Rating input (interactive stars) and review editing |
| `ProtectedRoute`, `AdminRoute` | Redirect guards for user/admin routes |
| `ScrollToTop` | Resets scroll position on navigation |
| `SectionHeader` | Consistent page-section headings |
| `Button` | Shared button styles |
| `AdminLayout` | Admin sidebar + content wrapper |
| `ProductForm` | Shared create/edit product form (used by both admin pages) |
| Home sections (`Hero`, `CategoriesSection`, `FeaturedProducts`, `DealSection`,
`PopularProducts`, `WhyChooseUs`, `Newsletter`) | Marketing blocks on the landing page |
| `ToastContainer` (react-toastify) | Global toast notifications (success/info/error) |

## 32. SEO (Search Engine Optimization)

The project implements basic SEO best practices:

- **Per-page metadata** — the `Seo` component calls `utils/seo.js` `setPageMeta()` on every page:
  title, meta description, `robots` (index/nofollow for cart/wishlist/account pages), Open Graph
  tags (og:title, og:description, og:image, og:type), Twitter card tags, and a canonical URL. A
  `setJsonLd()` helper injects JSON-LD structured data — used on the home page (WebSite +
  Organization schemas), on category pages (breadcrumb), and on product pages (product + breadcrumb
  schemas).
- **Global head tags** — `index.html` sets the site title, description, and open-graph defaults, and
  references the favicon.
- **robots.txt** — a `public/robots.txt` (served by Vite) allows crawling everywhere except
  `/admin`, `/checkout`, `/payment/`, and `/api/`, and points to the sitemap.
- **Dynamic sitemap** — the backend generates `GET /sitemap.xml` from the database: static pages
  (`/` 1.0, `/products` 0.9, `/categories` 0.8), category pages (0.7), and every product page (0.6,
  with a `<lastmod>` from `updatedAt`). XML is escaped to stay valid.
- **Dynamic robots.txt** — the backend also serves `/robots.txt` using the configured `CLIENT_URL`.
- **Friendly URLs** — products and categories use readable slugs in links (e.g.,
  `…/products/iphone-15-pro`).

## 33. Analytics — NOT IMPLEMENTED

No web-analytics service is integrated. There is no Google Analytics (gtag/GA4), Meta Pixel, or any
cookie/visitor-tracking script anywhere in the frontend or backend. This project does not collect or
store visitor statistics. Adding analytics later would mean a small `<script>` snippet in
`index.html` plus privacy considerations for the Data Policy page.

## 34. Security

| Area | Measure |
|---|---|
| Passwords | bcrypt hashing (10 rounds); never stored or returned in plain text |
| Sessions | JWT (7-day expiry) sent as `Authorization: Bearer`, verified on every protected route |
| Authorization | `protect` (logged-in) and `admin` (role === admin) middlewares; disabled accounts blocked at 401 |
| Client-side guards | `ProtectedRoute` and `AdminRoute` hide pages, but the server is always the real gatekeeper |
| CORS | Only the configured `CLIENT_URL` origin is allowed |
| Price integrity | Order totals computed server-side from DB products; cart item price set server-side |
| Inventory | Stock deducted with atomic guarded `$inc` queries — COD at placement, eSewa only after server-side payment confirmation; cancelled pending orders restore stock once |
| Ownership | Order payment/verification and review edits require the owner (or admin) — 403 otherwise |
| Input validation | Mongoose validation (lengths, enums, regex patterns, min/max) plus explicit controller checks |
| Error safety | Central error middleware hides stack traces in production and sanitizes messages |
| File uploads | MIME whitelist (jpeg/png/webp/gif), 5 MB limit, 6-file limit, and dangerous extensions (`.exe`, `.sh`, `.bat`, `.js`, `.html`) blocked |
| Secrets | Stored only in `.env` (never in React code); client only ever sees the JWT |
| Duplicate handling | Unique indexes + duplicate-slug checks return clear 400 errors |

## 35. Image Handling & Uploads

- **Product images** — stored as **image URLs** (a MongoDB string array on the product); there is no
  file-storage service. The admin product form accepts up to 6 pasted image URLs (Section 27).
- **Profile images** — uploaded with Multer to `/api/auth/profile-image` (multipart) and saved
  locally under `backend/uploads/avatars`, served by the static `/uploads` route. The upload
  middleware validates MIME types (`jpeg/png/webp/gif`), caps file size at 5 MB, and rejects
  dangerous file extensions.

## 36. Environment Variables

The backend is configured through a `.env` file (template: `backend/.env.example`). Only placeholder
values are shown here — real values are kept out of the repository.

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/1shopnepal
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:5173

# eSewa ePay V2 (TEST environment) — use the official test merchant credentials
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_SECRET_KEY=
ESEWA_PAYMENT_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form

# Optional: needed only if Node cannot resolve MongoDB Atlas (mongodb+srv) hostnames,
# e.g. DNS_SERVER=192.168.0.1,8.8.8.8
DNS_SERVER=
```

Important notes:

- `MONGO_URI` and `JWT_SECRET` are **required**. `CLIENT_URL` must match the frontend origin (the
  backend uses it for CORS and for building return/payment URLs).
- `ESEWA_SECRET_KEY` and `ESEWA_PRODUCT_CODE` must be filled with the eSewa TEST merchant values
  (`EPAYTEST`) for the eSewa checkout to work; `CLIENT_URL` is also used to build the eSewa
  success/failure URLs.
- `DNS_SERVER` is an optional workaround for unreliable Atlas hostname resolution.