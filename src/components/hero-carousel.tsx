'use client';

import * as React from 'react';
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

interface HeroCarouselProps {
  posts: Post[];
}

export function HeroCarousel({ posts }: HeroCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
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

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

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
          {posts.map((post) => (
            <CarouselItem key={post.id}>
              <div className="relative h-[60vh] min-h-[400px] w-full md:h-[70vh]">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  data-ai-hint={post.imageHint}
                  className="object-cover"
                  priority={posts.indexOf(post) === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-12">
                  <div className="container mx-auto">
                    <Badge>{post.category}</Badge>
                    <h2 className="mt-4 font-headline text-3xl font-bold text-white shadow-2xl md:text-5xl lg:text-6xl max-w-4xl">
                      <Link href={`/posts/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2 max-w-2xl text-base text-gray-300 md:text-lg">
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
