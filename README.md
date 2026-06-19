Mini Procurement Portal

A full-stack catalog management application built for the YOUMNA technical assessment.

The application allows authenticated users to manage procurement catalog items through a protected Angular frontend connected to an Express API and MongoDB Atlas.

⸻

Tech Stack

* Nx Monorepo
* Angular
* NgRx
* Express.js API
* MongoDB Atlas
* JWT Authentication

⸻

Features

Authentication

* User sign-up
* User sign-in
* User sign-out
* JWT-based authentication
* Sessions persist for 8 hours
* Protected routes redirect unauthenticated users to the sign-in page

Catalog Management

* Protected catalog page
* Catalog items fetched from the backend API
* Loading state
* Empty state
* Error state
* Basic search/filter

Create Catalog Item

* Protected form for creating catalog items
* Created items are persisted in MongoDB
* Catalog list updates after successful item creation

⸻

Data Models

User

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

⸻

API Endpoints

Authentication

POST /auth/signup
POST /auth/signin

Catalog Items

GET /items
POST /items

⸻

Environment Variables

Create a .env file in the project root.

Example:

MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=3333

Do not commit .env to GitHub.

⸻

Installation

npm install

⸻

Running Locally

Run the backend API:

npx nx serve api

The API runs on:

http://localhost:3333

Run the frontend application in a second terminal:

npx nx serve shop --skip-nx-cache

The frontend runs on:

http://localhost:4200

⸻

Local Testing Flow

1. Open the frontend at http://localhost:4200
2. Sign up with a new user account
3. Sign out
4. Sign in using the created credentials
5. View the protected catalog page
6. Create a new catalog item
7. Confirm the item appears in the catalog list
8. Test search/filter functionality
9. Sign out and verify protected routes redirect to /signin

⸻

Project Structure

apps/
  api/        Backend API
  shop/       Angular frontend
libs/
  shop/data                  Data access and auth services
  shop/feature-auth          Authentication and create-item pages
  shop/feature-products      Catalog list page
  shop/feature-product-detail
  shop/shared-ui             Shared UI components
  shared/models              Shared TypeScript models

⸻

Architectural Decisions

* Nx was used to organize the frontend, backend, and shared libraries in one monorepo.
* Angular standalone components were used for modular frontend features.
* JWT authentication was used for stateless session handling.
* MongoDB Atlas was used for persistent cloud database storage.
* Protected frontend routes use an auth guard to prevent unauthenticated access.
* Protected backend endpoints require a valid JWT token.
* NgRx was added to support scalable frontend state management.

⸻

Assumptions

* JWT sessions expire after 8 hours.
* Only authenticated users can access catalog data or create catalog items.
* MongoDB Atlas is used as the database provider.
* The application is intended to run locally for assessment review.

⸻

Bonus / Additional Work

* MongoDB Atlas integration
* Basic pagination support from the original catalog structure
* Docker support from the generated API project structure

⸻

Future Improvements

* Forgot password flow
* More complete NgRx feature stores
* Unit tests
* Seed script
* Docker Compose setup
* Deployment to GCP