'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

import type { Post } from './article-card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface VirtualMagazineProps {
  posts: Post[];
}

export function VirtualMagazine({ posts }: VirtualMagazineProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, posts.length));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };
  
  const renderCoverPage = (post: Post) => (
    <div className="relative h-full w-full">
      <Image
        src={post.imageUrl}
        alt={post.title}
        fill
        className="object-cover"
        data-ai-hint={post.imageHint}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <Badge variant="secondary" className="self-start">{post.category}</Badge>
        <h2 className="font-headline text-2xl md:text-4xl font-bold my-4 text-white shadow-2xl" dangerouslySetInnerHTML={{ __html: post.title }} />
      </div>
    </div>
  );

  const renderArticlePage = (post: Post) => (
    <div className="p-6 md:p-8 h-full flex flex-col bg-card text-card-foreground">
      <h3 className="font-headline text-xl md:text-2xl font-bold mb-4" dangerouslySetInnerHTML={{__html: post.title}} />
      <ScrollArea className="flex-grow pr-4">
        <div
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.fullContent || post.excerpt }}
        />
      </ScrollArea>
      <div className="mt-4 border-t pt-4 text-xs text-muted-foreground">
        <p>By {post.author.name}</p>
        <p>{format(new Date(post.date), 'MMMM d, yyyy')}</p>
        <Link href={`/posts/${post.slug}`} className="text-primary hover:underline mt-2 inline-block">Read Full Article Online</Link>
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-7xl aspect-[4/3] flex items-center justify-center">
      <div className="book-container w-full h-full">
        <div className="book">
          {posts.map((post, index) => {
            const pageNumber = index + 1;
            const isFlipped = currentPage >= pageNumber;
            const zIndex = posts.length - index;
            
            // The first page is the cover, which is a right page that flips open.
            if (index === 0) {
              return (
                <div
                  key={`page-${post.id}`}
                  className={cn('book-page book-page--right visible', {
                    'flipped': isFlipped,
                  })}
                  style={{ zIndex }}
                >
                  <div className="page-front">
                    <div className="relative h-full w-full">
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                            data-ai-hint={post.imageHint}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-8">
                            <h1 className="font-headline text-5xl md:text-7xl font-bold">RagaMagazine</h1>
                            <p className="mt-4 text-lg md:text-xl text-balance">The best of our collection. Click to open.</p>
                        </div>
                    </div>
                  </div>
                  <div className="page-back">
                    {renderCoverPage(post)}
                  </div>
                </div>
              );
            }

            // Subsequent pages
            return (
              <div
                key={`page-${post.id}`}
                className={cn(
                  'book-page visible',
                   pageNumber % 2 === 0 ? 'book-page--left': 'book-page--right',
                   {'flipped': isFlipped}
                )}
                style={{ zIndex }}
              >
                <div className="page-front">
                  {pageNumber % 2 === 0 ? renderArticlePage(post) : renderCoverPage(post)}
                </div>
                <div className="page-back">
                   {pageNumber % 2 === 0 ? renderCoverPage(post) : renderArticlePage(post)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
       <Button
          variant="outline"
          size="icon"
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-50 rounded-full h-12 w-12"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextPage}
          disabled={currentPage >= posts.length}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-50 rounded-full h-12 w-12"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
    </div>
  );
}
