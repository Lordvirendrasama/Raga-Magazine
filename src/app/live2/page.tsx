
'use client';

import { useState, useEffect } from 'react';
import { getPosts } from '@/lib/wp';
import { ArticleCard, type Post } from '@/components/article-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Live2Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const fetchedPosts = await getPosts({ per_page: 12 }, 'event');
        
        if (fetchedPosts && fetchedPosts.length > 0) {
            setPosts(fetchedPosts);
        } else {
            setError('Could not load live events. Please try again later.');
        }
      } catch (error) {
        console.error(`Failed to fetch live events:`, error);
        setError('An unexpected error occurred while fetching events.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Live Events
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        Live Events
      </h1>
      {error ? (
         <p className="text-center text-destructive">{error}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} variant="default" />
          ))}
        </div>
      )}
    </div>
  );
}
