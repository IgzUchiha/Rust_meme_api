# Meme API - Complete Setup Guide

This guide will help you set up and run the full-stack Meme API application with OAuth authentication and MetaMask wallet integration.

## 🎯 What You're Building

- **Backend**: Rust API with Actix-web (CORS-enabled, file uploads)
- **Frontend**: Next.js 14 with TypeScript, TailwindCSS
- **Auth**: OAuth (Google + GitHub) via NextAuth.js
- **Web3**: MetaMask wallet connection via RainbowKit + wagmi
- **Features**: Meme gallery, upload with drag-and-drop, EVM address linking

---

## 📋 Prerequisites

- **Rust** (latest stable) - [Install](https://rustup.rs/)
- **Node.js** 18+ and npm - [Install](https://nodejs.org/)
- **MetaMask** browser extension - [Install](https://metamask.io/)

---

## 🚀 Quick Start

### Step 1: Start the Rust API

```bash
# Navigate to project root
cd /Users/igmercastillo/Rust_meme_api

# Build and run the Rust API
cargo run
```

You should see:
```
🚀 Server starting on http://127.0.0.1:8000
📁 Uploads will be saved to ./uploads/
```

**Test it:**
```bash
curl http://127.0.0.1:8000/memes
```

---

### Step 2: Set Up the Frontend

Open a **new terminal** and run:

```bash
# Navigate to frontend directory
cd /Users/igmercastillo/Rust_meme_api/frontend

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local
```

---

### Step 3: Configure OAuth Credentials

You need to set up OAuth apps to enable sign-in. Edit `frontend/.env.local`:

#### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output and add to `.env.local`:
```env
NEXTAUTH_SECRET=<paste-generated-secret-here>
NEXTAUTH_URL=http://localhost:3000
```

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select existing)
3. Click **"Create Credentials"** → **"OAuth client ID"**
4. Application type: **Web application**
5. Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Copy **Client ID** and **Client Secret**
7. Add to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

#### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: Meme API
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **"Register application"**
5. Copy **Client ID** and generate **Client Secret**
6. Add to `.env.local`:
   ```env
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

#### (Optional) WalletConnect Project ID

For better wallet connection UX:

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a free account
3. Create a new project
4. Copy the **Project ID**
5. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
   ```

---

### Step 4: Run the Frontend

```bash
# Make sure you're in the frontend directory
cd /Users/igmercastillo/Rust_meme_api/frontend

# Start the development server
npm run dev
```

You should see:
```
  ▲ Next.js 14.2.5
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

---

## 🎮 Using the Application

### 1. Browse Memes

- Open http://localhost:3000
- You'll see the gallery with sample memes (Troll Face, Doge, Pepe)

### 2. Sign In

- Click **"Sign In"** in the header
- Choose **Google** or **GitHub**
- Authorize the application
- You'll be redirected back to the gallery

### 3. Connect Wallet

- Click **"Connect Wallet"** in the header
- Select **MetaMask** (or another wallet)
- Approve the connection
- Your wallet address will appear in the header

### 4. Upload a Meme

- Navigate to **Upload** page (or click Upload in nav)
- **Drag & drop** an image or paste a URL
- Add a **caption** (required)
- Add **tags** (optional, comma-separated)
- Click **"Upload Meme"**
- Your connected wallet address will be linked to the meme
- You'll be redirected to the gallery

### 5. View Profile

- Click **"Profile"** in the nav
- See your OAuth account info
- See your connected wallet address

---

## 🔧 Troubleshooting

### Frontend won't start

**Error**: `Cannot find module 'next'`
```bash
cd frontend
npm install
```

### API connection failed

**Error**: "Failed to fetch memes"

1. Check Rust API is running:
   ```bash
   curl http://127.0.0.1:8000/memes
   ```
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```

### OAuth not working

**Error**: "Callback URL mismatch"

1. Check redirect URIs in OAuth provider settings:
   - Google: `http://localhost:3000/api/auth/callback/google`
   - GitHub: `http://localhost:3000/api/auth/callback/github`

2. Verify `.env.local` has correct credentials

3. Restart the dev server:
   ```bash
   npm run dev
   ```

### Wallet won't connect

1. Make sure MetaMask is installed
2. Try refreshing the page
3. Check browser console for errors
4. Make sure you're on a supported network (Ethereum mainnet, Polygon, etc.)

---

## 📁 Project Structure

```
Rust_meme_api/
├── src/
│   └── main.rs              # Rust API with CORS and upload
├── uploads/                 # Uploaded meme images (auto-created)
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Gallery (home)
│   │   │   ├── upload/page.tsx    # Upload page
│   │   │   ├── profile/page.tsx   # User profile
│   │   │   └── auth/signin/       # Sign-in page
│   │   ├── components/
│   │   │   ├── header.tsx         # Nav with auth + wallet
│   │   │   └── ui/                # Reusable components
│   │   └── lib/
│   │       ├── api.ts             # API client
│   │       └── wagmi.ts           # Wallet config
│   ├── .env.local           # Your secrets (create this!)
│   └── package.json
├── Cargo.toml
└── README.md
```

---

## 🎯 Next Steps

### Production Deployment

1. **Storage**: Replace local uploads with S3/R2/IPFS
2. **Database**: Replace in-memory storage with PostgreSQL/SQLite
3. **Auth**: Add user table linking OAuth ID to wallet addresses
4. **SIWE**: Add Sign-In with Ethereum for cryptographic verification
5. **Deploy**: 
   - Backend: Railway, Fly.io, or AWS
   - Frontend: Vercel, Netlify

### Feature Ideas

- [ ] User-specific meme filtering
- [ ] Upvote/downvote system
- [ ] Comments on memes
- [ ] NFT minting integration
- [ ] IPFS storage
- [ ] Multiple wallet addresses per user
- [ ] Meme categories/collections
- [ ] Search and filtering

---

## 📚 Tech Stack Reference

### Backend
- **Actix-web** - Fast Rust web framework
- **actix-cors** - CORS middleware
- **actix-multipart** - File upload handling
- **serde** - JSON serialization

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **NextAuth.js** - OAuth authentication
- **wagmi** - Ethereum hooks
- **RainbowKit** - Wallet connection UI
- **React Query** - Data fetching
- **Lucide** - Icon library

---

## 🆘 Need Help?

- Check the [frontend README](frontend/README.md) for more details
- Rust API logs: Check terminal where `cargo run` is running
- Frontend logs: Check browser console (F12)
- Network requests: Browser DevTools → Network tab

---

## 📝 Environment Variables Summary

### Frontend `.env.local`

```env
# Required
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl>
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# OAuth (at least one required)
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
GITHUB_CLIENT_ID=<from-github-settings>
GITHUB_CLIENT_SECRET=<from-github-settings>

# Optional
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<from-walletconnect>
```

---

## ✅ Checklist

- [ ] Rust installed and `cargo run` works
- [ ] Node.js 18+ installed
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `.env.local` created with all credentials
- [ ] OAuth apps created (Google and/or GitHub)
- [ ] MetaMask installed in browser
- [ ] Both servers running (Rust on :8000, Next.js on :3000)
- [ ] Can browse memes at http://localhost:3000
- [ ] Can sign in with OAuth
- [ ] Can connect wallet
- [ ] Can upload a meme

---

Happy meme sharing! 🎉
