
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPosts, transformPost, getCategories } from '@/lib/wp';
import type { Post } from './article-card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Category {
  id: number;
  name: string;
  slug: string;
}

const ChartItem = ({ post, rank }: { post: Post; rank: number }) => (
  <Link href={`/posts/${post.slug}`} className="group flex flex-col items-center text-center">
    <div className="relative mb-2 w-full">
      <span className="absolute -bottom-2 -left-2 z-10 font-bold text-lg text-accent-foreground bg-accent rounded-full h-6 w-6 flex items-center justify-center dark:bg-accent-deep dark:text-accent-foreground">
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
    <h3 className="mt-2 font-semibold leading-tight text-foreground group-hover:underline dark:text-accent-foreground text-white">{post.title}</h3>
    <p className="text-sm text-muted-foreground dark:text-accent-foreground/80 text-gray-200">{post.author.name}</p>
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        const allCategories = await getCategories({ per_page: 50 });
        const funReadsParent = allCategories.find((cat: any) => cat.slug === 'fun-reads');
        let funReadsCategories: Category[] = [];

        if (funReadsParent) {
            funReadsCategories = allCategories
            .filter((cat: any) => cat.parent === funReadsParent.id)
            .map((cat: any) => ({ id: cat.id, name: cat.name, slug: cat.slug }));
        }

        if (funReadsCategories.length === 0) {
            const fallbackCategory = allCategories.find((cat: any) => cat.slug === 'fun-reads');
            if (fallbackCategory) {
              funReadsCategories = [fallbackCategory];
            }
        }
        
        setCategories(funReadsCategories);

        if (funReadsCategories.length > 0) {
          setActiveCategory(funReadsCategories[0]);
        } else {
          // If still no categories, use the main fun-reads as a last resort if it exists
          const funReadsMain = allCategories.find((cat: any) => cat.slug === 'fun-reads');
           if(funReadsMain) setActiveCategory(funReadsMain);
        }

      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      if (!activeCategory) {
          if(!loading) setPosts([]);
          return
      };
      try {
        setLoading(true);
        const fetchedPosts = await getPosts({ categories: activeCategory.id, per_page: 5 });
        const transformed = fetchedPosts.map(p => transformPost(p)).filter(p => p !== null) as Post[];
        setPosts(transformed);
      } catch (error) {
        console.error(`Failed to fetch posts for category ${activeCategory.name}:`, error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [activeCategory, loading]);


  if (categories.length === 0 && !loading) {
    return null; 
  }

  return (
    <section className="w-full bg-accent-soft py-4 md:py-6 dark:bg-accent-deep">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 font-headline text-2xl font-bold tracking-tight text-foreground md:text-3xl dark:text-accent-foreground text-white">
          Top Fun Reads
        </h2>
        <div className="mb-6 flex flex-wrap justify-center gap-2">
            {categories.map(button => (
              <Button 
                key={button.slug} 
                variant="outline" 
                size="sm" 
                className={cn(
                  "border-input hover:bg-accent hover:text-accent-foreground dark:border-accent-foreground/50 dark:text-accent-foreground dark:hover:bg-accent-soft/80",
                  activeCategory?.slug === button.slug && "border-primary/50 bg-background text-primary hover:bg-primary/10 dark:border-accent-foreground/50 dark:bg-accent-soft dark:text-accent-foreground dark:hover:bg-accent-soft/80"
                )}
                onClick={() => setActiveCategory(button)}
              >
                {button.name}
              </Button>
            ))}
        </div>
        
        {loading ? (
            <ChartSkeleton />
        ) : (
             posts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto">
                    {posts.map((post, index) => (
                        <ChartItem key={post.id} post={post} rank={index + 1} />
                    ))}
                </div>
            ) : (
                <p className="text-accent-foreground/80">No posts found for this category.</p>
            )
        )}

        <div className="mt-6 flex flex-col items-center justify-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground dark:text-accent-foreground/80 text-gray-200">Week of {format(new Date(), 'MM/dd/yyyy')}</p>
             {activeCategory && (
                <Button variant="secondary" size="sm" asChild>
                    <Link href={`/category/${activeCategory.slug}`}>View All</Link>
                </Button>
             )}
        </div>
      </div>
    </section>
  );
}
