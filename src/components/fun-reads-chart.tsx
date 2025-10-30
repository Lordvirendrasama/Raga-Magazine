
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPosts, transformPost, getCategoryIdBySlug } from '@/lib/wp';
import type { Post } from './article-card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const ChartItem = ({ post, rank }: { post: Post; rank: number }) => (
  <Link href={`/posts/${post.slug}`} className="group flex flex-col items-center text-center">
    <div className="relative mb-2 w-full">
      <span className="absolute -bottom-2 -left-2 z-10 font-bold text-lg text-accent bg-accent-foreground rounded-full h-6 w-6 flex items-center justify-center">
        {rank}
      </span>
      <div className="aspect-square w-full overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={200}
          height={200}
          data-ai-hint={post.imageHint}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
    <h3 className="mt-2 font-semibold leading-tight text-accent-foreground group-hover:underline">{post.title}</h3>
    <p className="text-sm text-accent-foreground/80">{post.author.name}</p>
  </Link>
);

const ChartSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
                <Skeleton className="w-full aspect-square rounded-lg bg-white/20" />
                <Skeleton className="h-4 w-3/4 bg-white/20" />
                <Skeleton className="h-4 w-1/2 bg-white/20" />
            </div>
        ))}
    </div>
);


export function FunReadsChart() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFunReads() {
      try {
        const funReadsCategory = await getCategoryIdBySlug('fun-reads');
        if (funReadsCategory) {
          const fetchedPosts = await getPosts({ categories: funReadsCategory, per_page: 5 });
          const transformed = fetchedPosts.map(p => transformPost(p)).filter(p => p !== null) as Post[];

          // Replace default image with square ones
          const squareImages = [16, 17, 18, 19, 20];
          const finalPosts = transformed.map((post, index) => {
              const imageIndex = squareImages[index % squareImages.length] -1;
              return {
                  ...post,
                  imageUrl: `https://picsum.photos/seed/${squareImages[index % squareImages.length]}/600/600`,
                  imageHint: `abstract ${index}`
              }
          });

          setPosts(finalPosts);
        }
      } catch (error) {
        console.error('Failed to fetch fun reads:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFunReads();
  }, []);

  if (posts.length === 0 && !loading) {
    return null; // Don't render the section if there are no posts and not loading
  }

  return (
    <section className="w-full bg-accent-deep py-8 md:py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 font-headline text-2xl font-bold tracking-tight text-accent-foreground md:text-3xl">
          Top Fun Reads
        </h2>
        <div className="mb-6 flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" className="border-accent-foreground/50 bg-accent-soft text-accent-foreground hover:bg-accent-soft/80">Hot 100</Button>
            <Button variant="outline" size="sm" className="border-accent-foreground/50 text-accent-foreground hover:bg-accent-soft/80">Billboard 200</Button>
            <Button variant="outline" size="sm" className="border-accent-foreground/50 text-accent-foreground hover:bg-accent-soft/80">Global 200</Button>
            <Button variant="outline" size="sm" className="border-accent-foreground/50 text-accent-foreground hover:bg-accent-soft/80">Artist 100</Button>
            <Button variant="outline" size="sm" className="border-accent-foreground/50 text-accent-foreground hover:bg-accent-soft/80">Top Streaming</Button>
        </div>
        
        {loading ? (
            <ChartSkeleton />
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto">
                {posts.map((post, index) => (
                    <ChartItem key={post.id} post={post} rank={index + 1} />
                ))}
            </div>
        )}

        <div className="mt-6 flex flex-col items-center justify-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
            <p className="text-xs uppercase tracking-widest text-accent-foreground/80">Week of {format(new Date(), 'MM/dd/yyyy')}</p>
            <Button variant="outline" size="sm" className="border-accent-foreground/50 text-accent-foreground hover:bg-accent-soft/80" asChild>
                <Link href="/category/fun-reads">View All</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
