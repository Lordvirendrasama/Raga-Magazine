'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { Post } from './article-card';
import { ScrollArea } from './ui/scroll-area';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SearchOverlayProps {
  posts: Post[];
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ posts, isOpen, onClose }: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const results = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(results);
    } else {
      setFilteredPosts([]);
    }
  }, [searchTerm, posts]);

  const handleClose = useCallback(() => {
    setSearchTerm('');
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
              {searchTerm.length > 1 && filteredPosts.length === 0 && (
                <p className="text-center text-muted-foreground">No results found.</p>
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
                      <h3 className="font-semibold text-foreground group-hover:text-primary">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">{post.excerpt}</p>
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
