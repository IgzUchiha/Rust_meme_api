'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { ImageIcon, Upload, LogOut, User } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <ImageIcon className="h-6 w-6" />
            <span>Meme API</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Gallery
            </Link>
            <Link
              href="/upload"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Upload
            </Link>
            {session && (
              <Link
                href="/profile"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Profile
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ConnectButton />
          
          {session ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:inline">
                {session.user?.name || session.user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
