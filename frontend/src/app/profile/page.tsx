'use client';

import { useSession } from 'next-auth/react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useRouter } from 'next/navigation';
import { formatEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Wallet, Mail, CheckCircle2, XCircle, Coins, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { MEME_REWARDS_ABI, MEME_REWARDS_ADDRESS, REWARD_PER_LIKE } from '@/lib/contract';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { address, isConnected } = useAccount();
  const router = useRouter();

  // Read pending rewards from contract
  const { data: pendingRewards, refetch: refetchRewards } = useReadContract({
    address: MEME_REWARDS_ADDRESS as `0x${string}`,
    abi: MEME_REWARDS_ABI,
    functionName: 'getPendingRewards',
    args: address ? [address] : undefined,
  });

  // Claim rewards
  const { writeContract, data: claimHash, isPending: isClaimPending } = useWriteContract();
  const { isLoading: isClaimConfirming, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  const handleClaimRewards = async () => {
    if (!address) return;
    
    try {
      writeContract({
        address: MEME_REWARDS_ADDRESS as `0x${string}`,
        abi: MEME_REWARDS_ABI,
        functionName: 'claimPendingRewards',
      });
    } catch (error) {
      console.error('Failed to claim rewards:', error);
      alert('Failed to claim rewards. Please try again.');
    }
  };

  // Refetch rewards after successful claim
  if (isClaimSuccess) {
    refetchRewards();
  }

  if (status === 'loading') {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to view your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/auth/signin')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Profile
            </CardTitle>
            <CardDescription>
              Your account information and connected wallets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg">{session.user?.name}</h3>
                {session.user?.email && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {session.user.email}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Connection
              </h4>
              
              {isConnected && address ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Wallet Connected</span>
                  </div>
                  <p className="text-sm font-mono bg-muted p-3 rounded-md">
                    {address}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This address will be associated with your uploaded memes
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">No Wallet Connected</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connect your MetaMask wallet using the button in the header to link your EVM address
                  </p>
                </div>
              )}
            </div>

            {/* Rewards Section */}
            {isConnected && address && (
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Meme Rewards
                </h4>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Pending Rewards</p>
                    <p className="text-2xl font-bold">
                      {pendingRewards ? formatEther(pendingRewards as bigint) : '0'} ETH
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Earned from {pendingRewards ? Number(pendingRewards) / Number(REWARD_PER_LIKE) : 0} likes
                    </p>
                  </div>

                  <Button
                    onClick={handleClaimRewards}
                    disabled={!pendingRewards || pendingRewards === BigInt(0) || isClaimPending || isClaimConfirming}
                    className="w-full"
                    size="lg"
                  >
                    {isClaimPending || isClaimConfirming ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isClaimPending ? 'Confirming...' : 'Processing...'}
                      </>
                    ) : (
                      <>
                        <Coins className="mr-2 h-4 w-4" />
                        Claim Rewards
                      </>
                    )}
                  </Button>

                  {isClaimSuccess && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">
                        ✅ Rewards claimed successfully!
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    💡 You earn 0.001 ETH for every like on your memes. Rewards are stored in the smart contract and can be claimed anytime.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Memes</CardTitle>
            <CardDescription>
              Memes you've uploaded (coming soon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This feature will display all memes uploaded with your account and wallet address.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
