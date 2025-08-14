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

  const totalPages = Math.ceil(posts.length / 2);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages -1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const renderPageContent = (post: Post) => (
    <div className="p-6 md:p-8 h-full flex flex-col">
       <Badge variant="secondary" className="self-start">{post.category}</Badge>
       <h2 className="font-headline text-2xl md:text-3xl font-bold my-4" dangerouslySetInnerHTML={{ __html: post.title }} />
       <div className="relative aspect-video w-full overflow-hidden rounded-md mb-4">
         <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
       </div>
       <ScrollArea className="flex-grow pr-4">
         <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.fullContent || post.excerpt }} />
       </ScrollArea>
       <div className="mt-4 border-t pt-4 text-xs text-muted-foreground">
         <p>By {post.author.name}</p>
         <p>{format(new Date(post.date), 'MMMM d, yyyy')}</p>
         <Link href={`/posts/${post.slug}`} className="text-primary hover:underline mt-2 inline-block">Read Online</Link>
       </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-7xl aspect-[4/3] flex items-center justify-center">
      <div className="book-container w-full h-full">
        <div className="book">
          {posts.map((post, index) => {
             const pageIndex = Math.floor(index / 2);
             const isLeftPage = index % 2 === 0;
             const isVisible = pageIndex === currentPage;
             const isFlipped = pageIndex < currentPage;

            return (
                <div 
                    key={post.id} 
                    className={cn(
                        "book-page",
                        isLeftPage ? "book-page--left" : "book-page--right",
                        {
                            'flipped': isFlipped,
                            'visible': isVisible
                        }
                    )}
                    style={{
                        zIndex: isLeftPage ? posts.length - index : undefined
                    }}
                >
                    <div className="page-front">
                        {isLeftPage ? (
                             <div className="w-full h-full bg-card" />
                        ) : (
                           renderPageContent(post)
                        )}
                    </div>
                    <div className="page-back">
                        {isLeftPage ? (
                           renderPageContent(post)
                        ) : (
                            <div className="w-full h-full bg-card" />
                        )}
                    </div>
                </div>
            )
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
          disabled={currentPage >= totalPages -1}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-50 rounded-full h-12 w-12"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
    </div>
  );
}
