'use client';

import { useSession } from 'next-auth/react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useRouter } from 'next/navigation';
import { formatEther } from 'viem';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Wallet, Mail, CheckCircle2, XCircle, Coins, Loader2, Heart, MessageCircle, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { MEME_REWARDS_ABI, MEME_REWARDS_ADDRESS, REWARD_PER_LIKE } from '@/lib/contract';
import { getMemes, type Meme } from '@/lib/api';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [userMemes, setUserMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's memes
  useEffect(() => {
    async function fetchUserMemes() {
      if (!address) {
        setUserMemes([]);
        setLoading(false);
        return;
      }

      try {
        const allMemes = await getMemes();
        // Filter memes by user's wallet address
        const filtered = allMemes.filter(
          (meme) => meme.evm_address?.toLowerCase() === address.toLowerCase()
        );
        setUserMemes(filtered);
      } catch (error) {
        console.error('Failed to fetch user memes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserMemes();
  }, [address]);

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
              {userMemes.length} meme{userMemes.length !== 1 ? 's' : ''} uploaded with your wallet address
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to see your uploaded memes
                </p>
              </div>
            ) : loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-4">Loading your memes...</p>
              </div>
            ) : userMemes.length === 0 ? (
              <div className="text-center py-8">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  You haven't uploaded any memes yet
                </p>
                <Link href="/upload">
                  <Button>
                    Upload Your First Meme
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userMemes.map((meme) => (
                  <Link key={meme.id} href={`/memes/${meme.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                      <div className="relative aspect-square bg-muted">
                        {meme.image && meme.image.startsWith('http') ? (
                          <Image
                            src={meme.image}
                            alt={meme.caption}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ImageIcon className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-1">{meme.caption}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{meme.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{meme.comment_count}</span>
                          </div>
                        </div>
                        {meme.tags && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {meme.tags.split(',').slice(0, 2).map((tag, i) => (
                              <span
                                key={i}
                                className="inline-block bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md text-xs"
                              >
                                #{tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
