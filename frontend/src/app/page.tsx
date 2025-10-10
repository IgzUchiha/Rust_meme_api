import { getMemes, type Meme } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MemeCard } from '@/components/meme-card';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let memes: Meme[] = [];
  let error: string | null = null;

  try {
    memes = await getMemes();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load memes';
  }

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">For You Page</h1>
          <p className="text-muted-foreground text-lg">
            Discover and share the most hilarious memes on the blockchain
          </p>
        </div>

        {error ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Error Loading Memes</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Make sure the Rust API is running on http://127.0.0.1:8000
              </p>
            </CardContent>
          </Card>
        ) : memes.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>No Memes Yet</CardTitle>
              <CardDescription>
                Be the first to upload a meme!
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <MemeCard key={meme.id} meme={meme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
