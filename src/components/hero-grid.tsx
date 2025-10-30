
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArticleCard, type Post } from './article-card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { formatDistanceToNow } from 'date-fns';

interface HeroGridProps {
  featuredPost: Post;
  sidePosts: Post[];
  topStories: Post[];
}

export function HeroGrid({ featuredPost, sidePosts, topStories }: HeroGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      
      {/* Left Column */}
      <div className="md:col-span-1 space-y-6">
        {sidePosts.map(post => (
          <ArticleCard key={post.id} post={post} variant="compact" />
        ))}
      </div>

      {/* Middle Column */}
      <div className="md:col-span-2">
        <Link href={`/posts/${featuredPost.slug}`} className="group block">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image 
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={featuredPost.imageHint}
                    priority
                />
            </div>
            <div className="mt-4">
                <Badge variant="default">Top Story</Badge>
                <h2 className="mt-2 font-headline text-3xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {featuredPost.title}
                </h2>
                <p className="mt-2 text-muted-foreground">{featuredPost.excerpt}</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{featuredPost.author.name}</p>
            </div>
        </Link>
      </div>
      
      {/* Right Column */}
      <div className="md:col-span-1">
        <h2 className="mb-4 font-headline text-2xl font-bold tracking-tight text-foreground">
          Top Stories
        </h2>
        <div className="space-y-4">
          {topStories.map((post, index) => (
            <React.Fragment key={post.id}>
              <Link href={`/posts/${post.slug}`} className="group flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold leading-tight group-hover:underline">{post.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <time dateTime={post.date}>
                        {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
                    </time>
                  </p>
                </div>
              </Link>
              {index < topStories.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
