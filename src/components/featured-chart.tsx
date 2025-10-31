
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
      <span className="absolute -bottom-2 -left-2 z-10 font-bold text-lg text-primary-foreground bg-primary rounded-full h-6 w-6 flex items-center justify-center">
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
    <h3 className="mt-2 font-semibold leading-tight text-white group-hover:underline">{post.title}</h3>
    <p className="text-sm text-gray-200">{post.author.name}</p>
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


export function FeaturedChart() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const featuredCategory = await getCategoryIdBySlug('featured');
        if (featuredCategory) {
          const fetchedPosts = await getPosts({ categories: featuredCategory, per_page: 5 });
          const transformed = fetchedPosts.map(p => transformPost(p)).filter(p => p !== null) as Post[];

          const squareImages = [16, 17, 18, 19, 20].reverse();
          const finalPosts = transformed.map((post, index) => {
              return {
                  ...post,
                  imageUrl: `https://picsum.photos/seed/${squareImages[index % squareImages.length]}/600/600`,
                  imageHint: `abstract ${index}`
              }
          });

          setPosts(finalPosts);
        }
      } catch (error) {
        console.error('Failed to fetch featured posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (posts.length === 0 && !loading) {
    return null; 
  }

  return (
    <section className="w-full bg-primary py-4 md:py-6">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 font-headline text-2xl font-bold tracking-tight text-primary-foreground md:text-3xl">
          This Week's Features
        </h2>
        <div className="mb-6 flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" className="border-primary-foreground/50 bg-primary/80 text-primary-foreground hover:bg-primary/90">Editor's Picks</Button>
            <Button variant="outline" size="sm" className="border-primary-foreground/50 bg-primary/80 text-primary-foreground hover:bg-primary/90 opacity-80">Interviews</Button>
            <Button variant="outline" size="sm" className="border-primary-foreground/50 bg-primary/80 text-primary-foreground hover:bg-primary/90 opacity-80">Live Sessions</Button>
            <Button variant="outline" size="sm" className="border-primary-foreground/50 bg-primary/80 text-primary-foreground hover:bg-primary/90 opacity-80">Album Reviews</Button>
        </div>
        
        {loading ? (
            <ChartSkeleton />
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto">
                {posts.map((post, index) => (
                    <ChartItem key={post.id} post={post} rank={index + 1} />
                ))}
            </div>
        )}

        <div className="mt-6 flex flex-col items-center justify-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
            <p className="text-xs uppercase tracking-widest text-primary-foreground/80">Week of {format(new Date(), 'MM/dd/yyyy')}</p>
            <Button variant="outline" size="sm" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/category/featured">View All Features</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
