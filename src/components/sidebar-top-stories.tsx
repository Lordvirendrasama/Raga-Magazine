
'use client';

import React from 'react';
import Link from 'next/link';
import { type Post } from './article-card';
import { Badge } from './ui/badge';
import { ArrowUpRight, Music } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { formatDistanceToNow } from 'date-fns';

interface SidebarTopStoriesProps {
  posts: Post[];
  title?: string;
  hideMusicPromo?: boolean;
}

export function SidebarTopStories({ posts, title = "Top Stories", hideMusicPromo = false }: SidebarTopStoriesProps) {
  return (
    <aside className="sticky top-20 space-y-8">
      {!hideMusicPromo && (
        <>
            <div>
                <iframe
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/playlist/3uyM6sSqMepnevczhOfxUT?utm_source=generator&theme=0"
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                ></iframe>
            </div>
            
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Music className="h-6 w-6 text-primary" />
                    <span>Are you an artist?</span>
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground mb-4">
                    Get your music featured on RagaMagazine. We are always looking for new sounds.
                </p>
                <Button asChild className="w-full">
                    <Link href="/submit-your-music">Submit Your Music</Link>
                </Button>
                </CardContent>
            </Card>
        </>
      )}

      <div>
        <h2 className="mb-4 font-headline text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <div className="space-y-4">
          {posts.map((post, index) => (
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
              {index < posts.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </aside>
  );
}
