# 🛠️ Core Engineering Principles (`DEVELOPMENT_STANDARDS.md`)

This document outlines the architectural guidelines and coding standards for the Game Coaching Platform. Every pull request and new feature must adhere to these principles to ensure the codebase remains maintainable, scalable, and highly readable.

## 1. Separation of Concerns (SoC) & The Layered Architecture
Do not mix network logic, business logic, and database queries in the same file. The Express backend must strictly adhere to a 3-tier architecture:



* **Routing Layer (`/routes`):** Responsible ONLY for receiving the HTTP request, defining the endpoint path, and passing the payload to the controller. *No business logic goes here.*
* **Controller Layer (`/controllers`):** Handles request validation, calls the necessary service functions, and formats the HTTP response (status codes and JSON).
* **Service/Data Access Layer (`/services` or `/models`):** This is where the actual business logic lives. All PostgreSQL queries, Stripe API calls, and complex data formatting happen here. 

## 2. The Single Responsibility Principle (SRP)
A function, file, or component should have one, and only one, reason to change. 

* **Backend Example:** If you have a function that registers a user, it should not *also* be responsible for sending the welcome email. Create a `createUser` function and a separate `sendWelcomeEmail` utility.
* **Frontend Example (Next.js):** A React component should do one thing. If a `CoachProfileCard` component is also fetching its own data and handling complex state management, it is doing too much. Separate the UI rendering (dumb components) from the data fetching (smart components/hooks).

## 3. Strict Data Quality & Zero Overlap (DRY)
We maintain a strict standard for data integrity. "Don't Repeat Yourself" (DRY) applies to both code and database records.

* **Database Level:** Never handle data validation *only* on the frontend. PostgreSQL is the final source of truth. Utilize `ENUMs`, `UNIQUE` constraints, and `CHECK` constraints to ensure bad data (or overlapping schedules) cannot exist in the system.
* **Code Level:** If you write the same block of logic twice, abstract it into a utility function. For example, the Regex scrubbing logic for the Bounty Board descriptions must be a single middleware function imported wherever needed, not rewritten in every route.

## 4. Fail Fast & Secure Error Handling
Errors should be caught early and handled gracefully. 

* **No Silent Failures:** If a database transaction fails, immediately trigger a `ROLLBACK`. 
* **Sanitize Errors:** Never leak raw stack traces or database error messages to the Next.js client. Catch the error in the backend and return a standardized, safe JSON response:
  ```json
  {
    "success": false,
    "error": "The requested time slot is no longer available.",
    "code": "SLOT_UNAVAILABLE"
  }