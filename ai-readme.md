# AI Agent Instructions & System Context (`AI_README.md`)

## 🎯 Project Goal
You are assisting in the development of a Game Coaching Platform using a B2B SaaS and "Bounty Board" model. The system connects players seeking coaching with game coaches. Coaches pay a monthly SaaS subscription via Stripe to unlock player leads. 

## 💻 ENFORCE SECURITY MECHANISM TO SAFEGUARD THE SYSTEM


## 💻 Tech Stack
* **Frontend:** Next.js, React, Tailwind CSS (Deployed on Vercel)
* **Backend:** Node.js, Express
* **Database:** PostgreSQL (Relational, strictly normalized)
* **Payments:** Stripe Billing & Webhooks

## 🚨 CRITICAL DIRECTIVES & HARD RULES
When generating code, refactoring, or suggesting architecture, you MUST adhere to the following constraints. Do not deviate from these rules under any circumstances.

### 1. Server-Side Data Masking (The Paywall)
* **Rule:** Never send unmasked player contact information to the Next.js frontend for free-tier users.
* **Implementation:** All data redaction must happen in the Node.js/Express middleware. If a `coach_profile` does not have an active `subscription_status`, the API payload must explicitly set fields like `discord_tag`, `social_links`, and `exact_username` to `null` before sending the JSON response.
* **Anti-Pattern:** Do NOT suggest hiding data using CSS (e.g., `display: none`) or React conditional rendering on the client side.

### 2. Input Sanitization (Anti-Leakage)
* **Rule:** Prevent players from bypassing the platform by typing contact info into public descriptions.
* **Implementation:** When generating Express routes for creating or updating `coaching_requests`, you must include Regex-based scrubbing functions. Automatically strip or reject strings that match Discord tags, email addresses, URLs, or phone numbers in free-text fields. Maximize the use of structured enums/dropdowns over free-text.

### 3. Database Integrity & Zero Overlap
* **Rule:** Maintain strict quality control on scheduling and financial data. There must be zero overlap in coaching availability.
* **Implementation:** * Always use `TIMESTAMPTZ` in PostgreSQL to ensure global timezone synchronization in UTC.
    * Enforce database-level constraints (e.g., `CHECK (end_time > start_time)`).
    * When writing booking or transaction logic, utilize PostgreSQL transactions (`BEGIN`, `COMMIT`, `ROLLBACK`) and row-level locks (`FOR UPDATE SKIP LOCKED`) to prevent race conditions.

### 4. Code Style & Architecture
* **Separation of Concerns:** Keep Next.js focused strictly on UI, routing, and rendering. Keep Express focused strictly on business logic, Stripe webhooks, and database interactions.
* **Error Handling:** Fail securely. If a Stripe webhook fails or a database transaction encounters an error, ensure no partial data is committed and no sensitive error stacks are leaked to the client.
