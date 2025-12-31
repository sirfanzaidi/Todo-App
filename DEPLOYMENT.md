# Deployment Guide

This guide explains how to deploy your full-stack Todo app to production.

## Architecture

- **Frontend**: Next.js 14 → Vercel
- **Backend**: FastAPI → Railway (or Render/Fly.io)
- **Database**: PostgreSQL → Neon (already configured)

---

## 🚂 Step 1: Deploy Backend to Railway

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `Todo-App` repository
   - Select the `backend` folder as the root directory

3. **Configure Environment Variables**
   Add these environment variables in Railway:
   ```
   DATABASE_URL=postgresql+psycopg://neondb_owner:npg_majpyhUOM7l1@ep-hidden-silence-ah7p6552-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   SECRET_KEY=xFegF4GsklGD9-8-zOF9g6LY_OBAAwSrA8PiR8NGIAM
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
   ENVIRONMENT=production
   CORS_ORIGINS=https://your-frontend.vercel.app
   API_HOST=0.0.0.0
   API_PORT=$PORT
   ```

4. **Deploy**
   - Railway will auto-deploy
   - Get your backend URL (e.g., `https://your-app.up.railway.app`)

---

## ▲ Step 2: Deploy Frontend to Vercel

1. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Import your `Todo-App` repository
   - **Root Directory**: Set to `frontend`
   - **Framework Preset**: Next.js (auto-detected)

3. **Configure Environment Variables**
   Add in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
   ⚠️ Replace with your actual Railway backend URL

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

---

## 🔄 Step 3: Update CORS Settings

After deploying frontend, update backend CORS in Railway:

1. Go to Railway dashboard
2. Update `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
   ```
3. Redeploy backend

---

## 🎯 Alternative: Deploy Backend to Render

If you prefer Render over Railway:

1. **Create `render.yaml`** in backend folder:
   ```yaml
   services:
     - type: web
       name: todo-backend
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: uvicorn src.main:app --host 0.0.0.0 --port $PORT
       envVars:
         - key: DATABASE_URL
           sync: false
         - key: SECRET_KEY
           sync: false
         - key: CORS_ORIGINS
           sync: false
   ```

2. Deploy to Render and configure environment variables

---

## 🧪 Testing Production Deployment

1. Visit your Vercel URL
2. Create an account
3. Add/edit/delete todos
4. Verify everything works!

---

## 🔒 Security Checklist

- [ ] Database credentials are secure
- [ ] SECRET_KEY is strong and unique
- [ ] CORS_ORIGINS only allows your frontend domain
- [ ] Backend API is only accessible via HTTPS
- [ ] Environment variables are not committed to Git

---

## 📝 Notes

- **Database**: Already using Neon PostgreSQL (production-ready)
- **Auto-deploys**: Both Vercel and Railway support auto-deploys from GitHub
- **Logs**: Check Railway/Render dashboard for backend logs
- **Domains**: Add custom domains in Vercel/Railway settings

---

## 🐛 Troubleshooting

**CORS Errors:**
- Ensure `CORS_ORIGINS` in backend includes your Vercel URL
- Check that frontend `NEXT_PUBLIC_API_URL` points to Railway URL

**Database Errors:**
- Run migrations: `alembic upgrade head` (Railway auto-runs this)
- Verify `DATABASE_URL` is correct

**Frontend Not Loading:**
- Check Vercel build logs
- Ensure `NEXT_PUBLIC_API_URL` is set

---

## 🚀 Quick Deploy Commands

```bash
# Commit deployment configs
git add backend/railway.json backend/Procfile backend/runtime.txt
git add frontend/vercel.json DEPLOYMENT.md
git commit -m "chore: add deployment configurations for Railway and Vercel"
git push origin master

# Then deploy via web dashboards
```

Enjoy your production Todo app! ✨
