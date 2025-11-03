
'use client';

import { Twitter, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import React, { useState, useEffect } from 'react';
import { getCategories } from '@/lib/wp';
import { Logo } from './logo';
import { cn } from '@/lib/utils';

interface CategoryLink {
  name: string;
  href: string;
}

const fallbackLinks: CategoryLink[] = [
    { name: 'Featured', href: '/category/featured' },
    { name: 'Fun Reads', href: '/category/fun-reads' },
    { name: 'News', href: '/category/news' },
];

const allStaticLinks: CategoryLink[] = [
  { name: 'Playlists', href: '/category/playlists' },
  { name: 'Live', href: '/category/live' },
  { name: 'Submit Your Music', href: '/submit-your-music' },
  { name: 'Terms of Service', href: '/terms' },
];

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [navLinks, setNavLinks] = useState<CategoryLink[]>([...fallbackLinks, ...allStaticLinks]);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());

    async function fetchLinks() {
      try {
        const categories = await getCategories({per_page: 10});
        if (categories && categories.length > 0) {
            const dynamicSlugs = ['featured', 'fun-reads', 'news'];
            const staticSlugs = allStaticLinks.map(l => l.href.split('/').pop());
            const allSlugs = [...dynamicSlugs, ...staticSlugs];

            const filteredCategories = categories.filter((cat: any) => 
                allSlugs.includes(cat.slug) &&
                cat.name !== 'Uncategorized' && 
                cat.count > 0
            );

            const categoryLinks = filteredCategories.map((cat: any) => ({
              name: cat.name,
              href: `/category/${cat.slug}`,
            }));
            
            // Re-order to match desired nav order and include fallbacks for missing items
            const finalNavLinks = [
                ...dynamicSlugs.map(slug => categoryLinks.find(l => l.href.endsWith(slug)) || fallbackLinks.find(f => f.href.endsWith(slug))),
                ...allStaticLinks.map(link => categoryLinks.find(l => l.href === link.href) || link),
            ].filter(Boolean) as CategoryLink[];
            
            setNavLinks(finalNavLinks);
        }
      } catch (error) {
        console.error('Failed to fetch categories for footer, using fallback:', error);
      }
    }
    fetchLinks();
  }, []);

  return (
    <footer className="bg-card text-card-foreground border-t-4 border-primary pb-10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:text-left">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
                <Logo className="w-48 h-14 mx-auto md:mx-0" />
            </Link>
            <p className="mt-2 text-sm text-card-foreground/80 max-w-md mx-auto md:mx-0">
                Exploring the vibrant soul of Indian music, where ancient traditions meet contemporary beats. A modern take on culture, sound, and identity.
            </p>
          </div>
          <div className="md:col-span-2 md:justify-self-end">
            <h3 className="font-semibold uppercase tracking-wider text-card-foreground">Navigate</h3>
            <ul className="mt-4 space-y-2 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-2">
              {navLinks.map((link) => (
                  <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className={cn("text-sm text-card-foreground/80 transition-colors hover:text-card-foreground")}
                      >
                          {link.name}
                      </Link>
                  </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-card-foreground/20 pt-8 text-center text-sm text-card-foreground/80 flex flex-col md:flex-row justify-between items-center gap-4">
            {currentYear && <p className="font-bold text-card-foreground">&copy; {currentYear} RagaMagazine. All rights reserved.</p>}
            <div className="flex space-x-4">
            <Button variant="ghost" size="icon" asChild className="text-card-foreground/80 hover:text-card-foreground hover:bg-card-foreground/10">
                <a href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="text-card-foreground/80 hover:text-card-foreground hover:bg-card-foreground/10">
                <a href="#" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild className="text-card-foreground/80 hover:text-card-foreground hover:bg-card-foreground/10">
                <a href="#" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
            </Button>
            </div>
        </div>
      </div>
    </footer>
  );
}
