
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { type Post } from './article-card';
import { Badge } from './ui/badge';
import { ArrowUpRight } from 'lucide-react';

interface SidebarTopStoriesProps {
  posts: Post[];
}

export function SidebarTopStories({ posts }: SidebarTopStoriesProps) {
  return (
    <aside className="sticky top-20">
      <h2 className="mb-6 font-headline text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        Top Stories
      </h2>
      <div className="space-y-6">
        {posts.map((post, index) => (
          <Link href={post.isEvent ? `/events/${post.slug}` : `/posts/${post.slug}`} key={post.id} className="group flex items-start gap-4">
            <span className="font-headline text-3xl font-bold text-muted-foreground">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex-1">
              <h3 className="font-semibold leading-tight group-hover:text-accent">{post.title}</h3>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{post.author.name}</span>
                <Badge variant="outline">{post.category}</Badge>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </aside>
  );
}
