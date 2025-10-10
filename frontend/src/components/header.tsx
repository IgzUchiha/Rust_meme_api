'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { ImageIcon, Upload, LogOut, User } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <ImageIcon className="h-6 w-6 text-white" />
            <span>Meme API</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="transition-colors hover:text-white text-gray-300"
            >
              Gallery
            </Link>
            <Link
              href="/upload"
              className="transition-colors hover:text-white text-gray-300"
            >
              Upload
            </Link>
            {session && (
              <Link
                href="/profile"
                className="transition-colors hover:text-white text-gray-300"
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
              <span className="text-sm text-gray-300 hidden md:inline">
                {session.user?.name || session.user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-white hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button 
                variant="default" 
                size="sm" 
                className="bg-white text-black hover:bg-gray-200"
              >
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
