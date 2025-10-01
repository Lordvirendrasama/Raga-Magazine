
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import type { Post } from './article-card';
import { cn } from '@/lib/utils';
import { useScalePlayer } from '@/hooks/use-scale-player';

interface HeroCarouselProps {
  posts: Post[];
}

export function HeroCarousel({ posts }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const playNote = useScalePlayer();

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (!posts || posts.length === 0) {
    return (
        <div className="relative flex h-[50vh] min-h-[350px] w-full items-center justify-center bg-muted md:h-[65vh]">
            <p className="text-muted-foreground">Could not load featured posts.</p>
        </div>
    );
  }

  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {posts.map((post, index) => (
            <CarouselItem key={post.id} onMouseEnter={() => playNote(index)}>
              <div className="relative h-[50vh] min-h-[350px] w-full overflow-hidden md:h-[65vh]">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  data-ai-hint={post.imageHint}
                  className="object-cover"
                  priority={posts.indexOf(post) === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 md:p-12">
                  <div className="container mx-auto">
                    <Badge>{post.category}</Badge>
                    <h2 className="mt-4 max-w-4xl font-headline text-2xl font-bold text-white shadow-2xl sm:text-3xl md:text-5xl lg:text-6xl">
                      <Link href={`/posts/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-gray-300 md:text-base lg:text-lg">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 transform">
        <div className="flex space-x-2">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'h-2 w-2 rounded-full transition-all duration-300',
                current === index ? 'w-6 bg-primary' : 'bg-white/50 hover:bg-white'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
