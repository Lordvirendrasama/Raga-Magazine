
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArticleCard, type Post } from './article-card';
import { Badge } from './ui/badge';

interface HeroGridProps {
  featuredPost: Post;
  sidePosts: Post[];
}

export function HeroGrid({ featuredPost, sidePosts }: HeroGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Left Column */}
      <div className="md:col-span-1 space-y-6">
        {sidePosts.map(post => (
          <ArticleCard key={post.id} post={post} variant="compact" />
        ))}
      </div>

      {/* Right Column */}
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
    </div>
  );
}
