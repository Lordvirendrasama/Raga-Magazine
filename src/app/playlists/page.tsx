
'use client';

import { useState, useEffect } from 'react';
import { getPosts, getCategoryBySlug, transformPost } from '@/lib/wp';
import type { Post } from '@/components/article-card';
import { ArticleCard } from '@/components/article-card';
import { Skeleton } from '@/components/ui/skeleton';
import { notFound } from 'next/navigation';

export default function PlaylistsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('Playlists');

  useEffect(() => {
    async function fetchPlaylists() {
      setLoading(true);
      try {
        const playlistCategory = await getCategoryBySlug('playlists');
        
        if (!playlistCategory) {
          console.error("The 'playlists' category was not found in your WordPress site.");
          setPosts([]);
          setLoading(false);
          // We can still show an empty state without a full 404
          return;
        }

        setCategoryName(playlistCategory.name);
        const fetchedPosts = await getPosts({ categories: playlistCategory.id, per_page: 12 });
        setPosts(fetchedPosts.map(p => transformPost(p)).filter(p => p !== null) as Post[]);

      } catch (error) {
        console.error("Failed to fetch posts for playlists category:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaylists();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-6 w-2/3 mb-8" />
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
      <div className="mb-8 text-center md:mb-12">
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {categoryName}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Handpicked articles from our {categoryName} collection.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} variant="default" />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No articles found in this category. Check back soon!</p>
      )}
    </div>
  );
}
