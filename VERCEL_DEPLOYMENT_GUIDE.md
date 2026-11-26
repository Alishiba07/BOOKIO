# Complete Vercel Deployment Guide for BOOKIO (MERN Stack)

Deploying on **Vercel** is much easier, faster, and more reliable than AWS Vocareum because:
- **100% Free Forever** (No 3-hour timeouts, no shut downs overnight).
- **Free Automatic SSL/HTTPS** (No "Not Secure" warning in the browser).
- **Continuous Deployment**: Every `git push` automatically rebuilds and updates your live site.

---

## Architecture on Vercel

```
[ User Browser ] 
       │
       ▼
[ Frontend (React/Vite) ] ── (HTTPS: bookio.vercel.app)
       │
       ▼ API Calls (/api/...)
[ Backend (Express Serverless) ] ── (HTTPS: bookio-backend.vercel.app)
       │
       ▼
[ Cloud Database ] ── (MongoDB Atlas Free M0 Cluster)
```

---

## Step 1: Set Up Free Cloud MongoDB Atlas (3 Minutes)

Since Vercel is serverless, MongoDB must run in the cloud so both your local machine and Vercel can connect to it.

1. Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Select the **M0 Free Cluster** (Shared) ➔ Provider: **AWS** ➔ Click **Create**.
3. **Security Setup**:
   - **Username & Password**: Create a username (e.g. `bookiouser`) and password (e.g. `BookioPass123!`). Click **Create User**.
   - **IP Access List**: Click **Allow Access from Anywhere** (`0.0.0.0/0`) ➔ Click **Add Entry**.
4. Click **Finish and Close** ➔ **Go to Overview**.
5. Click the green **Connect** button ➔ choose **Drivers** (Node.js).
6. Copy your connection string. It will look like this:
   ```text
   mongodb+srv://bookiouser:BookioPass123!@cluster0.xxxx.mongodb.net/bookio?retryWrites=true&w=majority
   ```
   *(Make sure to put `/bookio` before the `?` so it uses the bookio database)*.

---

## Step 2: Seed the 50+ Books into MongoDB Atlas

Run the database seeder from your computer once so your cloud database has all the books:

In PowerShell:
```powershell
$env:MONGO_URL="mongodb+srv://bookiouser:BookioPass123!@cluster0.xxxx.mongodb.net/bookio?retryWrites=true&w=majority"
cd c:\Users\user\Desktop\Bookio\backend
npm run addbooks
```
You will see:
```text
Connected to MongoDB...
Inserted 50 books into MongoDB
```

---

## Step 3: Push Your Code to GitHub

We already updated your backend to be serverless-compatible and created `backend/vercel.json`.

In PowerShell:
```powershell
cd c:\Users\user\Desktop\Bookio
git add .
git commit -m "feat: configure backend and frontend for Vercel deployment"
git push origin main
```

---

## Step 4: Deploy the Backend on Vercel

1. Log in to [vercel.com](https://vercel.com) (Log in with your GitHub account).
2. Click **Add New...** ➔ **Project**.
3. Find your **BOOKIO** repository and click **Import**.
4. In the configuration screen:
   - **Project Name**: `bookio-backend`
   - **Framework Preset**: Select **Other**
   - **Root Directory**: Click **Edit** ➔ select **`backend`** ➔ click **Continue**.
5. Expand **Environment Variables** and add:
   - `MONGO_URL`: `mongodb+srv://bookiouser:BookioPass123!@cluster0.xxxx.mongodb.net/bookio?retryWrites=true&w=majority`
   - `JWT_SECRET`: `bookio_secret_key_2026`
6. Click **Deploy**.
7. In ~30 seconds, your backend will be live!
   - Copy your live backend URL (e.g., `https://bookio-backend.vercel.app`).
   - Test it by opening `https://bookio-backend.vercel.app/api/books` in your browser. You will see all 50+ books in JSON!

---

## Step 5: Deploy the Frontend on Vercel

1. In your Vercel Dashboard, click **Add New...** ➔ **Project** again.
2. Select your **BOOKIO** repository again and click **Import**.
3. In the configuration screen:
   - **Project Name**: `bookio-frontend` (or `bookio`)
   - **Framework Preset**: **Vite** (Vercel detects this automatically)
   - **Root Directory**: Click **Edit** ➔ select **`frontend`** ➔ click **Continue**.
4. Expand **Environment Variables** and add:
   - `VITE_API_URL`: `https://bookio-backend.vercel.app` *(paste your backend URL from Step 4)*
5. Click **Deploy**.

---

## 🎉 Done!
Your BOOKIO bookstore is now permanently live with high-speed CDN, 100% free hosting, and automatic HTTPS at:
```text
https://bookio-frontend.vercel.app
```
