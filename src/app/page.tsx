
'use client';

import { useState, useEffect } from 'react';
import { HeroGrid } from "@/components/hero-grid";
import { MagazineGrid } from "@/components/magazine-grid";
import { getPosts, transformPost } from "@/lib/wp";
import type { Post } from "@/components/article-card";
import { Skeleton } from '@/components/ui/skeleton';
import { FunReadsChart } from '@/components/fun-reads-chart';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedPosts = await getPosts({ per_page: 20 });
        const transformed = fetchedPosts.map(p => transformPost(p)).filter(p => p !== null) as Post[];
        setPosts(transformed);
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
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
            <div className="md:col-span-2">
                <Skeleton className="h-[40rem] w-full" />
            </div>
            <div className="md:col-span-1 space-y-4">
                 <Skeleton className="h-10 w-2/3 mb-4" />
                 <Skeleton className="h-20 w-full" />
                 <Skeleton className="h-20 w-full" />
                 <Skeleton className="h-20 w-full" />
                 <Skeleton className="h-20 w-full" />
            </div>
        </div>
      </div>
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
  
  const heroFeaturedPost = posts.find(p => p.tags.includes('featured')) || posts[0];
  const heroSidePosts = posts.filter(p => p.id !== heroFeaturedPost.id).slice(0, 2);
  const heroTrendingPosts = posts.slice(0, 5);
  
  const magazinePosts = posts.filter(p => 
      p.id !== heroFeaturedPost.id && !heroSidePosts.some(sp => sp.id === p.id)
  ).slice(0, 9);


  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
        <HeroGrid 
            featuredPost={heroFeaturedPost}
            sidePosts={heroSidePosts}
            trendingPosts={heroTrendingPosts}
        />
        <div className="mt-12">
             <MagazineGrid initialPosts={magazinePosts} />
        </div>
        <FunReadsChart />
    </div>
  );
}
