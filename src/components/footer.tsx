
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
    { name: 'Technology', href: '/category/technology' },
    { name: 'Culture', href: '/category/culture' },
    { name: 'Design', href: '/category/design' },
];

const allStaticLinks: CategoryLink[] = [
  { name: 'Playlists', href: '/category/playlists' },
  { name: 'Live', href: '/category/live' },
];

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [navLinks, setNavLinks] = useState<CategoryLink[]>([...fallbackLinks, ...allStaticLinks]);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());

    async function fetchLinks() {
      try {
        const categories = await getCategories();
        if (categories && categories.length > 0) {
            const filteredCategories = categories.filter((cat: any) => cat.name !== 'Uncategorized' && cat.count > 0 && cat.slug !== 'playlists' && cat.slug !== 'live');
            const categoryLinks = filteredCategories.slice(0, 3).map((cat: any) => ({
              name: cat.name,
              href: `/category/${cat.slug}`,
            }));
            setNavLinks([...categoryLinks, ...allStaticLinks]);
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
