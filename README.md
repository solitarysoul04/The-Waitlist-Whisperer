# The Waitlist Whisperer 🚂

Booking long-distance rail transit on busy routes often leaves you stuck on a waitlist. Travelers spend days constantly refreshing to see if their ticket will clear. **The Waitlist Whisperer** is a visual dashboard that tracks and predicts waitlist clearing chances for specific high-traffic routes based on historical data heuristics.

## Features
*   **Algorithmic Predictions:** Calculates confirmation probability based on waitlist position, days remaining, coach class, and seasonal route density.
*   **Risk Classification:** Categorizes your ticket into Safe, Moderate, or Danger tiers.
*   **Clearance Trajectory:** Visualizes the simulated day-by-day drop in your waitlist position using Recharts.
*   **Modern UI:** A dark-mode, responsive dashboard built with Tailwind CSS.

## Tech Stack
*   **Frontend:** Next.js 14, React, Tailwind CSS (v3), Recharts
*   **Backend:** FastAPI (Python), Pydantic
*   **Deployment:** Vercel

## Running Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/solitarysoul04/The-Waitlist-Whisperer.git](https://github.com/solitarysoul04/The-Waitlist-Whisperer.git)
   cd The-Waitlist-Whisperer

2. **Install Frontend Dependencies:**
   ```bash
   npm install

3. **Run the Development Server**
   ```bash
   npm run dev

**The frontend will be available at:**
```bash 
http://localhost:3000

