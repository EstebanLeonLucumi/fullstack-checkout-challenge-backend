# Backend API — Product Checkout with Payment Provider

REST API for a product store checkout flow: catalog, customers, credit-card payment (Sandbox), transactions, stock updates, and deliveries. Built with **NestJS**, **TypeScript**, **Prisma**, and **PostgreSQL**, following **Hexagonal Architecture** and **Ports & Adapters**.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Data Model](#data-model)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Installation & Running](#installation--running)
- [Project Structure](#project-structure)
- [Business Flow](#business-flow)
- [Security & Validation](#security--validation)
- [Deployment](#deployment)
- [References](#references)

---

## Overview

This backend supports a 5-step checkout flow:

1. **Product page** — List products and stock.
2. **Credit card & delivery** — Collect payment and delivery data.
3. **Summary** — Show product amount, base fee, delivery fee, and payment action.
4. **Final status** — Create transaction PENDING in backend and obtain order reference → call payment provider → when payment is completed or failed: update transaction with result; **only if APPROVED**: create delivery and update product stock.
5. **Back to product page** — Show result and updated stock.

The API exposes **products**, **customers**, **transactions**, and **deliveries**, with different HTTP methods (GET, POST) and validations. Sensitive data (e.g. card data) is not persisted; it is sent only to the payment provider (Sandbox).

---

## Tech Stack

| Layer           | Technology                          |
|----------------|-------------------------------------|
| Runtime        | Node.js                             |
| Framework      | NestJS                              |
| Language       | TypeScript                          |
| Database       | PostgreSQL                          |
| ORM / Client   | Prisma                              |
| Validation     | class-validator, class-transformer   |
| HTTP Client    | Axios (@nestjs/axios)               |

---

## Architecture

- **Hexagonal Architecture (Ports & Adapters):** Business logic lives in **application** (use cases, services) and **domain** (entities, value objects). **Infrastructure** implements ports (repositories, payment provider, config).
- **Ports:** `ProductRepositoryPort`, `CustomerRepositoryPort`, `TransactionRepositoryPort`, `DeliveryRepositoryPort`, `PaymentProviderPort`, `AppConfigPort`, `OrderReferencePort`.
- **Adapters:** Prisma repositories, Sandbox payment provider (HTTP), env-based config, order reference counter.
- **Controllers** only map HTTP to application input and return application output; they do not contain business rules.
- Use cases and services orchestrate domain logic and ports; errors are mapped to HTTP exceptions and centralized messages.

---

## Data Model

Designed for: **stock**, **transactions**, **customers**, and **deliveries** with clear relationships.

```
┌─────────────────┐       ┌──────────────────────┐       ┌─────────────────┐
│    Product      │       │  TransactionProduct │       │   Transaction   │
├─────────────────┤       ├──────────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ productId (FK)       │       │ id (PK)         │
│ name            │       │ transactionId (FK)   │──────►│ status          │
│ description     │       │ quantity             │       │ subtotal        │
│ amount, currency│       │ unitPrice, totalAmount│       │ baseFee         │
│ image           │       └──────────────────────┘       │ deliveryFee     │
│ stock           │                                       │ totalAmount     │
│ createdAt       │                                       │ currency        │
│ updatedAt       │                                       │ customerId (FK) │
└─────────────────┘                                       │ deliveryId (FK) │
                                                           │ externalTxId   │
                                                           │ createdAt      │
                                                           │ updatedAt      │
                                                           └────────┬───────┘
                                                                    │
┌─────────────────┐       ┌─────────────────┐                     │
│  OrderReference  │       │    Customer      │◄────────────────────┘
│  Counter         │       ├─────────────────┤
├─────────────────┤       │ id (PK)          │
│ id = "singleton" │       │ email (unique)   │
│ nextValue        │       │ full_name        │
└─────────────────┘       │ address, city   │
                            │ createdAt       │
                            └────────┬───────┘
                                     │
                            ┌────────▼───────┐
                            │    Delivery     │
                            ├────────────────┤
                            │ id (PK)        │
                            │ customerId(FK) │
                            │ address, city  │
                            │ createdAt      │
                            │ updatedAt      │
                            └────────────────┘
```

**Enums:** `Currency` (COP, USD), `TransactionStatus` (PENDING, APPROVED, DECLINED, ERROR).

**Notes:**

- `Transaction` has many `TransactionProduct` (line items); each line references one `Product`.
- `Customer` has many `Transaction`s and many `Delivery`s. A transaction can have one `Delivery` when status is APPROVED.
- `OrderReferenceCounter` is a single-row table used to generate consecutive order references (e.g. `order_001`, `order_002`).

---

## API Endpoints

Base URL: `http://localhost:3000` (or your deployed URL).

All successful responses use a consistent envelope when using the global interceptor:

```json
{
  "statusCode": 200,
  "message": "Product found successfully",
  "data": { ... },
  "timestamp": "2025-01-29T..."
}
```

Error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "data": null,
  "timestamp": "2025-01-29T..."
}
```

### Products

| Method | Path            | Description                    | Request body | Response |
|--------|-----------------|--------------------------------|--------------|----------|
| GET    | `/products`    | List all products (with stock) | —            | `data`: array of products |
| GET    | `/products/:id`| Get one product by id          | —            | `data`: product or 404   |

### Customers

| Method | Path                 | Description              | Request body | Response |
|--------|----------------------|--------------------------|--------------|----------|
| POST   | `/customers`         | Create customer          | JSON: email, fullName, address?, city? | `data`: customer, 201 |
| GET    | `/customers/:id`    | Get customer by id       | —            | `data`: customer or 404 |
| POST   | `/customers/by-email` | Get customer by email   | JSON: email  | `data`: customer or 404 |

**Create customer body (example):**

```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "address": "Street 123",
  "city": "Bogotá"
}
```

### Transactions

| Method | Path                 | Description                    | Request body | Response |
|--------|----------------------|--------------------------------|--------------|----------|
| POST   | `/transactions`      | Create transaction (manual)    | See below    | `data`: transaction |
| POST   | `/transactions/checkout` | **Checkout**: (1) Create transaction PENDING and obtain reference, (2) call payment provider, (3) poll until final status, (4) update transaction with result; **only if APPROVED**: create delivery and update stock | See below | `data`: created/updated transaction |

**Checkout body (POST `/transactions/checkout`):**

```json
{
  "checkout": {
    "credit_card": {
      "number": "4111111111111111",
      "exp_month": "12",
      "exp_year": "29",
      "cvc": "123",
      "card_holder": "John Doe"
    },
    "installments": 1
  },
  "transaction": {
    "customerId": "uuid-of-customer",
    "transactionProducts": [
      { "productId": "uuid-of-product", "quantity": 2 }
    ]
  }
}
```

**Checkout flow:** (1) Create transaction PENDING in backend and obtain order reference. (2) Call payment provider with card, amount, and reference. (3) Poll transaction status until APPROVED, DECLINED, or ERROR (or timeout). (4) Update transaction in DB with result. **Only if status is APPROVED:** create delivery (if customer has address and city) and decrement product stock.

### Payment provider (internal)

| Method | Path                     | Description                    |
|--------|---------------------------|--------------------------------|
| POST   | `/payment-provider/checkout` | Execute checkout (card + amount, etc.) |

---

**Postman**

- **Postman Collection:** [Backend API Collection](https://web.postman.co/workspace/My-Workspace~63dd8361-bae1-4f4c-84f7-6933a27596b6/collection/16004267-5c22f977-c2ab-423c-bcb8-1a239f936048?action=share&source=copy-link&creator=16004267)

Base URL for local: `http://localhost:3000`.

---

## Environment Variables

Create a `.env` in the project root (see `.env.example` if present). Required and optional variables:

| Variable                      | Required | Description |
|------------------------------|----------|-------------|
| `DATABASE_URL`               | Yes      | PostgreSQL connection string (e.g. `postgresql://user:pass@localhost:5432/dbname`) |
| `PORT`                       | No       | Server port (default `3000`) |
| `NODE_ENV`                   | No       | `development` \| `production` (affects error details in responses) |
| `CORS_ORIGIN`                | No       | Allowed origins, comma-separated (e.g. `http://localhost:5173`). If omitted, all origins allowed (dev only). |
| `CURRENCY`                   | No       | Default currency (e.g. `COP`) |
| `BASE_FEE`                   | No       | Base fee amount (integer) |
| `DELIVERY_FEE`               | No       | Delivery fee amount (integer) |
| `PAYMENT_PROVIDER_BASE_URL`  | Yes*     | Payment provider API base URL (Sandbox UAT) |
| `PAYMENT_PROVIDER_PUBLIC_KEY`| Yes*     | Public API key (Sandbox) |
| `PAYMENT_PROVIDER_PRIVATE_KEY` | Yes*  | Private API key (Sandbox) |
| `PAYMENT_PROVIDER_INTEGRITY_KEY` | Yes* | Integrity key (Sandbox) |

\* Required for checkout; without them, payment provider calls will fail.

---

## Installation & Running

**Prerequisites:** Node.js (v18+), Yarn (or npm), PostgreSQL, and (for Sandbox) the provided API keys and UAT base URL.

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd prueba-tecnica-backend
   yarn install
   ```

2. **Database**

   - Create a PostgreSQL database and set `DATABASE_URL` in `.env`.
   - Or run PostgreSQL via Docker:

     ```bash
     docker-compose up -d
     ```

   - Generate Prisma client and run migrations:

     ```bash
     npx prisma generate
     npx prisma migrate deploy
     ```

   - Seed products (dummy data): run the seed script, e.g. `npx ts-node prisma/seeder.ts` (with `DATABASE_URL` set).

3. **Configure `.env`**

   - Set `DATABASE_URL`, payment provider Sandbox URL and keys, and optionally `PORT`, `CORS_ORIGIN`, `BASE_FEE`, `DELIVERY_FEE`, `CURRENCY`.

4. **Run the app**

   ```bash
   # Development
   yarn run start:dev

   # Production build + run
   yarn run build
   yarn run start:prod
   ```

   API base: `http://localhost:3000` (or the port you set).

---

## Project Structure

```
prueba-tecnica-backend/
├── prisma/
│   ├── schema.prisma      # Data model and enums
│   ├── migrations/        # SQL migrations
│   └── seeder.ts         # Seed products
├── src/
│   ├── common/           # Filters, interceptors, shared utils (e.g. messages)
│   ├── config/           # App config (currency, fees)
│   ├── database/         # Prisma module and service
│   ├── products/         # Product domain, application, infrastructure
│   ├── customer/         # Customer domain, application, infrastructure
│   ├── transactions/     # Transaction, checkout, delivery, order reference
│   ├── payment-provider/ # Payment provider port and Sandbox adapter
│   ├── app.module.ts
│   └── main.ts
├── test/                 # E2E tests
├── docker-compose.yml    # PostgreSQL for local dev
├── package.json
└── README.md
```

Each bounded context (e.g. `products`, `customer`, `transactions`, `payment-provider`) follows:

- **domain/** — Entities, value objects, domain services.
- **application/** — Use cases, input/output DTOs, ports (interfaces), application services.
- **infrastructure/** — Controllers, DTOs for HTTP, adapters (repositories, external APIs), mappers.

---

## Business Flow

1. **Product page** — Frontend calls `GET /products` or `GET /products/:id` to show catalog and stock.
2. **Credit card & delivery** — User enters card (and delivery) data; frontend may create/load customer via `POST /customers` or `POST /customers/by-email`.
3. **Summary** — Frontend shows product amount, base fee, delivery fee; user confirms.
4. **Payment** — Frontend calls `POST /transactions/checkout` with `checkout` (card, installments) and `transaction` (customerId, transactionProducts). Backend:
   - Creates a PENDING transaction in the backend and obtains an order reference.
   - Calls the payment provider (Sandbox) with that reference to complete the payment.
   - Polls the provider until the transaction reaches a final state (APPROVED, DECLINED, or ERROR) or times out.
   - Updates the transaction in the DB with the result. **Only if the status is APPROVED:** creates the delivery (when the customer has address and city) and decrements product stock.
5. **Result** — Backend returns the final transaction; frontend shows success/failure and redirects to product page (stock updated via next `GET /products` or `GET /products/:id`).

---

## Security & Validation

- **Sensitive data:** Credit card data is not stored; it is sent only to the payment provider (Sandbox) over HTTPS. Logging interceptors mask fields such as `password`, `cvc`, `private`, `secret`.
- **Validation:** Request bodies are validated with `class-validator`; invalid payloads return 400 with a single message (e.g. from a central `Messages` file).
- **CORS:** Configurable via `CORS_ORIGIN`; in production, set explicit origins.
- **Errors:** Global exception filter returns consistent JSON; in production, internal errors do not expose stack traces. All user-facing messages are centralized in English in `src/common/utils/messages.ts`.
- **Database:** Prisma with parameterized queries; migrations for schema changes.

---

## Deployment

The app listens on `process.env.PORT` (default `3000`), suitable for cloud platforms (e.g. AWS ECS/EKS, Lambda + HTTP, Railway, Render).

- **Build:** `yarn run build` → output in `dist/`.
- **Start:** `yarn run start:prod` (runs `node dist/src/main.js`).
- **Database:** Run migrations and seed on the target DB using `DATABASE_URL` (public URL for the deployment environment).
- **Environment:** Set all required env vars (including payment provider Sandbox keys and `CORS_ORIGIN`) in the hosting console.

**Deployed API:** [https://fullstack-checkout-challenge-backend-production.up.railway.app](https://fullstack-checkout-challenge-backend-production.up.railway.app)

---

## References

- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [Payment provider — Colombia quick start](https://docs.wompi.co/docs/colombia/inicio-rapido/)
- [Payment provider — Environments and keys](https://docs.wompi.co/docs/colombia/ambientes-y-llaves/)
- [Paying with cards (support)](https://soporte.wompi.co/hc/es-419/articles/360057781394)

---

## License

UNLICENSED (see `package.json`).
