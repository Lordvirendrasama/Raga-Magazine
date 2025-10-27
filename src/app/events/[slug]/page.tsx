
'use client';

import { useState, useEffect } from 'react';
import { getEventBySlug } from '@/lib/wp';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventPage({ params }: { params: { slug: string } }) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    async function fetchData() {
      const slug = params.slug;
      if (!slug) return;
      try {
        setLoading(true);
        const eventData = await getEventBySlug(slug);
        if (!eventData) {
          notFound();
          return;
        }
        setEvent(eventData);
      } catch (error) {
        console.error('Failed to fetch event:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 lg:py-16">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-12 w-3/4 mb-6" />
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const category = event.categories?.[0]?.name || 'Event';
  const authorName = event.author?.display_name || 'RagaMagazine Staff';
  const authorAvatar = 'https://secure.gravatar.com/avatar/?s=96&d=mm&r=g';
  const featuredImageUrl = event.image?.url || 'https://placehold.co/1200x630';
  const tags = event.tags?.map((tag: any) => tag.name) || [];

  const venue = event.venue;
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);

  return (
    <article>
      <header className="relative h-[50vh] min-h-[350px] w-full md:h-[60vh]">
        <Image
          src={featuredImageUrl}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 md:p-12">
          <div className="container mx-auto">
            <Badge variant="default">{category}</Badge>
            <h1 className="mt-4 font-headline text-3xl font-bold text-white shadow-2xl md:text-5xl lg:text-6xl max-w-4xl">{event.title}</h1>
            <div className="mt-4 flex items-center gap-4">
              <Avatar>
                <AvatarImage src={authorAvatar} alt={authorName} />
                <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-white">{authorName}</p>
                <p className="text-sm text-gray-300">
                  <time dateTime={event.start_date}>{format(startDate, 'MMMM d, yyyy')}</time>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-8 lg:py-16">
        <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="font-headline text-2xl font-bold mb-4">Event Details</h2>
            <div className="space-y-4 text-muted-foreground">
                <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <span>{format(startDate, 'E, LLLL d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-3">
                    <ClockIcon className="h-5 w-5 text-primary" />
                    <span>{format(startDate, 'p')} - {format(endDate, 'p')}</span>
                </div>
                {venue?.venue && (
                    <div className="flex items-start gap-3">
                        <MapPinIcon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-foreground">{venue.venue}</p>
                            <p>{venue.address}, {venue.city}, {venue.stateprovince} {venue.zip}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div 
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: event.description }} 
        />

        {tags.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h3 className="text-lg font-semibold">Tags</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
