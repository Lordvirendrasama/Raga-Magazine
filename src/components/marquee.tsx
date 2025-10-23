
'use client';

import { Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

const headlines = [
  "Global markets react to new tech regulations",
  "Artist Spotlight: A new voice in contemporary music emerges",
  "The science behind the perfect sound: an interview with a top audio engineer",
  "Live event coverage: Music festival brings thousands together",
  "Breaking: New album drops from a legendary band",
  "Tech trends: AI's impact on music production",
  "Cultural deep dive: The history of the sitar",
  "Independent artists to watch this year",
];

export const Marquee = ({ className }: { className?: string }) => {
  const allHeadlines = [...headlines, ...headlines];
  return (
    <div className={cn("fixed bottom-0 left-0 z-50 flex w-full overflow-x-hidden border-t bg-background py-2 text-sm text-muted-foreground", className)}>
      <div className="flex animate-marquee whitespace-nowrap">
        {allHeadlines.map((headline, index) => (
          <div key={index} className="mx-4 flex flex-shrink-0 items-center gap-2">
            <Newspaper className="h-4 w-4 flex-shrink-0 text-primary" />
            <span>{headline}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
