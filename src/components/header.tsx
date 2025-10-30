
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchOverlay } from './search-overlay';
import { getCategories } from '@/lib/wp';
import { ThemeToggle } from './theme-toggle';
import { MuteToggle } from './mute-toggle';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';

const UserNav = dynamic(() => import('./user-nav').then(mod => mod.UserNav), {
  ssr: false,
  loading: () => <Skeleton className="h-10 w-10 rounded-full" />,
});

interface NavLink {
  name: string;
  href: string;
}

const fallbackLinks: NavLink[] = [
  { name: 'Featured', href: '/category/featured' },
  { name: 'Fun Reads', href: '/category/fun-reads' },
  { name: 'News', href: '/category/news' },
];

const allStaticLinks: NavLink[] = [
  { name: 'Playlists', href: '/category/playlists' },
  { name: 'Live', href: '/category/live' },
  { name: 'Submit Your Music', href: '/submit-your-music' },
];

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLink[]>([...fallbackLinks, ...allStaticLinks]);
  
  useEffect(() => {
    async function fetchMenu() {
      try {
        const categories = await getCategories({per_page: 10});
        if (categories && categories.length > 0) {
            const dynamicSlugs = ['featured', 'fun-reads', 'news'];
            
            const filteredDynamicCategories = categories.filter((cat: any) => 
                dynamicSlugs.includes(cat.slug) && 
                cat.name !== 'Uncategorized' && 
                cat.count > 0
            );

            const dynamicLinks = filteredDynamicCategories.map((cat: any) => ({
              name: cat.name,
              href: `/category/${cat.slug}`,
            }));
            
            const finalDynamicLinks = fallbackLinks.map(fallback => 
                dynamicLinks.find(l => l.href.endsWith(fallback.href.split('/').pop()!)) || fallback
            );

            setNavLinks([...finalDynamicLinks, ...allStaticLinks]);
        } else {
             setNavLinks([...fallbackLinks, ...allStaticLinks]);
        }
      } catch (error) {
        console.error('Failed to fetch categories for header, using fallback:', error);
        setNavLinks([...fallbackLinks, ...allStaticLinks]);
      }
    }
    fetchMenu();
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-2 md:px-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/" className="flex items-center gap-2">
              <h1 className="font-headline text-xl font-bold tracking-tighter md:text-2xl">RagaMagazine</h1>
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center md:gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-0.5 md:gap-2">
            <div 
                className="relative w-10 md:w-40 lg:w-64 transition-all duration-300 ease-in-out"
                onFocus={() => setIsSearchOpen(true)}
            >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="h-9 w-full rounded-full bg-muted pl-9 pr-3 md:bg-background"
                    onClick={() => setIsSearchOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key) {
                            setIsSearchOpen(true);
                        }
                    }}
                    readOnly 
                />
            </div>
            <UserNav />
            <MuteToggle />
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full h-[calc(100vh-4rem)] bg-background z-50 md:hidden">
            <nav className="flex flex-col items-center gap-2 p-4">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="w-full rounded-md py-3 text-center text-lg font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground" onClick={() => setIsMenuOpen(false)}>
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
