
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

  // Each post takes 1 page + 1 for the main cover
  const totalPages = posts.length + 1; 

  const handleNextPage = () => {
    // We step by 2 pages to flip a whole spread
    setCurrentPage((prev) => Math.min(prev + 2, totalPages - (totalPages % 2)));
  };

  const handlePrevPage = () => {
    // We step back by 2 pages
    setCurrentPage((prev) => Math.max(prev - 2, 0));
  };
  
  const renderPageContent = (pageIndex: number) => {
    const postIndex = pageIndex -1;

    if (postIndex < 0 || postIndex >= posts.length) {
      return <div className="bg-card" />;
    }

    const post = posts[postIndex];
    const isCoverPage = pageIndex % 2 !== 0;

    if (isCoverPage) {
        return renderArticleCover(post);
    } else {
        return renderArticleContent(post);
    }
  }

  const renderArticleCover = (post: Post) => (
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

  const renderArticleContent = (post: Post) => (
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
    <div className="relative h-full w-full flex items-center justify-center">
      <div className="book-container w-full h-full max-w-[1400px] aspect-[16/9] lg:aspect-[2/1.2]">
        <div className="book">
           {/* Main Magazine Cover */}
          <div
            className={cn('book-page book-page--right visible', {
              'flipped': currentPage >= 1,
            })}
            style={{ zIndex: totalPages + 1 }}
          >
            <div className="page-front">
              <div className="relative h-full w-full cursor-pointer" onClick={handleNextPage}>
                  <Image
                      src={'https://placehold.co/800x1200'}
                      alt="RagaMagazine Cover"
                      fill
                      className="object-cover"
                      data-ai-hint="magazine cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-8">
                      <h1 className="font-headline text-5xl md:text-7xl font-bold">RagaMagazine</h1>
                      <p className="mt-4 text-lg md:text-xl text-balance">The best of our collection. Click to open.</p>
                  </div>
              </div>
            </div>
            <div className="page-back">
                {renderPageContent(1)}
            </div>
          </div>
          
          {/* Article Pages */}
          {posts.slice(1).map((post, index) => {
            const pageNumber = index + 2; 
            const zIndex = totalPages - pageNumber;
            const isFlipped = currentPage >= pageNumber;
            
            const isRightPage = pageNumber % 2 !== 0;

            if (isRightPage) {
              return (
                <div 
                  key={`page-spread-${post.id}`} 
                  className={cn('book-page book-page--right visible', {'flipped': isFlipped})}
                  style={{ zIndex: zIndex}}
                >
                  <div className="page-front">
                    {renderPageContent(pageNumber)}
                  </div>
                  <div className="page-back">
                    {renderPageContent(pageNumber + 1)}
                  </div>
                </div>
              )
            }
            return null;
           
          })}


        </div>
      </div>
       <Button
          variant="outline"
          size="icon"
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-50 rounded-full h-12 w-12 bg-background/50 hover:bg-background/80"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages -2 }
          className="absolute right-2 top-1/2 -translate-y-1/2 z-50 rounded-full h-12 w-12 bg-background/50 hover:bg-background/80"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
    </div>
  );
}
