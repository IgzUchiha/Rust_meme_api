# 🎁 ETH Rewards System - Complete Setup Guide

This guide will help you set up the ETH tipping/rewards system where users send 0.001 ETH when they like memes, and creators can claim their rewards.

---

## 🏗️ Architecture Overview

### How It Works

1. **User likes a meme** → MetaMask prompts to send 0.001 ETH
2. **Smart contract receives ETH** → Stores it for the meme creator
3. **Creator visits profile** → Sees total pending rewards
4. **Creator clicks "Claim Rewards"** → Receives all accumulated ETH

### Components

- **Smart Contract** (`MemeRewards.sol`) - Manages ETH deposits and claims
- **Frontend** - Like button triggers wallet transaction
- **Profile Page** - Shows rewards and claim button

---

## 📋 Prerequisites

- Node.js 18+
- MetaMask browser extension
- Some testnet ETH (for testing)
- Alchemy or Infura account (for RPC)

---

## 🚀 Step-by-Step Setup

### Step 1: Install Smart Contract Dependencies

```bash
cd /Users/igmercastillo/Rust_meme_api/contracts
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `contracts/.env`:

```env
# Get a private key from MetaMask (Settings → Security & Privacy → Show Private Key)
# ⚠️ NEVER commit this file or share your private key!
PRIVATE_KEY=your_private_key_here

# Get free RPC URL from https://www.alchemy.com/
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Get API key from https://etherscan.io/myapikey
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Step 3: Get Testnet ETH

For Sepolia testnet:
1. Go to https://sepoliafaucet.com/
2. Enter your wallet address
3. Request testnet ETH (you'll need ~0.1 ETH for deployment + testing)

### Step 4: Compile Contract

```bash
cd contracts
npm run compile
```

You should see:
```
Compiled 1 Solidity file successfully
```

### Step 5: Deploy to Testnet

```bash
npm run deploy:sepolia
```

**Expected output:**
```
Deploying MemeRewards contract...
MemeRewards deployed to: 0xABCDEF1234567890...
Deployment info saved to deployments folder
```

**Copy the contract address!** You'll need it next.

### Step 6: Update Frontend Configuration

Edit `frontend/.env.local` and add:

```env
NEXT_PUBLIC_MEME_REWARDS_CONTRACT=0xYourContractAddressHere
```

### Step 7: Restart Frontend

```bash
cd /Users/igmercastillo/Rust_meme_api/frontend
npm run dev
```

---

## 🧪 Testing the System

### Test 1: Like a Meme (Send Tip)

1. Go to http://localhost:3000
2. **Connect your wallet** (top right)
3. Click the **heart ❤️** on any meme
4. **MetaMask will prompt** for 0.001 ETH + gas
5. Confirm the transaction
6. Wait for confirmation (~15 seconds on testnet)
7. Like count should increase!

### Test 2: Check Rewards

1. Go to **Profile** page
2. Scroll to **"Meme Rewards"** section
3. You should see:
   - Pending Rewards: 0.001 ETH (if someone liked your meme)
   - Number of likes earned

### Test 3: Claim Rewards

1. Click **"Claim Rewards"** button
2. MetaMask prompts for gas fee
3. Confirm transaction
4. Wait for confirmation
5. ETH is transferred to your wallet!
6. Pending rewards reset to 0

---

## 🔍 Verifying on Etherscan

After deployment, verify your contract:

```bash
cd contracts
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

Then view it on Etherscan:
```
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
```

You can see:
- All transactions
- Contract code
- Events (likes, claims)
- Balance

---

## 💰 Economics

### Costs

- **Per Like**: 0.001 ETH (~$2-3 USD at current prices) + gas (~$0.50)
- **Per Claim**: Gas only (~$0.30)

### Revenue for Creators

- 1 like = 0.001 ETH
- 10 likes = 0.01 ETH (~$20)
- 100 likes = 0.1 ETH (~$200)
- 1000 likes = 1 ETH (~$2000)

### Adjusting Reward Amount

To change from 0.001 ETH to another amount:

1. Edit `contracts/MemeRewards.sol`:
   ```solidity
   uint256 public rewardPerLike = 0.002 ether; // Change this
   ```

2. Redeploy contract
3. Update `frontend/src/lib/contract.ts`:
   ```typescript
   export const REWARD_PER_LIKE = "2000000000000000"; // 0.002 ETH in wei
   ```

---

## 🛡️ Security Considerations

### Smart Contract

- ✅ Uses OpenZeppelin's battle-tested contracts
- ✅ ReentrancyGuard prevents reentrancy attacks
- ✅ Ownable for admin functions
- ✅ Emergency withdraw function

### Frontend

- ✅ Wallet connection required for tips
- ✅ Transaction confirmation before sending
- ✅ Error handling for failed transactions
- ✅ Loading states during processing

### Best Practices

1. **Never share your private key**
2. **Test on testnet first** (Sepolia)
3. **Verify contract on Etherscan** for transparency
4. **Start with small reward amounts**
5. **Monitor gas prices** before transactions

---

## 🐛 Troubleshooting

### "Insufficient funds" Error

**Problem**: Not enough ETH in wallet
**Solution**: Get more testnet ETH from faucet

### "User rejected transaction"

**Problem**: User cancelled in MetaMask
**Solution**: Try again, make sure you have enough ETH + gas

### "Contract not deployed"

**Problem**: Contract address not set or wrong network
**Solution**: 
1. Check `NEXT_PUBLIC_MEME_REWARDS_CONTRACT` in `.env.local`
2. Make sure MetaMask is on the same network (Sepolia)

### "Execution reverted"

**Problem**: Contract function failed
**Solution**: Check Etherscan for error details

### Rewards not showing

**Problem**: Wrong network or contract address
**Solution**:
1. Switch MetaMask to Sepolia
2. Verify contract address matches deployment

---

## 🚀 Production Deployment

### Before Going to Mainnet

1. ✅ Test thoroughly on Sepolia
2. ✅ Audit smart contract (consider professional audit)
3. ✅ Set up monitoring (Tenderly, Defender)
4. ✅ Prepare emergency procedures
5. ✅ Calculate gas costs at current prices
6. ✅ Fund deployment wallet with ETH

### Deploy to Mainnet

```bash
# ⚠️ REAL MONEY - BE CAREFUL!
cd contracts
npm run deploy:mainnet
```

### Update Frontend

```env
NEXT_PUBLIC_MEME_REWARDS_CONTRACT=0xMainnetContractAddress
```

---

## 📊 Monitoring

### Track Contract Activity

- **Etherscan**: View all transactions
- **Tenderly**: Real-time monitoring and alerts
- **The Graph**: Query historical data

### Key Metrics to Watch

- Total ETH deposited
- Total ETH claimed
- Number of unique tippers
- Average tips per meme
- Gas costs

---

## 🎯 Next Steps

### Enhancements to Consider

1. **Merkle Tree Claims** - Batch multiple rewards into one transaction
2. **ZK Proofs** - Privacy-preserving reward claims
3. **ERC-20 Support** - Accept stablecoins (USDC, DAI)
4. **Reward Multipliers** - Trending memes earn more
5. **Staking** - Lock rewards for higher APY
6. **NFT Rewards** - Mint NFTs for top creators

### Integration Ideas

1. **Discord Bot** - Notify creators of new tips
2. **Analytics Dashboard** - Track earnings over time
3. **Leaderboard** - Top earners of the week
4. **Referral System** - Earn % of referred users' tips

---

## 📚 Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Docs](https://www.rainbowkit.com/docs)
- [Etherscan](https://sepolia.etherscan.io/)

---

## 🆘 Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review contract deployment logs
3. Check Etherscan for transaction details
4. Verify all environment variables are set
5. Open an issue on GitHub with error details

---

## ✅ Deployment Checklist

- [ ] Installed contract dependencies
- [ ] Configured `.env` with private key and RPC
- [ ] Got testnet ETH from faucet
- [ ] Compiled contract successfully
- [ ] Deployed to Sepolia testnet
- [ ] Copied contract address
- [ ] Updated frontend `.env.local`
- [ ] Restarted frontend server
- [ ] Connected wallet to testnet
- [ ] Tested liking a meme (sent tip)
- [ ] Checked rewards in profile
- [ ] Tested claiming rewards
- [ ] Verified contract on Etherscan

**Once all checked, you're ready to go! 🎉**
