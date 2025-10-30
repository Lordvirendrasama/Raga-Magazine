
'use client';

import { Twitter, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import React, { useState, useEffect } from 'react';
import { getCategories } from '@/lib/wp';

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
    <footer className="border-t bg-card pb-10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h2 className="font-headline text-2xl font-bold">RagaMagazine</h2>
            <p className="mt-2 text-sm text-muted-foreground">The future of reading is here.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div className="md:justify-self-center">
              <h3 className="font-semibold uppercase tracking-wider text-foreground">Navigate</h3>
              <ul className="mt-4 space-y-2">
                {navLinks.map((link, index) => (
                    <li key={link.name}>
                        <Link 
                          href={link.href} 
                          className={`text-sm text-muted-foreground hover:text-${index % 2 === 0 ? 'primary' : 'accent'}`}
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}
              </ul>
            </div>
            <div className="md:justify-self-end">
              <h3 className="font-semibold uppercase tracking-wider text-foreground">Follow Us</h3>
              <div className="mt-4 flex space-x-4">
                <Button variant="ghost" size="icon" asChild>
                  <a href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a href="#" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a href="#" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          {currentYear && <p>&copy; {currentYear} RagaMagazine. All rights reserved.</p>}
        </div>
      </div>
    </footer>
  );
}
