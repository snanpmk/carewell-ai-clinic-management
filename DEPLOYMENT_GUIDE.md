# Deployment Guide: Carewell AI

This guide explains how to deploy the Carewell AI application for **free** using modern cloud platforms.

## 🛠 Prerequisites
1. A [GitHub](https://github.com/) account.
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account.
3. Your code pushed to a GitHub repository.

---

## 1. Database: MongoDB Atlas (Free Tier)
1. **Create a Cluster**: Log in to MongoDB Atlas and create a new "M0" free cluster.
2. **Setup Network Access**: Go to "Network Access" and click "Add IP Address". Select **"Allow Access from Anywhere"** (0.0.0.0/0).
3. **Setup Database User**: Go to "Database Access" and create a user with a username and password.
4. **Get Connection String**: 
   - Click "Connect" -> "Drivers".
   - Copy the connection string. Replace `<password>` with your user password.
   - **Save this URL**; you will need it for the backend environment variables.

---

## 2. Backend: Render (Free Web Service)
1. Log in to [Render](https://render.com/) and connect your GitHub account.
2. Click **"New +"** -> **"Web Service"**.
3. Select your repository.
4. **Configuration**:
   - **Name**: `carewell-backend`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node src/index.js`
   - **Runtime**: `Node`
5. **Environment Variables**: Click "Advanced" and add:
   - `MONGODB_URI`: *Your copied Atlas string*
   - `GEMINI_API_KEY`: *Your Google Gemini API key*
   - `FRONTEND_URL`: *Follow step 3 first to get the Vercel URL, then come back and update this.*
   - `NODE_ENV`: `production`
6. Click **"Create Web Service"**. Copy the URL Render gives you (e.g., `https://carewell-backend.onrender.com`).

---

## 3. Frontend: Vercel (Free / Hobby Tier)
1. Log in to [Vercel](https://vercel.com/) and connect your GitHub account.
2. Click **"Add New"** -> **"Project"**.
3. Select your repository.
4. **Configuration**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
5. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://carewell-backend.onrender.com/api` (Use the Render URL you copied).
6. Click **"Deploy"**.
7. Once deployed, copy your Vercel URL (e.g., `https://carewell-ai.vercel.app`).

---

## 4. Final Connection (CORS Fix)
To allow the frontend to talk to the backend, you must update the `FRONTEND_URL` on Render:
1. Go to your **Render Dashboard**.
2. Select your `carewell-backend` service.
3. Go to **"Environment"**.
4. Set the `FRONTEND_URL` to your Vercel URL (e.g., `https://carewell-ai.vercel.app`).
5. Render will redeploy automatically.

---

## ✅ Deployment Summary
| Component | Platform | URL Type |
| :--- | :--- | :--- |
| **Database** | MongoDB Atlas | Connection String |
| **Backend** | Render | `https://...onrender.com` |
| **Frontend** | Vercel | `https://...vercel.app` |

### ⚠️ Note on Render Free Tier
Render's free tier "spins down" after 15 minutes of inactivity. When you first visit the app after a break, the first request (like fetching patients) might take 30-50 seconds to complete while the server wakes up.
