
'use client';

import { useState, useEffect } from 'react';
import { ArticleCard, type Post } from './article-card';
import { Button } from './ui/button';
import { getPosts } from '@/lib/wp';
import { Skeleton } from './ui/skeleton';

const POSTS_PER_PAGE = 8;

export function MagazineGrid({ initialPosts }: MagazineGridProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts.slice(0, POSTS_PER_PAGE));
  const [allPosts, setAllPosts] = useState<Post[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialPosts.length > POSTS_PER_PAGE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If initialPosts is small, fetch all posts to allow "Load More" to work.
    if (initialPosts.length < 20) {
      setLoading(true);
      getPosts({ per_page: 100 }).then(fullPostList => {
        setAllPosts(fullPostList);
        const initialSlice = fullPostList.slice(0, POSTS_PER_PAGE);
        setPosts(initialSlice);
        setHasMore(fullPostList.length > POSTS_PER_PAGE);
        setLoading(false);
      });
    }
  }, [initialPosts]);


  const loadMorePosts = () => {
    setLoading(true);
    const currentLength = posts.length;
    const morePosts = allPosts.slice(currentLength, currentLength + POSTS_PER_PAGE);
    
    setTimeout(() => { // Simulate network delay for better UX
      setPosts([...posts, ...morePosts]);
      if (currentLength + POSTS_PER_PAGE >= allPosts.length) {
        setHasMore(false);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <section>
      <h2 className="mb-6 font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        From the Magazine
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.map((post, index) => (
          <ArticleCard
            key={post.id}
            post={post}
            variant={index === 0 ? 'featured' : 'default'}
            className={index === 0 ? "md:col-span-2" : ""}
          />
        ))}
         {loading && hasMore && (
           [...Array(2)].map((_, i) => (
            <div key={`skeleton-${i}`} className="space-y-4">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
           ))
         )}
      </div>
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button onClick={loadMorePosts} size="lg" disabled={loading}>
            {loading ? 'Loading...' : 'Load More Stories'}
          </Button>
        </div>
      )}
    </section>
  );
}

interface MagazineGridProps {
  initialPosts: Post[];
}
