'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { Post } from './article-card';
import { ScrollArea } from './ui/scroll-area';
import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from '@/lib/wp';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to transform WordPress posts to the app's Post format
function transformPost(wpPost: any): Post {
  const category = wpPost._embedded?.['wp:term']?.[0]?.find((term: any) => term.taxonomy === 'category')?.name || 'Uncategorized';
  
  // This function is defined in page.tsx, we need a simplified version or a shared one.
  const getFeaturedImage = (post: any): string => {
    const featuredMedia = post?._embedded?.['wp:featuredmedia'];
    if (featuredMedia && featuredMedia[0]?.source_url) {
      return featuredMedia[0].source_url;
    }
    return 'https://placehold.co/800x450'; // Fallback placeholder
  }

  return {
    id: wpPost.id,
    title: wpPost.title.rendered,
    slug: wpPost.slug,
    category: category,
    imageUrl: getFeaturedImage(wpPost),
    imageHint: wpPost.title.rendered.split(' ').slice(0, 2).join(' ').toLowerCase(),
    author: {
      name: wpPost._embedded?.author?.[0]?.name || 'RagaMagazine Staff',
      avatarUrl: wpPost._embedded?.author?.[0]?.avatar_urls?.['96'] || 'https://placehold.co/40x40',
    },
    date: wpPost.date_gmt,
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]+>/g, ''), // Strip HTML tags
    tags: wpPost._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name) || [],
    views: 0, // WP API doesn't provide view count by default
  };
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
        setFilteredPosts(results.map(transformPost));
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
                 <div className="flex justify-center items-center h-full">
                    <p className="text-center text-muted-foreground">Loading...</p>
                 </div>
              )}
              {!isLoading && searchTerm.length > 2 && filteredPosts.length === 0 && (
                <p className="text-center text-muted-foreground">No results found for "{searchTerm}".</p>
              )}
              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <Link href={`/posts/${post.slug}`} key={post.id} onClick={handleClose} className="group flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-accent/50">
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
                      <h3 className="font-semibold text-foreground group-hover:text-primary" dangerouslySetInnerHTML={{ __html: post.title }} />
                      <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
