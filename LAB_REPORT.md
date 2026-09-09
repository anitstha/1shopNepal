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
**Cash on Delivery**. The application also provides an administrator panel for managing the product
catalog and order fulfillment.

The project demonstrates a modern **MERN (MongoDB, Express.js, React, Node.js)** architecture with a
RESTful API backend and a responsive single-page-application frontend. It covers end-to-end
e-commerce functionality: **authentication, catalog management, shopping cart, wishlist, product
reviews/ratings, checkout, and order management**, with all price calculations and stock control
handled securely on the server.

## 2. Objectives

1. To design and build a complete client–server e-commerce system using the MERN stack.
2. To implement secure user authentication and role-based authorization (customer vs. admin).
3. To provide a browsable, filterable product catalog with category organization.
4. To implement a shopping cart and wishlist with real-time quantity and stock validation.
5. To support product reviews and ratings with automatically computed average ratings.
6. To implement a checkout flow (Cash on Delivery) with **server-side price calculation**,
   inventory reduction, and order tracking statuses.
7. To provide an admin interface for product management and order status updates.

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
| **JSON Web Token** | 9 + `bcrypt` 6 | Authentication & password hashing |
| **Multer + Cloudinary** | 2.x | Product image upload/storage |

## 4. System Architecture

The application follows a **three-tier client–server architecture**:

```
┌────────────────────┐       HTTP/JSON (REST)        ┌─────────────────────────────────┐
│   React Frontend   │ ────────────────────────────► │   Express API (Node.js)          │
│   (Vite + Tailwind)│ ◄──────────────────────────── │   Controllers → Services         │
│   Port 5173        │        JSON responses         │   JWT middleware (protect/admin) │
└────────────────────┘                               └──────────────┬──────────────────┘
                                                                    │ Mongoose ODM
                                                                    ▼
                                                        ┌───────────────────────┐
                                                        │  MongoDB (Atlas)      │
                                                        │  Users, Products,     │
                                                        │  Categories, Carts,   │
                                                        │  Orders, Reviews,     │
                                                        │  Wishlists            │
                                                        └───────────────────────┘
```

- **Frontend:** React SPA with client-side routing. State is managed with React Context
  (`AuthContext`, `CartContext`, `WishlistContext`). All HTTP calls go through a central service
  layer (`src/services/api.js`) which attaches the JWT automatically.
- **Backend:** Express REST API exposing `/api/*` endpoints. Custom application middleware
  (`protect`, `admin`) secures routes; an error-handling middleware normalizes all failures into
  consistent JSON responses.
- **Database:** Six MongoDB collections: `users`, `categories`, `products`, `carts`, `orders`,
  `reviews`, `wishlists` (see Section 8).

### Folder Structure

```
ecommerce/
├── backend/              # Express API
│   ├── app.js            # App setup + route registration
│   ├── server.js         # Entry point (env, DB connect, listen)
│   ├── config/           # DB connection, Cloudinary config
│   ├── controllers/      # Request handlers (auth, product, cart, order, review, ...)
│   ├── middleware/       # authMiddleware, errorMiddleware, requestLogger, uploadMiddleware
│   ├── models/           # Mongoose schemas & models
│   ├── routes/           # API route definitions
│   ├── utils/            # asyncHandler, generateToken, generateSlug
│   └── seeder.js         # Category / product seed scripts
└── frontend/             # React SPA
    └── src/
        ├── pages/        # Page components (Home, Cart, Checkout, Orders, Admin, ...)
        ├── components/   # Reusable components (Navbar, ProductCard, Reviews, StatusBadge,...)
        ├── context/      # Auth / Cart / Wishlist providers
        ├── services/     # api.js — central fetch wrapper + API objects
        └── App.jsx       # Route definitions
```

## 5. Features

### 5.1 Authentication & Authorization
- User registration and login with **bcrypt** password hashing.
- **JWT** issued on login/register, stored in `localStorage`, attached to every API request.
- Role-based access: `customer` and `admin`.
- Protected client routes (`/checkout`, `/orders`, `/account`, …) and server routes (cart, wishlist,
  orders, admin-only product/order management).

### 5.2 Catalog & Products
- Product catalog with category browsing, search, sorting, filtering (price range, category),
  and pagination.
- Product details page: image gallery, discount/price, stock status, specifications, related products.
- Admin: create, edit, delete, and upload product images (Cloudinary or URL).

### 5.3 Shopping Cart & Wishlist
- Cart persisted per user; add/update/remove/clear with **stock validation** and effective
  (discounted) pricing.
- Wishlist with add/remove and **move-to-cart**.

### 5.4 Reviews & Ratings
- Authenticated users can write **one review per product** (art later editable).
- Reviews rated 1–5 with optional comment text.
- Average rating and review count are recomputed server-side (MongoDB aggregation) and stored on the
  product for fast display.
- Users can edit/delete their own review; **admins can remove any review**.

### 5.5 Checkout & Orders
- Checkout collects customer info + shipping address (name, phone, street, city, district, zip).
- Payment method: **Cash on Delivery** (temporary; eSewa/Khalti planned).
- **All prices are computed on the server** using current catalog prices — client totals are never
  trusted.
- Subtotal, shipping fee (free above Rs. 10,000, otherwise Rs. 200), and grand total.
- Placing an order **decrements product stock** and **clears the cart**.
- Order history page and per-order detail page;
- Admin can transition orders through statuses: **Pending → Confirmed → Processing → Shipped →
  Delivered** (or **Cancelled**). Cancelling a pending order restores stock.
- Payment statuses: **Pending, Paid, Failed, Refunded**.

## 6. API Reference

All endpoints are under `http://localhost:5000/api`. Protected endpoints require header
`Authorization: Bearer <token>`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | public | Create account (name, email, password) |
| POST | `/auth/login` | public | Log in |
| GET | `/auth/me` | user | Current user profile |
| GET | `/categories` | public | List categories |
| POST/PUT/DELETE | `/categories[/:id]` | admin | Category CRUD |
| GET | `/products` | public | List products (search/filter/sort/paginate) |
| GET | `/products/:id` | public | Product detail |
| POST/PUT/DELETE | `/products[/:id]` | admin | Product CRUD |
| POST | `/upload` | admin | Upload product images (Cloudinary) |
| GET/POST | `/cart` | user | Read cart / add item |
| PUT/DELETE | `/cart/:productId` | user | Update qty / remove item |
| DELETE | `/cart` | user | Clear cart |
| GET/DELETE | `/wishlist` | user | Read / clear wishlist |
| POST | `/wishlist` | user | Add to wishlist |
| DELETE | `/wishlist/:productId` | user | Remove from wishlist |
| POST | `/wishlist/:productId/move-to-cart` | user | Move item to cart |
| GET | `/products/:productId/reviews` | public | List product reviews |
| POST | `/products/:productId/reviews` | user | Create review (one per product) |
| PUT | `/reviews/:id` | owner | Edit review |
| DELETE | `/reviews/:id` | owner/admin | Delete review |
| POST | `/orders` | user | Place order (shippingAddress + `cod`) |
| GET | `/orders` | user | My orders |
| GET | `/orders/:id` | owner/admin | Order detail |
| PUT | `/orders/:id/status` | admin | Update order/payment status |

## 7. Business Rules (Server-Side)

- **Cart pricing:** the effective price = `discountPrice` when lower than `price`, else `price`;
  stored in the cart at add/update time.
- **Order pricing:** recomputed at order time from the **current** product prices in the database —
  the request body cannot influence subtotal/shipping/total.
- **Shipping:** free when subtotal ≥ Rs. 10,000 (or empty), otherwise Rs. 200.
- **Inventory:** adding to cart and placing an order both enforce `quantity ≤ stock`. Placing an
  order subtracts stock; cancelling a pending order adds it back.
- **Reviews:** the unique `(user, product)` index guarantees one review per user per product;
  average = `round10(avg)` written to `product.rating`, count written to `product.reviewCount`.

## 8. Database Design (Mongoose Schemas)

- **User** — `name`, `email` (unique), `password` (hashed), `phone` (10 digits), `role`
  (`customer|admin`), `addresses[]`, `wishlist[]`.
- **Category** — `name`, `slug`, `description`, `image`.
- **Product** — `name`, `slug` (unique), `description`, `price`, `discountPrice`, `images[]`,
  `category` (ref), `brand`, `stock`, `specifications` (map), `rating`, `reviewCount`.
- **CartItem** — `product` (ref), `quantity`, `price`. **Cart** — one per user.
- **Order** — `user` (ref), `items[]` (product ref, name, quantity, price snapshot),
  `shippingAddress` (fullName, phone, addressLine, city, district, zipCode), `subtotal`,
  `shippingCost`, `totalAmount`, `paymentMethod`, `paymentStatus`, `transactionId?`, `orderStatus`.
- **Review** — `user` (ref), `product` (ref), `rating` (1–5), `comment`; unique `(user, product)`.
- **Wishlist** — one per user; array of product refs.

## 9. Implementation Highlights

1. **Secure auth flow** — passwords hashed with bcrypt; JWT verified on every protected request via
   `protect` middleware which loads the live user from the database.
2. **Server-side price integrity** — order totals are derived only from DB products, never from the
   client, preventing price-tampering attacks.
3. **Stock management** — atomic stock checks during cart and order operations; cancellation
   restores inventory.
4. **Review rating aggregation** — MongoDB `$group` aggregation computes average rating +
   count after every review create/update/delete and denormalizes onto the product.
5. **Design-system consistency** — a single `request()` wrapper in `src/services/api.js` centralizes
   JSON, token attachment, and error handling; UI uses a consistent Tailwind design with an orange
   accent and card-based layouts.
6. **Environment-driven config** — `.env` for DB URI, JWT secret, client origin, Cloudinary
   credentials, and an optional custom DNS server for Atlas connectivity.

## 10. Running the Application

### Prerequisites
- Node.js (v20+) and npm
- MongoDB URI (cloud Atlas or local) and JWT secret

### Backend
```bash
cd backend
npm install
cp .env.example .env      # configure MONGO_URI, JWT_SECRET, CLIENT_URL
npm run seed:categories   # optional: seed categories + products
npm run seed:products
npm run dev               # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

Open `http://localhost:5173`, register an account, and start shopping.

## 11. Testing

Testing was performed manually against the live API (PowerShell `Invoke-RestMethod`) and in-browser:

- **Auth:** invalid credentials → 401; protected routes without token → 401.
- **Cart/wishlist:** add/update/remove/clear; quantity limited by stock.
- **Reviews:** unauthenticated → 401; duplicate review → 400; rating out of 1–5 → 400;
  owner-only edit; admin delete; average rating & count update after each operation.
- **Orders (end-to-end):** login → add to cart → cart summary → checkout → place order →
  order-success → order history → order details.
  Verified: subtotal/shipping/total computed server-side; stock decremented; cart cleared;
  non-owner access → 403; invalid order status → 400; cancellation restores stock.
- **Frontend:** `npm run lint` and `npm run build` pass.

[Screenshots: insert here — registration, product listing, product detail with reviews, cart,
checkout, order success, order history, order detail, admin products]

## 12. Conclusion

The project successfully implements a modern, full-stack e-commerce application. All core workflows
— user registration and login, catalog browsing, cart and wishlist management, product reviews and
ratings, Cash-on-Delivery checkout, and order lifecycle management — function end to end. Security
measures such as JWT authentication, role-based access, server-side price calculation, and inventory
validation ensure that business-critical data cannot be tampered with from the client.

## 13. Future Work

- Integrate online payment gateways (**eSewa, Khalti, bank**) and payment webhooks.
- Admin dashboard for **order & user management** (dashboard is currently a placeholder).
- Saved user **address book** and prefill at checkout.
- Customer-initiated order cancellation and return/refund flows.
- Email/SMS notifications on order status changes.
- Functional search with better relevance and product Q&A.
- Automated unit/E2E test suite (Jest, Supertest, Playwright).

## 14. References

1. Mongoose Documentation — https://mongoosejs.com/docs/
2. Express.js Guide — https://expressjs.com/
3. React Documentation — https://react.dev/
4. Vite Guide — https://vitejs.dev/guide/
5. Tailwind CSS Documentation — https://tailwindcss.com/docs
6. JWT (JSON Web Tokens) — https://jwt.io/
7. MongoDB Documentation — https://www.mongodb.com/docs/
8. Cloudinary — https://cloudinary.com/documentation