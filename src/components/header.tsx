'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchOverlay } from './search-overlay';
import { mockPosts } from '@/data/posts';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Technology', href: '#' },
  { name: 'Culture', href: '#' },
  { name: 'Design', href: '#' },
  { name: 'Business', href: '#' },
  { name: 'Magazine', href: '#' },
];

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="font-headline text-2xl font-bold tracking-tighter md:text-3xl">RagaMagazine</h1>
          </Link>
          <nav className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} aria-label="Open search">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <nav className="flex flex-col items-center gap-4 px-4 pb-4">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="w-full rounded-md py-2 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground" onClick={() => setIsMenuOpen(false)}>
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
      <SearchOverlay posts={mockPosts} isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
