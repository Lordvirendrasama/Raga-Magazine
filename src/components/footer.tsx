'use client';

import { Twitter, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import React from 'react';

export function Footer() {
  const [currentYear, setCurrentYear] = React.useState<number | null>(null);

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h2 className="font-headline text-2xl font-bold">RagaMagazine</h2>
            <p className="mt-2 text-sm text-muted-foreground">The future of reading is here.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div className="md:justify-self-center">
              <h3 className="font-semibold uppercase tracking-wider text-foreground">Categories</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Technology</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Culture</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Design</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Business</Link></li>
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
