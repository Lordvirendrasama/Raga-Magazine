
'use client';

import { useState, useEffect } from 'react';
import { HeroCarousel } from "@/components/hero-carousel";
import { MagazineGrid } from "@/components/magazine-grid";
import { SidebarTopStories } from "@/components/sidebar-top-stories";
import { getPosts } from "@/lib/wp";
import type { Post } from "@/components/article-card";
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedPosts = await getPosts({ per_page: 20 });
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <>
        <Skeleton className="h-[65vh] w-full" />
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
            <div className="lg:col-span-1 space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 lg:py-12 text-center">
        <h2 className="font-headline text-2xl font-bold text-destructive">Could Not Load Posts</h2>
        <p className="mt-2 text-muted-foreground">There was a problem connecting to the content server. Please try again later.</p>
      </div>
    );
  }
  
  const featuredPosts = posts.filter(p => p.tags.includes('featured')).slice(0, 5);
  const magazinePosts = posts.slice(0, 9);
  const trendingPosts = [...posts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).slice(0, 5);

  return (
    <>
      <HeroCarousel posts={featuredPosts.length > 0 ? featuredPosts : posts.slice(0,3)} />
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <MagazineGrid initialPosts={magazinePosts} />
          </div>
          <div className="lg:col-span-1">
            <SidebarTopStories posts={trendingPosts} />
          </div>
        </div>
      </div>
    </>
  );
}
