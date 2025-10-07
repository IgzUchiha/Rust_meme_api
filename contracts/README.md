# Meme Rewards Smart Contract

A Solidity smart contract that enables ETH tipping for meme creators with batch reward claiming.

## Features

- **Tip on Like**: Users send 0.001 ETH when they like a meme
- **Reward Accumulation**: Tips are stored in the contract per creator address
- **Batch Claiming**: Creators can claim all accumulated rewards in one transaction
- **ZK-Ready**: Supports Merkle proof verification for efficient batch claims
- **Gas Optimized**: Uses ReentrancyGuard and efficient storage patterns

## Setup

### 1. Install Dependencies

```bash
cd contracts
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add:
- Your wallet private key (for deployment)
- RPC URLs (Alchemy, Infura, etc.)
- Etherscan API keys (for verification)

### 3. Compile Contracts

```bash
npm run compile
```

## Deployment

### Local Development (Hardhat Network)

```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy
npm run deploy:local
```

### Testnet (Sepolia)

```bash
npm run deploy:sepolia
```

### Mainnet

```bash
# ⚠️ CAUTION: Real money involved!
npx hardhat run scripts/deploy.js --network mainnet
```

## Contract Address

After deployment, update the contract address in:
```
frontend/.env.local
```

Add:
```env
NEXT_PUBLIC_MEME_REWARDS_CONTRACT=0xYourContractAddress
```

## How It Works

### 1. Like & Tip Flow

```
User clicks ❤️ → MetaMask prompts for 0.001 ETH
→ Contract stores tip for creator
→ Backend increments like count
```

### 2. Claim Flow

```
Creator visits Profile → See pending rewards
→ Click "Claim Rewards" → MetaMask confirms
→ ETH transferred to creator's wallet
```

### 3. Smart Contract Functions

**depositLikeReward(creator, memeId)**
- Payable function
- Accepts 0.001 ETH minimum
- Stores reward for creator address
- Emits `LikeRewardDeposited` event

**claimPendingRewards()**
- Non-reentrant
- Transfers all pending rewards to caller
- Resets pending balance
- Emits `RewardsClaimed` event

**getPendingRewards(user)**
- View function
- Returns unclaimed ETH balance for address

## Security Features

- ✅ **ReentrancyGuard**: Prevents reentrancy attacks
- ✅ **Ownable**: Admin functions protected
- ✅ **Merkle Proofs**: Optional ZK-style verification
- ✅ **Emergency Withdraw**: Owner can rescue stuck funds
- ✅ **Event Logging**: All actions emit events for transparency

## Gas Estimates

- **depositLikeReward**: ~50,000 gas
- **claimPendingRewards**: ~30,000 gas
- **Total cost per like**: ~$2-5 (depending on gas prices)

## Testing

```bash
npx hardhat test
```

## Verification

After deployment, verify on Etherscan:

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## Upgrading

To change reward amount:

```bash
npx hardhat run scripts/updateReward.js --network sepolia
```

## Frontend Integration

The frontend automatically:
1. Reads pending rewards from contract
2. Shows balance in Profile page
3. Allows one-click claiming
4. Updates UI after transactions

## Future Enhancements

- [ ] Add Merkle tree generation script
- [ ] Implement batch claiming with ZK proofs
- [ ] Add reward multipliers for trending memes
- [ ] Support ERC-20 token rewards
- [ ] Add staking mechanism
- [ ] Implement governance for reward rates

## Support

For issues or questions, open an issue on GitHub.
