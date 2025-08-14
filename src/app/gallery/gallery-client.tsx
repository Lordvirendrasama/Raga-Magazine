
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, User, Image as ImageIcon } from 'lucide-react';
import type { Post } from '@/components/article-card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GalleryClientProps {
  post: Post;
}

export function GalleryClient({ post }: GalleryClientProps) {
  const [rotation, setRotation] = useState(0);

  const rotateLeft = useCallback(() => setRotation(r => r + 90), []);
  const rotateRight = useCallback(() => setRotation(r => r - 90), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        rotateLeft();
      } else if (event.key === 'ArrowRight') {
        rotateRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [rotateLeft, rotateRight]);

  const walls = [
    {
      id: 'content',
      title: 'The Article',
      icon: BookOpen,
      content: (
        <ScrollArea className="h-full w-full pr-4">
            <h3 className="mb-4 font-headline text-2xl font-bold" dangerouslySetInnerHTML={{ __html: post.title }} />
            <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.fullContent || post.excerpt }} />
        </ScrollArea>
      ),
    },
    {
      id: 'image',
      title: 'Cover Art',
      icon: ImageIcon,
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
        </div>
      ),
    },
    {
      id: 'author',
      title: 'Author Details',
      icon: User,
      content: (
        <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-primary">
                <Image src={post.author.avatarUrl} alt={post.author.name} fill className="object-cover" />
            </div>
            <h3 className="mt-4 font-headline text-2xl font-bold">{post.author.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-4">{post.excerpt}</p>
        </div>
      ),
    },
    {
      id: 'link',
      title: 'Read More',
      icon: ExternalLink,
      content: (
        <div className="flex h-full flex-col items-center justify-center text-center">
            <h3 className="font-headline text-3xl font-bold">Enjoying the article?</h3>
            <p className="mt-2 text-muted-foreground">Click below to view the full post.</p>
            <Button asChild size="lg" className="mt-6">
                <Link href={`/posts/${post.slug}`}>
                <ExternalLink className="mr-2 h-5 w-5" />
                Visit Article
                </Link>
            </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-[85vh] flex-col items-center justify-center overflow-hidden bg-background text-foreground">
      <div className="w-full max-w-5xl text-center mb-8 px-4">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">Latest from the Magazine</h1>
        <p className="mt-2 text-muted-foreground">An immersive look at our newest feature.</p>
      </div>

      <div className="relative w-full h-[550px]">
        <div className="perspective-[1500px] w-full h-full">
            <div
            className="scene relative w-full h-full"
            style={{ transformStyle: 'preserve-3d', transform: `rotateY(${rotation}deg)`, transition: 'transform 0.8s ease-out' }}
            >
            {walls.map((wall, index) => (
                <div
                key={wall.id}
                className="wall absolute flex h-[500px] w-[850px] flex-col items-center justify-start border border-primary/20 bg-card p-6 text-card-foreground shadow-lg"
                style={{
                    transform: `rotateY(${index * 90}deg) translateZ(425px) rotateY(180deg)`,
                    backfaceVisibility: 'hidden',
                }}
                >
                <div className="flex w-full items-center gap-3 border-b border-border pb-3 mb-4">
                    <wall.icon className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold tracking-wide">{wall.title}</h2>
                </div>
                <div className="h-full w-full flex-grow overflow-auto">
                    {wall.content}
                </div>
                </div>
            ))}
            </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex gap-4">
            <Button onClick={rotateLeft} size="lg" aria-label="Rotate left">
            <ArrowLeft className="mr-2" />
            Previous
            </Button>
            <Button onClick={rotateRight} size="lg" aria-label="Rotate right">
            Next
            <ArrowRight className="ml-2" />
            </Button>
        </div>
      </div>
    </div>
  );
}
