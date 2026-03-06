# 🚀 Phase 2 API Testing Guide (Postman)

This guide provides step-by-step instructions to test the Phase 2 API endpoints using Postman. Ensure your backend server is running (`npm run dev` in the `backend` folder) and listening on `http://localhost:5000`.

---

## Step 1: Register a Player
First, create a player account so you can create a Bounty Board request later.

1. Open Postman and create a new request:
   - **Method:** `POST`
   - **URL:** `http://localhost:5000/api/auth/register`
2. Go to the **Body** tab.
3. Select **raw** and ensure the dropdown on the right is set to **JSON**.
4. Paste this JSON:
   ```json
   {
     "email": "player1@test.com",
     "password": "password123",
     "role": "player"
   }
   ```
5. Click **Send**.
6. **Expected Result:** A `201 Created` status with `success: true` and a `token` string. 
   > ⚠️ **IMPORTANT:** Copy that `token` string — you will need it for Step 3.

---

## Step 2: Register a Coach (Optional)
Let's make sure the coach registration logic works (which auto-creates the `coach_profile` row in the database).

1. Change the email and role in the same `POST` request to:
   ```json
   {
     "email": "coach1@test.com",
     "password": "password123",
     "role": "coach"
   }
   ```
2. Click **Send**.
3. **Expected Result:** A `201 Created` status. The database just created a `users` row AND a matching `coach_profiles` row for this coach.

---

## Step 3: Create a Coaching Request (Testing the Regex Scrubber)
Now let's test the "Demand-Side Magnet" and make sure the server dynamically strips out Discord tags, URLs, and phone numbers from descriptions.

1. Create a new request in Postman:
   - **Method:** `POST`
   - **URL:** `http://localhost:5000/api/requests`
2. Go to the **Auth** (or Authorization) tab.
3. Select **Bearer Token** as the Type.
4. Paste the long `token` string you copied from the **Player** registration in Step 1.
5. Go to the **Body** tab > **raw** > **JSON**.
6. Paste this JSON (notice the Discord tag, URL, and phone number in the description, and the explicit contact fields):
   ```json
   {
     "game_title": "Valorant",
     "target_rank": "Diamond",
     "goal": "Improve crosshair placement",
     "budget": 50,
     "description": "Please help me! My discord is Kurt#1234 and my profile is http://tracker.gg/kurt. Call me at 123-456-7890.",
     "discord_tag": "Kurt#1234",
     "social_links": "http://tracker.gg/kurt",
     "exact_username": "Kurt123"
   }
   ```
7. Click **Send**.
8. **Expected Result:** A `201 Created` status. Look at the `description` in the response — the Discord tag, URL, and phone number should all be replaced with `[removed]`. Contact fields like `discord_tag`, `social_links`, and `exact_username` will strictly return `null` in the API response, even though they were saved to the database.

---

## Step 4: Get All Requests (Testing the Paywall / Data Masking)
Finally, verify that a public `GET` request cannot see sensitive contact data, satisfying the core Phase 2 security requirement.

1. Create a new request in Postman:
   - **Method:** `GET`
   - **URL:** `http://localhost:5000/api/requests`
2. Leave the **Auth** tab empty (this is a public endpoint right now).
3. Click **Send**.
4. **Expected Result:** A `200 OK` status with an array containing the request you just made. Crucially, `discord_tag`, `social_links`, and `exact_username` **must be `null`**, proving the data masking middleware works as intended.

---

## Other Endpoints to Test

*   **`POST /api/auth/login`**: 
    *   **Body:** `{"email": "player1@test.com", "password": "password123"}`
    *   **Result:** Returns a fresh JWT token.
*   **`PUT /api/requests/:id`**: 
    *   Replace `:id` in the URL with the UUID from step 3. 
    *   Requires the Bearer token in Auth. 
    *   **Body:** `{"status": "filled"}` (Tests the strict PostgreSQL ENUM update).
*   **`DELETE /api/requests/:id`**: 
    *   Replace `:id` with the UUID. 
    *   Requires the Bearer token. 
    *   Tests deletion (only the owner can delete).
