'use client';

import { useSession } from 'next-auth/react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Wallet, Mail, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { address, isConnected } = useAccount();
  const router = useRouter();

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
