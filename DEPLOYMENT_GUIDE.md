# Deployment Guide for Kisan Saathi

## Part 1: Prerequisites

1.  **GitHub Repository**: Ensure your project is pushed to GitHub.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
3.  **Backend Deployment**: Since your frontend connects to a backend (`http://localhost:8000`), your backend must be deployed publicly for the Vercel frontend to reach it.

---

## Part 2: Deploying the Frontend to Vercel

1.  **Log in to Vercel** and click **"Add New..."** -> **"Project"**.
2.  **Import Git Repository**: connect your GitHub account and select the `Kishan Saathi` repository.
3.  **Configure Project**:
    *   **Framework Preset**: Select `Next.js`.
    *   **Root Directory**: Click "Edit" and select `front-end`. **(Crucial Step)**
4.  **Environment Variables**:
    Expand the "Environment Variables" section. You need to add all the variables from your `.env.local` file, but with one major change:

    | Variable Name | Value |
    | :--- | :--- |
    | `GEMINI_API_KEY` | `AIzaSy...` (Your actual key) |
    | `NEXT_PUBLIC_FIREBASE_API_KEY` | `...` (From .env.local) |
    | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `...` (From .env.local) |
    | `...` (Other Firebase keys) | `...` (From .env.local) |
    | `NEXT_PUBLIC_API_URL` | **YOUR_PRODUCTION_BACKEND_URL** (e.g., `https://agrisakhi-api.onrender.com/api/v1`) |

    > **Note**: Do NOT use `http://localhost:8000` for `NEXT_PUBLIC_API_URL` on Vercel. It will not work.

5.  Click **Deploy**.

---

## Part 3: Deploying the Backend (Recommendation)

Vercel is optimized for Frontends. For your **FastAPI Python Backend**, we recommend **Render** or **Railway**.

### Option A: Deploy to Render (Easiest & Free)

1.  Sign up at [render.com](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repo.
4.  **Root Directory**: `backend`.
5.  **Build Command**: `pip install -r requirements.txt`.
6.  **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
7.  **Environment Variables**: Add your `GEMINI_API_KEY` and other backend secrets here.
8.  Deploy! You will get a URL like `https://your-app.onrender.com`.
9.  **Update Vercel**: Go back to Vercel and update `NEXT_PUBLIC_API_URL` with this new URL (plus `/api/v1`).
