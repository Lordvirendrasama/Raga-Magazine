
'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { Post } from './article-card';
import { ScrollArea } from './ui/scroll-area';
import Link from 'next/link';
import Image from 'next/image';
import { getPosts, transformPost } from '@/lib/wp';
import { Skeleton } from './ui/skeleton';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async (term: string) => {
    if (term.length > 2) {
      setIsLoading(true);
      try {
        const results = await getPosts({ search: term, per_page: 10 });
        setFilteredPosts(results.map(p => transformPost(p)).filter(p => p !== null) as Post[]);
      } catch (error) {
        console.error("Search failed:", error);
        setFilteredPosts([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setFilteredPosts([]);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, handleSearch]);

  const handleClose = useCallback(() => {
    setSearchTerm('');
    setFilteredPosts([]);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [handleClose]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div className="container mx-auto h-full max-w-3xl px-4 py-8">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-2xl font-bold">Search</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close search</span>
            </Button>
          </div>
          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="What are you looking for?"
              className="h-12 w-full pl-10 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="mt-6 flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              {isLoading && (
                 <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-4 w-64" />
                        </div>
                      </div>
                    ))}
                 </div>
              )}
              {!isLoading && searchTerm.length > 2 && filteredPosts.length === 0 && (
                <p className="text-center text-muted-foreground">No results found for "{searchTerm}".</p>
              )}
              <div className="space-y-4">
                {filteredPosts.map((post, index) => {
                  const href = `/posts/${post.slug}`;
                  return (
                    <Link href={href} key={post.id} onClick={handleClose} className="group flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-accent/50">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          data-ai-hint={post.imageHint}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
