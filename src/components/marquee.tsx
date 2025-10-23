
'use client';

import { Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { getPosts, getTags } from '@/lib/wp';
import type { Post } from './article-card';

export const Marquee = ({ className }: { className?: string }) => {
  const [headlines, setHeadlines] = useState<string[]>(["Loading headlines..."]);

  useEffect(() => {
    async function fetchHeadlines() {
      try {
        const tags = await getTags();
        const featuredTag = tags.find((tag: any) => tag.slug === 'featured');
        
        if (featuredTag) {
          const featuredPosts = await getPosts({ tags: featuredTag.id, per_page: 10 });
          if (featuredPosts.length > 0) {
            setHeadlines(featuredPosts.map((post: Post) => post.title));
          } else {
            setHeadlines(["No featured articles found."]);
          }
        } else {
            // Fallback if 'featured' tag doesn't exist. Fetch latest posts.
            const latestPosts = await getPosts({per_page: 10});
            if (latestPosts.length > 0) {
                 setHeadlines(latestPosts.map((post: Post) => post.title));
            } else {
                setHeadlines(["Welcome to RagaMagazine."]);
            }
        }
      } catch (error) {
        console.error("Failed to fetch headlines for marquee:", error);
        setHeadlines(["Could not load headlines."]);
      }
    }
    fetchHeadlines();
  }, []);
  
  const allHeadlines = headlines.length > 1 ? [...headlines, ...headlines] : headlines;

  return (
    <div className={cn("fixed bottom-0 left-0 z-50 flex w-full overflow-x-hidden border-t bg-background py-2 text-sm text-muted-foreground", className)}>
      <div className={cn("flex whitespace-nowrap", allHeadlines.length > 1 && "animate-marquee")}>
        {allHeadlines.map((headline, index) => (
          <div key={index} className="mx-4 flex flex-shrink-0 items-center gap-2">
            <Newspaper className="h-4 w-4 flex-shrink-0 text-primary" />
            <span>{headline}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
