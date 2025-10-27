
'use client';

import { useState, useEffect } from 'react';
import { getPosts, getCategoryBySlug } from '@/lib/wp';
import { notFound } from 'next/navigation';
import { ArticleCard, type Post } from '@/components/article-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryClientPage({ slug }: { slug: string }) {
  const [category, setCategory] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const cat = await getCategoryBySlug(slug);
        if (!cat) {
          notFound();
          return;
        }
        setCategory(cat);

        const fetchedPosts = await getPosts({ categories: cat.id, per_page: 12 });
        setPosts(fetchedPosts);
      } catch (error) {
        console.error(`Failed to fetch data for category ${slug}:`, error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <Skeleton className="h-12 w-1/3 mb-8" />
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

  if (!category) {
    // This can happen if fetching fails, e.g., notFound() was called or an error occurred.
    // The notFound() call in useEffect will render the 404 page, but this is a fallback.
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        Category: {category.name}
      </h1>
      {posts.length === 0 ? (
         <p className="text-center text-muted-foreground">Could not load posts for this category. Please try again later.</p>
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
