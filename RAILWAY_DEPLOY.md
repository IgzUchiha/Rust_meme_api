# 🚂 Deploy to Railway - Complete Guide

This guide will help you deploy your Rust Meme API to Railway.

---

## Prerequisites

- GitHub account
- Railway account (sign up at https://railway.app)
- Git installed locally

---

## Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Railway deployment"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/Rust_meme_api.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Railway

### Option A: Using Railway Dashboard (Easiest)

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `Rust_meme_api` repository
5. Railway will auto-detect the Dockerfile and deploy!

### Option B: Using Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

---

## Step 3: Configure Environment Variables

In Railway dashboard:

1. Click on your project
2. Go to **"Variables"** tab
3. Add these variables:

```env
PORT=8000
RUST_LOG=info
```

Optional (if you add database later):
```env
DATABASE_URL=postgresql://...
```

---

## Step 4: Get Your API URL

1. Go to **"Settings"** tab
2. Click **"Generate Domain"**
3. Copy your URL (e.g., `https://rust-meme-api-production.up.railway.app`)

---

## Step 5: Test Your Deployment

```bash
# Test the API
curl https://your-app.up.railway.app/memes

# Should return your memes JSON
```

---

## Step 6: Update Frontend

Update your frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
```

Redeploy your frontend on Vercel.

---

## 🔧 Troubleshooting

### Build Fails

**Check logs:**
- Railway Dashboard → Deployments → Click on failed deployment → View logs

**Common issues:**
- Missing dependencies in `Cargo.toml`
- Dockerfile syntax errors
- Out of memory (upgrade Railway plan)

### API Returns 502

**Possible causes:**
- App crashed on startup
- Wrong PORT binding (should be `0.0.0.0:$PORT`)
- Check logs for errors

### CORS Errors

Update `src/main.rs` to allow your frontend domain:

```rust
let cors = Cors::default()
    .allowed_origin("https://your-frontend.vercel.app")
    .allowed_methods(vec!["GET", "POST"])
    .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT, header::CONTENT_TYPE])
    .max_age(3600);
```

### Uploads Not Persisting

Railway uses ephemeral storage. For persistent uploads:

1. **Option A: Use Railway Volumes**
   ```bash
   railway volume create uploads
   railway volume attach uploads /app/uploads
   ```

2. **Option B: Use S3/Cloudinary** (Recommended)
   - Store files in cloud storage
   - Update upload endpoint to use S3 SDK

---

## 📊 Monitoring

### View Logs

```bash
# Using CLI
railway logs

# Or in dashboard
Project → Deployments → Logs
```

### Metrics

Railway dashboard shows:
- CPU usage
- Memory usage
- Network traffic
- Request count

---

## 💰 Pricing

- **Hobby Plan**: $5/month
  - 512 MB RAM
  - 1 GB Disk
  - Good for testing

- **Pro Plan**: $20/month
  - 8 GB RAM
  - 100 GB Disk
  - Custom domains

---

## 🚀 Auto-Deploy on Push

Railway automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update API"
git push

# Railway will automatically rebuild and deploy!
```

---

## 📝 Next Steps

1. ✅ Deploy Rust API to Railway
2. ✅ Deploy Next.js frontend to Vercel
3. ✅ Update frontend API URL
4. ✅ Test end-to-end
5. ⬜ Add PostgreSQL database (optional)
6. ⬜ Set up custom domain
7. ⬜ Add monitoring/alerts

---

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check deployment logs for errors

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Dockerfile working locally (`docker build -t test .`)
- [ ] Environment variables set
- [ ] Domain generated
- [ ] API responding to requests
- [ ] Frontend updated with new API URL
- [ ] CORS configured for frontend domain
- [ ] Uploads working (or S3 configured)
- [ ] Monitoring set up

**Once all checked, you're live! 🎉**
