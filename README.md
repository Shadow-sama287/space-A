# DSA Spaced Repetition (Striver SDE Sheet)

An Anki-style spaced repetition tracking application designed to help software engineers systematically revise DSA sheets. Pre-seeded with the complete **191 problems of Striver's SDE Sheet** linked directly to their respective coding editors on LeetCode, GeeksforGeeks, Coding Ninjas (Code360), InterviewBit, and Spoj.

The interface is built using a striking **Monochrome & Minimalist Brutalism** design aesthetic (strict raw concrete colors, 90-degree sharp corners, bold borders, monospace typography, and hard-flat shadows).

---

## Key Features

*   **Anki-Style SM-2 Scheduler**: Uses the SuperMemo-2 (SM-2) algorithm to compute optimal revision intervals based on your self-reported solving quality:
    *   `Again (0)`: Resets the interval to 1 day and drops the Ease Factor.
    *   `Hard (1)`: Keeps the interval low and decreases the Ease Factor.
    *   `Good (2)`: Multiplies the interval standardly.
    *   `Easy (3)`: Quickly expands the interval and increases the Ease Factor.
*   **Seeded 191 Sheet Problems**: Out-of-the-box pre-seeded problems spanning 27 days of topics (Arrays, Linked Lists, Trees, Stacks, Queues, Graphs, Tries, Dynamic Programming, etc.).
*   **Direct practice links**: Opens LeetCode, GFG, Code360, Spoj, or InterviewBit directly in a new tab when solving.
*   **Direct quick-review modal**: Practiced a problem randomly outside of your queue? Submit a review rating directly from the Explorer list to immediately add it to your spaced repetition queue.
*   **Analytics Dashboard**: Track your daily streaks, topic-wise progress bars, 28-day calendar heatmap, and a 7-day review forecast bar chart.
*   **Full-Stack Next.js + Supabase**: Client/Server SSR setup, secure session-refreshing middleware, and Cloud Database storage.

---

## Technical Stack

*   **Framework**: Next.js 15 (App Router, TypeScript)
*   **Database & Auth**: Supabase (PostgreSQL with Row Level Security)
*   **Styling**: Vanilla CSS (Global Brutalist Tokens, no external library styling clutter)
*   **Hosting**: Vercel (Frontend) + Supabase Cloud (Database)

---

## Local Setup & Installation

### 1. Database Migrations
Create a project on [Supabase](https://supabase.com). Go to the **SQL Editor** in your Supabase dashboard, copy the contents of `schema.sql`, paste it, and click **Run**. This will create the required tables and security policies:
*   `profiles` (user metrics & streaks)
*   `problems` (sheet problems list)
*   `user_problems` (spaced repetition progression)
*   `review_history` (audit logs of all saves)

*Note: Make sure to disable email confirmation in your Supabase Auth settings (**Authentication -> Providers -> Email -> Confirm email**) for seamless testing during local development.*

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_api_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_token
```

### 3. Run Development Server
Install dependencies and launch the dev environment:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Seed the problems
1. Register a new user profile on the landing page.
2. Go to the **Explorer** tab (`/problems`).
3. Click the **SEED STRIVER SDE SHEET** button to load all 191 SDE problems.

---

## Deployment

Deploying the frontend to **Vercel** takes seconds:
1. Initialize Git and push your repository to GitHub.
2. Link your repository in Vercel.
3. Configure the environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in your Vercel settings.
4. Click **Deploy**.
5. Copy your live Vercel URL, go to your **Supabase Dashboard -> Authentication -> Redirect URLs**, and add it to the list to secure redirect paths.
