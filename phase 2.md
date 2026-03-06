🏗️ Phase 2 Implementation Walkthrough: Database & API Core
This document provides a detailed architectural breakdown of the Phase 2 implementation for the Game Coaching Platform. It is designed to be evaluated against the core project requirements outlined in System goal.md, 
ai-readme.md
, and 
maintainable.md
.

1. Database Architecture & Migrations (PostgreSQL)
The database was built with strict constraints to ensure zero overlap and maintain data integrity at the lowest possible level.

migrations/001_create_users.sql
:
Uses UUID as the primary key.
Implements a custom CREATE TYPE user_role AS ENUM ('player', 'coach') to strictly enforce role assignment natively in the database.
migrations/002_create_coach_profiles.sql
:
Creates a 1-to-1 relationship with users via a UUID Foreign Key (ON DELETE CASCADE).
Implements CREATE TYPE subscription_status AS ENUM ('free', 'pro'). This is the core flag that will power the Phase 3 paywall.
migrations/003_create_coaching_requests.sql
 (The Bounty Board):
Implements CREATE TYPE request_status AS ENUM ('open', 'filled', 'cancelled').
Validates financial data with CHECK (budget >= 0).
Stores discord_tag, social_links, and exact_username (which the API layer protects).
migrations/004_create_availability_blocks.sql
:
Uses strict TIMESTAMPTZ data types to guarantee timezone safety across global users.
Zero Overlap Enforcement: Includes a hard constraint CHECK (end_time > start_time) to prevent impossibly booked time slots.
Migration Runner (
migrations/run_migrations.js
):
A Node.js utility utilizing the pg library to execute SQL files sequentially against the DATABASE_URL environment variable.
2. Server Architecture (Express 3-Tier Model)
As mandated by 
maintainable.md
, the backend strictly separates network logic from business logic.

Routing Layer (src/routes/*):
Defines endpoints (GET, POST, PUT, DELETE), applies authentication middlewares, and passes payloads directly to controllers. Absolutely no business logic lives here.
Controller Layer (src/controllers/*):
Responsible for HTTP input validation (e.g., verifying budget is a number or status is a valid enum).
Catches all errors from the Service layer and sanitizes 500-level errors to ensure raw stack traces or DB errors are never leaked to the client.
Service Layer (src/services/*):
Handles all direct interactions with the pg.Pool (
src/db.js
).
authService.js
 handles bcryptjs (cost factor 12) encryption and signs jsonwebtoken tokens embedded with { userId, role }.
On coach registration, 
authService.js
 automatically creates an empty coach_profile to maintain referential integrity.
3. Security Mechanisms & Compliance
This implementation strictly adheres to the "Hard Rules" defined in 
ai-readme.md
.

A. The Paywall & Server-Side Data Masking (Rule 1)
Implementation: In 
src/services/requestService.js
, every GET request (returning lists or single requests) passes through a 
maskContactFields()
 utility.
Behavior: For Phase 2, this function explicitly overwrites the database values for discord_tag, social_links, and exact_username to null before sending the JSON response.
Future-Proofing: In Phase 3, this hardcoded null return will be replaced with dynamic logic determining if req.user has an active pro Stripe subscription status.
B. Anti-Leakage via Regex Scrubbing (Rule 2)
Implementation: 
src/middleware/scrubContactInfo.js
 is an Express middleware interceptor applied to the POST /api/requests and PUT /api/requests/:id routes.
Behavior: It intercepts the req.body.description and passes it through five rigorous regex patterns before the payload ever reaches the Controller. It strips:
Discord Tags (Word#0000)
Full URLs (http://, https://)
Partial URLs (www., discord.gg/, t.me/)
Emails
Phone Numbers
Single Responsibility Principle: The Service layer assumes all incoming strings are clean, preventing redundant regex execution across the backend.
C. Access Control Guardrails
Endpoint authorization is modularized in 
src/middleware/authenticate.js
.
Alongside standard JWT verification, a specific 
requirePlayer
 middleware ensures that only accounts strictly flagged as player in the JWT payload can create or alter Bounty Board requests. No routing mix-ups are physically possible.
4. Run State & Global Error Handling
src/app.js
: All API routes are mounted seamlessly.
Global Error Catcher: Appended at the end of the Express stack. Any internal error passed via next(err) that bypasses standard controllers is caught and neutralized into a generic JSON error object. No internal PostgreSQL errors can ever reach the frontend.

---

## 5. API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Registers a new user. Expects `email`, `password`, and `role` (`player` or `coach`). If `coach`, auto-creates a linked `coach_profile`. Returns a JWT token. |
| `POST` | `/api/auth/login` | No | Logs in an existing user. Expects `email` and `password`. Returns a fresh JWT token. |

### Bounty Board CRUD (`/api/requests`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/requests` | No | Fetches a paginated list of all open coaching requests. *Security: Contact fields are permanently masked to `null`.* |
| `GET` | `/api/requests/:id` | No | Fetches a single coaching request by its UUID. *Security: Contact fields are permanently masked to `null`.* |
| `POST` | `/api/requests` | Yes (`player`) | Creates a new coaching request. The `description` field is passed through the regex scrubber before insertion. Contact fields can be provided but will not be readable back via `GET`. |
| `PUT` | `/api/requests/:id` | Yes (Owner) | Updates an existing coaching request. Only the player who created the request can update it. Can also update the `status` (`open`, `filled`, `cancelled`). |
| `DELETE` | `/api/requests/:id` | Yes (Owner) | Hard deletes the coaching request from the database. |