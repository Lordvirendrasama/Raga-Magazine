'use client';

import { useState } from 'react';
import { ArticleCard, type Post } from './article-card';
import { Button } from './ui/button';

interface MagazineGridProps {
  initialPosts: Post[];
}

const POSTS_PER_PAGE = 8;

export function MagazineGrid({ initialPosts }: MagazineGridProps) {
  const [posts, setPosts] = useState(initialPosts.slice(0, POSTS_PER_PAGE));
  const [hasMore, setHasMore] = useState(initialPosts.length > POSTS_PER_PAGE);

  const loadMorePosts = () => {
    const currentLength = posts.length;
    const morePosts = initialPosts.slice(currentLength, currentLength + POSTS_PER_PAGE);
    setPosts([...posts, ...morePosts]);
    if (currentLength + POSTS_PER_PAGE >= initialPosts.length) {
      setHasMore(false);
    }
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
            noteIndex={index}
          />
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Button onClick={loadMorePosts} size="lg">
            Load More Stories
          </Button>
        </div>
      )}
    </section>
  );
}
