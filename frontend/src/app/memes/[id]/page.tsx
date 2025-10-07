'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import Image from 'next/image';

interface Meme {
  id: number;
  caption: string;
  tags: string;
  image: string;
  evm_address?: string;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
}

export default function MemeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [meme, setMeme] = useState<Meme | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeme() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/memes`);
        const memes = await response.json();
        const foundMeme = memes.find((m: Meme) => m.id === Number(params.id));
        
        if (foundMeme) {
          setMeme(foundMeme);
          // Load mock comments (in production, fetch from API)
          setComments([
            {
              id: 1,
              author: 'CryptoFan',
              content: 'This is hilarious! 😂',
              timestamp: '2 hours ago',
            },
            {
              id: 2,
              author: 'MemeKing',
              content: 'Classic! Love it',
              timestamp: '5 hours ago',
            },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch meme:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMeme();
  }, [params.id]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    if (!session) {
      alert('Please sign in to comment');
      return;
    }

    const comment: Comment = {
      id: comments.length + 1,
      author: session.user?.name || 'Anonymous',
      content: newComment,
      timestamp: 'Just now',
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!meme) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Meme Not Found</CardTitle>
            <CardDescription>The meme you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Meme Image */}
          <Card className="overflow-hidden">
            <div className="relative aspect-square bg-muted">
              {meme.image && meme.image.startsWith('http') ? (
                <Image
                  src={meme.image}
                  alt={meme.caption}
                  fill
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No image</p>
                </div>
              )}
            </div>
          </Card>

          {/* Meme Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{meme.caption}</CardTitle>
                {meme.tags && (
                  <CardDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {meme.tags.split(',').map((tag, i) => (
                        <span
                          key={i}
                          className="inline-block bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  </CardDescription>
                )}
              </CardHeader>
              {meme.evm_address && (
                <CardContent>
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Uploaded by:</p>
                    <p className="font-mono text-xs bg-muted p-2 rounded">
                      {meme.evm_address}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="space-y-2">
                  <Textarea
                    placeholder={
                      session
                        ? 'Add a comment...'
                        : 'Sign in to comment'
                    }
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={!session}
                    rows={3}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!session || !newComment.trim()}
                    className="w-full"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Post Comment
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="border-l-2 border-primary/20 pl-4 py-2"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">
                            {comment.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
