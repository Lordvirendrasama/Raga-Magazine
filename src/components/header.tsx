
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchOverlay } from './search-overlay';
import { getCategories } from '@/lib/wp';
import { ThemeToggle } from './theme-toggle';
import { MuteToggle } from './mute-toggle';
import { StreakCounter } from './streak-counter';
import { UserAuth } from './user-auth';
import { useAuth } from '@/hooks/use-auth';

interface NavLink {
  name: string;
  href: string;
}

const fallbackLinks: NavLink[] = [
  { name: 'Technology', href: '/category/technology' },
  { name: 'Culture', href: '/category/culture' },
  { name: 'Design', href: '/category/design' },
];

const allStaticLinks: NavLink[] = [
  { name: 'Museum', href: '/museum' },
  { name: 'Events', href: '/events' },
  { name: 'Admin', href: '/admin' },
];

export function Header() {
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLink[]>([...fallbackLinks, ...allStaticLinks]);
  
  useEffect(() => {
    async function fetchMenu() {
      try {
        const baseLinks = [...allStaticLinks];
        
        const categories = await getCategories();
        if (categories && categories.length > 0) {
            const filteredCategories = categories.filter((cat: any) => cat.name !== 'Uncategorized' && cat.count > 0);
            const links = filteredCategories.slice(0,3).map((cat: any) => ({
              name: cat.name,
              href: `/category/${cat.slug}`,
            }));
            setNavLinks([...links, ...baseLinks]);
        } else {
             setNavLinks([...fallbackLinks, ...baseLinks]);
        }
      } catch (error) {
        console.error('Failed to fetch categories for header, using fallback:', error);
        const baseLinks = [...allStaticLinks];
        setNavLinks([...fallbackLinks, ...baseLinks]);
      }
    }
    fetchMenu();
  }, [user]);

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
            <StreakCounter />
          </div>
          <nav className="hidden md:flex md:items-center md:gap-4 lg:gap-6">
            {navLinks.map((link, index) => (
              <Link key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-0.5 md:gap-2">
            <UserAuth />
            <MuteToggle />
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} aria-label="Open search">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="absolute top-16 left-0 w-full h-[calc(100vh-4rem)] bg-background z-50 md:hidden">
            <nav className="flex flex-col items-center gap-2 p-4">
              {navLinks.map((link, index) => (
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
