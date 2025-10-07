# Meme API Frontend

A modern Next.js frontend for the Rust Meme API with OAuth authentication and MetaMask wallet integration.

## Features

- 🔐 **OAuth Authentication** - Sign in with Google or GitHub
- 👛 **MetaMask Wallet Connect** - Link your EVM address using RainbowKit
- 🖼️ **Meme Gallery** - Browse the best memes
- 📤 **Upload Memes** - Drag & drop or URL upload with caption and tags
- 👤 **User Profile** - View your account and connected wallet
- 🎨 **Modern UI** - Built with TailwindCSS and shadcn/ui components

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **NextAuth.js** (OAuth)
- **wagmi + RainbowKit** (Web3 wallet connection)
- **React Query** (Data fetching)
- **Lucide Icons**

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Rust API running on `http://127.0.0.1:8000`
- OAuth credentials (Google and/or GitHub)
- (Optional) WalletConnect Project ID

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Environment Variables

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Generate a secret key
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (https://github.com/settings/developers)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# API URL (default: http://127.0.0.1:8000)
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# WalletConnect Project ID (optional, get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```

#### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

#### Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Create OAuth 2.0 Client ID
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Client Secret

#### Get GitHub OAuth Credentials

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and generate Client Secret

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running the Full Stack

### Terminal 1: Rust API

```bash
cd /Users/igmercastillo/Rust_meme_api
cargo run
```

The API should be running on `http://127.0.0.1:8000`

### Terminal 2: Frontend

```bash
cd /Users/igmercastillo/Rust_meme_api/frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

### Sign In

1. Click "Sign In" in the header
2. Choose Google or GitHub
3. Authorize the application

### Connect Wallet

1. Click "Connect Wallet" in the header (RainbowKit button)
2. Select MetaMask or another supported wallet
3. Approve the connection
4. Your EVM address will be linked to uploads

### Upload a Meme

1. Navigate to `/upload`
2. Sign in if not already authenticated
3. Drag & drop an image or paste a URL
4. Add caption and tags
5. Click "Upload Meme"
6. Your connected wallet address will be associated with the meme

### Browse Memes

- Visit the home page to see all memes
- Each meme shows caption, tags, and the uploader's wallet address

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/auth/[...nextauth]/  # NextAuth API routes
│   │   ├── auth/signin/             # Sign in page
│   │   ├── upload/                  # Upload page
│   │   ├── profile/                 # User profile
│   │   ├── page.tsx                 # Home/Gallery page
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── ui/                      # Reusable UI components
│   │   ├── header.tsx               # Navigation header
│   │   └── providers.tsx            # Context providers
│   ├── lib/
│   │   ├── api.ts                   # API client functions
│   │   ├── utils.ts                 # Utility functions
│   │   └── wagmi.ts                 # Wagmi configuration
│   └── types/
│       └── next-auth.d.ts           # TypeScript definitions
├── public/                          # Static assets
├── .env.local.example               # Environment variables template
└── package.json
```

## Building for Production

```bash
npm run build
npm run start
```

## Troubleshooting

### "Failed to fetch memes"

- Ensure the Rust API is running on `http://127.0.0.1:8000`
- Check CORS settings in the Rust API

### OAuth not working

- Verify OAuth credentials in `.env.local`
- Check redirect URIs match in OAuth provider settings
- Ensure `NEXTAUTH_URL` and `NEXTAUTH_SECRET` are set

### Wallet connection issues

- Make sure MetaMask is installed
- Try refreshing the page
- Check browser console for errors

## Next Steps

- [ ] Add user-specific meme filtering
- [ ] Implement meme voting/likes
- [ ] Add IPFS storage integration
- [ ] Create meme NFT minting feature
- [ ] Add social sharing features

## License

MIT
