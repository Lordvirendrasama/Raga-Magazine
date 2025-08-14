'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, User, Maximize } from 'lucide-react';
import type { Post } from '@/components/article-card';

interface GalleryClientProps {
  artists: Post[];
}

export function GalleryClient({ artists }: GalleryClientProps) {
  const [rotation, setRotation] = useState(0);

  const rotateLeft = () => setRotation(rotation + 90);
  const rotateRight = () => setRotation(rotation - 90);

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center overflow-hidden bg-black text-white">
      <div className="w-full max-w-5xl text-center mb-8 px-4">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">Artists' Gallery</h1>
        <p className="mt-2 text-muted-foreground">An immersive showcase of talent.</p>
      </div>

      <div className="perspective-[1000px] w-full h-[400px]">
        <div
          className="scene relative w-full h-full"
          style={{ transformStyle: 'preserve-3d', transform: `rotateY(${rotation}deg)` }}
        >
          {artists.map((artist, index) => (
            <div
              key={artist.id}
              className="wall absolute flex h-[400px] w-[600px] flex-col items-center justify-center border border-primary/20 bg-card p-8 text-center shadow-lg"
              style={{
                transform: `rotateY(${index * 90}deg) translateZ(300px)`,
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-primary">
                <Image src={artist.author.avatarUrl} alt={artist.author.name} fill className="object-cover" />
              </div>
              <h3 className="mt-4 font-headline text-2xl font-bold">{artist.author.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{artist.excerpt}</p>
              <Button asChild variant="outline" className="mt-6">
                <Link href={`/posts/${artist.slug}`}>
                  <Maximize className="mr-2 h-4 w-4" />
                  View Article
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 flex gap-4">
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
  );
}
