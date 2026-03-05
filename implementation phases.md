# 🗺️ Implementation Phase Plan
**Project:** Game Coaching Platform (SaaS & Bounty Board)
**Tech Stack:** PostgreSQL, Express, React, Node.js (PERN) + Next.js

This document outlines the sequential execution strategy for building the platform. Each phase must be completed and tested before moving to the next to maintain data integrity and strict quality control.

---

## Phase 1: Foundation & Repository Management
**Goal:** Establish a rock-solid infrastructure and development environment.

* [ ] **Initialize Repositories:** Set up Git repositories (either a monorepo or separate `frontend` and `backend` directories).
* [ ] **Environment Configuration:** Create `.env` files for local development containing placeholders for database URIs, JWT secrets, and Stripe keys.
* [ ] **Backend Boilerplate:** Initialize the Node.js/Express server. Implement standard middleware (CORS, Helmet for security, JSON body parsing).
* [ ] **Frontend Boilerplate:** Initialize the Next.js application with Tailwind CSS and basic routing structure.

## Phase 2: Database & API Core (The Engine)
**Goal:** Build the PostgreSQL database and the API routes that feed the frontend.

* [ ] **Execute Migrations:** Write and run SQL scripts to create the `users`, `coach_profiles`, `coaching_requests`, and `availability_blocks` tables. Enforce strict `TIMESTAMPTZ` for all dates.
* [ ] **Authentication Flow:** Implement user registration and login endpoints. Set up JWT strategies to differentiate between `player` and `coach` roles.
* [ ] **Bounty Board API (CRUD):** Build Express endpoints for players to create, read, update, and delete their `coaching_requests`.
* [ ] **Implement Regex Scrubbing:** Write the server-side middleware to scan player descriptions and strip out Discord tags, URLs, and phone numbers before database insertion.

## Phase 3: The Frontend Discovery Layer (The Magnet)
**Goal:** Connect the Next.js UI to the backend to render the Demand-Side Magnet.

* [ ] **The "Bounty Board" UI:** Build the public Next.js pages that fetch and display active `coaching_requests`.
* [ ] **Server-Side Data Masking:** Implement the critical Express middleware that checks a coach's subscription status. Ensure it explicitly nullifies contact fields for unauthenticated or free-tier users before sending the JSON payload.
* [ ] **Coach Profiles UI:** Create the frontend interface for coaches to set up their public profiles (game expertise, rank, bio).
* [ ] **Data Fetching:** Wire up the frontend API calls to seamlessly interact with the Express backend using proper error handling.

## Phase 4: Monetization & Webhooks (The Business)
**Goal:** Introduce the financial layer via Stripe Billing to handle SaaS subscriptions.

* [ ] **Stripe Customer Integration:** Create an endpoint to securely generate a Stripe Customer ID and a Checkout Session when a coach upgrades to the "Pro Tier."
* [ ] **Webhook Listener:** Build the Express endpoint to listen for Stripe's `invoice.paid` and `customer.subscription.deleted` events.
* [ ] **Database Sync:** Write the logic to ensure the webhook updates the `subscription_status` in the `coach_profiles` table instantly, locking or unlocking the Bounty Board data.

## Phase 5: CI/CD & Production Deployment
**Goal:** Move the system from local development to the live internet.

* [ ] **Frontend Deployment:** Push the Next.js repository to Vercel. Configure automatic build triggers and set production environment variables.
* [ ] **Backend Deployment:** Deploy the Express API to a hosting provider (e.g., Render, Heroku, or Railway).
* [ ] **Database Hosting:** Provision a managed PostgreSQL instance and run the production database migrations.
* [ ] **End-to-End Testing:** Run live tests using Stripe's test clock to simulate a month passing, ensuring subscriptions renew or cancel correctly without breaking the paywall logic.