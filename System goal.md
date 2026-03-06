# 📝 Technical Architecture & System Requirements (TRD)

**Project:** Game Coaching Platform (SaaS & Bounty Board Model)  
**Tech Stack:** PERN Stack (PostgreSQL, Express, React, Node.js) with Next.js

---

## 1. Executive Summary
The platform operates as a B2B Software as a Service (SaaS) for game coaches, featuring a built-in "Demand-Side Magnet" (Bounty Board) for players. The system avoids complex multi-party escrow logic by utilizing a subscription-based revenue model for coaches, while players use the platform for discovery and lead generation.

## 2. Core Business Logic & Monetization
The platform prioritizes lead generation and coach discovery over transaction brokering.

* **Revenue Model:** Stripe Billing handles recurring monthly subscriptions for coaches (Pro Tier).
* **The "Bounty Board" (Lead Generation):** Players post "Coaching Requests" detailing their needs and budget.
* **The Paywall:** Free-tier coaches can view the existence of leads (Game, Goal, Budget) but cannot view contact information or player identities. Subscribing to the Pro Tier unlocks this data.

## 3. Security & Data Integrity
To maintain strict quality control and ensure the paywall remains uncompromised, the system enforces rigid data handling rules.

### 3.1. Server-Side Data Masking
Data redaction must occur in the Node.js/Express backend, never on the Next.js frontend.
> **Constraint:** API endpoints serving the "Bounty Board" must verify the user's Stripe subscription status via middleware. If the user is unauthenticated or on a free tier, the payload must return `null` for all contact fields (Discord, Social Links, exact Usernames) before the JSON response is transmitted over the network.

### 3.2. Input Sanitization & Anti-Leakage
To prevent players from manually bypassing the paywall by typing their contact info into public fields:
* **Structured Inputs:** Use dropdowns for Game, Rank, and Goals to limit free-text entry.
* **Regex Scrubbing:** The Express backend must pass all description text through a Regular Expression filter that detects and strips out patterns resembling Discord tags, URLs, email addresses, and phone numbers before committing to the database.

## 4. Database Architecture (PostgreSQL)



The relational schema is designed for zero overlap in data and maximum query efficiency. Using `TIMESTAMPTZ` ensures global time zone synchronization.

### Core Tables

| Table Name | Primary Purpose | Key Fields |
| :--- | :--- | :--- |
| `users` | Base authentication and role management. | `id` (UUID), `email`, `role` (Enum), `password_hash` |
| `coach_profiles` | Stores SaaS specific data for admitted coaches. | `user_id` (FK), `stripe_customer_id`, `subscription_status` |
| `coaching_requests` | The Bounty Board entries created by players. | `player_id` (FK), `game_title`, `target_rank`, `budget` |
| `availability_blocks` | Manages coach scheduling with zero overlap. | `coach_id` (FK), `start_time` (TIMESTAMPTZ), `end_time`, `is_booked` |

## 5. Third-Party Integrations
* **Stripe Billing:** Handles the SaaS subscription lifecycle.
* **Stripe Webhooks:** The Express server will expose an endpoint to listen for `invoice.paid` and `customer.subscription.deleted` events to automatically update the `subscription_status` in the `coach_profiles` table, instantly locking or unlocking the Bounty Board data.