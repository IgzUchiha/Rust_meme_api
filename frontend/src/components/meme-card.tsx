'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, ImageIcon, Coins } from 'lucide-react';
import { likeMeme, type Meme } from '@/lib/api';
import { MEME_REWARDS_ABI, MEME_REWARDS_ADDRESS, REWARD_PER_LIKE } from '@/lib/contract';

interface MemeCardProps {
  meme: Meme;
}

export function MemeCard({ meme: initialMeme }: MemeCardProps) {
  const [meme, setMeme] = useState(initialMeme);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking heart
    if (isLiking || hasLiked) return;

    // Check if wallet is connected
    if (!isConnected || !address) {
      alert('Please connect your wallet to send a tip!');
      return;
    }

    // Check if meme has a creator address
    if (!meme.evm_address) {
      alert('This meme has no creator address to tip!');
      return;
    }

    setIsLiking(true);
    try {
      // Send ETH tip via smart contract
      writeContract({
        address: MEME_REWARDS_ADDRESS as `0x${string}`,
        abi: MEME_REWARDS_ABI,
        functionName: 'depositLikeReward',
        args: [meme.evm_address as `0x${string}`, BigInt(meme.id)],
        value: BigInt(REWARD_PER_LIKE),
      });

      // Update like count in backend
      const updatedMeme = await likeMeme(meme.id);
      setMeme(updatedMeme);
      setHasLiked(true);
    } catch (error) {
      console.error('Failed to like meme:', error);
      alert('Failed to send tip. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Link href={`/memes/${meme.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]">
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
        <CardHeader>
          <CardTitle className="text-lg">{meme.caption}</CardTitle>
          {meme.tags && (
            <CardDescription>
              {meme.tags.split(',').map((tag, i) => (
                <span
                  key={i}
                  className="inline-block bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs mr-1 mb-1"
                >
                  {tag.trim()}
                </span>
              ))}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Like and Comment Stats */}
          <div className="flex items-center gap-4">
            <Button
              variant={hasLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              disabled={isLiking || hasLiked}
              className="flex items-center gap-2"
            >
              <Heart
                className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`}
              />
              <span>{meme.likes}</span>
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>{meme.comment_count}</span>
            </div>
          </div>

          {/* Uploader Address */}
          {meme.evm_address && (
            <p className="text-xs text-muted-foreground font-mono">
              By: {meme.evm_address.slice(0, 6)}...{meme.evm_address.slice(-4)}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
