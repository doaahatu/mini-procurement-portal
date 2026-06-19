# Mini Procurement Portal

A full-stack catalog management application built for the YOUMNA technical assessment.

The portal allows authenticated users to manage procurement catalog items through a protected Angular frontend, a NestJS API, and MongoDB Atlas.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Application Flow](#application-flow)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Testing the Application Manually](#testing-the-application-manually)
- [Architectural Decisions](#architectural-decisions)
- [Assumptions](#assumptions)
- [Bonus Items](#bonus-items)
- [Future Improvements](#future-improvements)

---

## Overview

Mini Procurement Portal is a catalog management system focused on authentication and protected catalog operations.

Users can:

- Sign up
- Sign in
- Sign out
- Access a protected catalog page
- Search catalog items
- Create new catalog items
- Persist catalog data in MongoDB

The project is implemented as an Nx monorepo to organize frontend, backend, and shared libraries in a scalable structure.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Nx |
| Frontend | Angular |
| State Management | NgRx |
| Backend | NestJS API |
| Database | MongoDB Atlas |
| Authentication | JWT |
| Styling | CSS |
| Package Manager | npm |

---

## Features

### Authentication

- User sign-up
- User sign-in
- User sign-out
- JWT-based authentication
- Session persistence for 8 hours
- Manual sign-out clears local session data
- Protected frontend routes redirect unauthenticated users to the sign-in page
- Protected backend endpoints require a valid JWT token

### Catalog Management

- Protected catalog page
- Catalog items are fetched from the backend API
- Basic search/filter functionality
- Loading state
- Empty state
- Error state

### Create Catalog Item

- Protected create-item form
- Creates new catalog items through the backend API
- Persists created items in MongoDB
- Redirects back to the catalog after successful creation
- Catalog list reflects the newly created item after submission

---

## Application Flow

1. A new user creates an account using the sign-up page.
2. The backend hashes the password and stores the user in MongoDB.
3. The backend returns a JWT token that expires after 8 hours.
4. The frontend stores the token and user session data locally.
5. Authenticated users can access the protected catalog page.
6. Catalog items are fetched from the NestJS API.
7. Users can search/filter catalog items.
8. Users can create new catalog items.
9. Created items are stored in MongoDB and shown in the catalog.
10. On sign-out, local session data is cleared and the user is redirected to sign-in.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | `/auth/signup` | Register a new user | No |
| POST | `/auth/signin` | Sign in and receive JWT token | No |

### Catalog Items

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| GET | `/items` | Get catalog items | Yes |
| POST | `/items` | Create a new catalog item | Yes |

### Root

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API health message |

---

## Data Models

### User

```ts
{
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

CatalogItem
{
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  createdBy: string;
  createdAt: Date;
}

Project Structure
apps/
  api/
    src/
      main.ts
      app.module.ts
      app.controller.ts
    project.json

  shop/
    src/
      app/
        app.routes.ts
        app.routes.server.ts
        app.config.ts

libs/
  shop/
    data/
      src/lib/services/
        auth.service.ts
        auth.guard.ts
        products.service.ts

    feature-auth/
      src/lib/
        signin/
        signup/
        create-item/

    feature-products/
      src/lib/product-list/

    feature-product-detail/

    shared-ui/

  shared/
    models/


## Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=3333
```

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/procurement-portal
JWT_SECRET=replace_with_a_secure_secret
PORT=3333
```

> The `.env` file is ignored by Git and should never be committed.

---

## Installation

Install project dependencies:

```bash
npm install
```

---

## Running Locally

### Start the Backend API

```bash
npx nx serve api
```

The API will run on:

```text
http://localhost:3333
```

### Start the Frontend Application

Open a second terminal and run:

```bash
npx nx serve shop --skip-nx-cache
```

The frontend will run on:

```text
http://localhost:4200
```

---

## Testing the Application

### 1. Create a New Account

Navigate to:

```text
http://localhost:4200/signup
```

Register a new user account.

### 2. Sign In

Navigate to:

```text
http://localhost:4200/signin
```

Log in using the registered credentials.

### 3. Verify Protected Routes

Attempt to access:

```text
http://localhost:4200/products
```

without being authenticated.

Expected behavior:

```text
Redirect to /signin
```

### 4. View Catalog Items

After signing in, open the Catalog page and verify that catalog items are loaded from MongoDB through the NestJS API.

### 5. Search Catalog Items

Use the search field to filter items by:

- Title
- Description
- Category

### 6. Create a New Catalog Item

Navigate to:

```text
http://localhost:4200/create-item
```

Create a new catalog item and verify that it appears in the catalog list.

---

## Architectural Decisions

### Nx Monorepo

Nx was used to organize the frontend, backend, and shared libraries in a single scalable workspace.

### Angular Frontend

Angular was selected for its strong routing system, standalone components, dependency injection, and maintainable architecture.

### NgRx State Management

NgRx was integrated to align with the required technology stack and provide a foundation for scalable state management.

### NestJS Backend

The backend was implemented using NestJS within the Nx monorepo. The API provides authentication and catalog management endpoints while maintaining a modular architecture.

### MongoDB Atlas

MongoDB Atlas was used to persist users and catalog items in a cloud-hosted NoSQL database.

### JWT Authentication

JWT tokens are issued upon successful authentication and remain valid for 8 hours. Protected routes and endpoints require a valid token.

### Protected Routes

Angular route guards restrict access to catalog and item creation pages for unauthenticated users.

---

## Assumptions

- The assessment scope is limited to catalog management.
- Order placement and order tracking are intentionally excluded.
- Sessions remain active for 8 hours unless the user signs out.
- Any authenticated user can view catalog items.
- Any authenticated user can create catalog items.
- MongoDB Atlas is used as the primary database.
- The application is intended to run locally for evaluation.

---

## Bonus Features Implemented

- MongoDB Atlas integration
- Search and filtering functionality
- Protected frontend routes
- Protected backend endpoints
- JWT-based authentication
- Nx monorepo architecture

---

## Future Improvements

- Full NgRx store implementation for authentication and catalog state
- Pagination support
- Improved form validation and error handling
- Unit and integration testing
- Seed script for sample catalog data
- Docker Compose setup
- Cloud deployment (GCP/AWS)

---

## Repository

```text
https://github.com/doaahatu/mini-procurement-portal
```

