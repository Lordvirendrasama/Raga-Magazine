'use client';

import { useState, useEffect } from 'react';
import { format, isSameDay, startOfDay } from 'date-fns';
import { getPosts } from '@/lib/wp';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArticleCard, type Post } from '@/components/article-card';
import { Skeleton } from './ui/skeleton';

// Helper function to transform The Events Calendar posts to the app's Post format
function transformEventPost(wpPost: any): Post {
  return {
    id: wpPost.id,
    title: wpPost.title,
    slug: `/events/${wpPost.slug}`,
    category: wpPost.categories?.[0]?.name || 'Event',
    imageUrl: wpPost.image?.url || 'https://placehold.co/800x450',
    imageHint: wpPost.title.split(' ').slice(0, 2).join(' ').toLowerCase(),
    author: {
      name: wpPost.author?.display_name || 'RagaMagazine Staff',
      avatarUrl: 'https://secure.gravatar.com/avatar/?s=96&d=mm&r=g',
    },
    date: wpPost.start_date,
    excerpt: wpPost.description?.replace(/<[^>]+>/g, '') || '',
    tags: wpPost.tags?.map((tag: any) => tag.name) || [],
    views: 0,
  };
}

export function EventCalendar() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [events, setEvents] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set the initial date only on the client side to avoid hydration mismatch
    setDate(new Date());

    async function fetchEvents() {
      try {
        setLoading(true);
        const fetchedEvents = await getPosts({ per_page: 100 }, 'event');
        setEvents(fetchedEvents.map(transformEventPost));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError('Could not load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const eventDays = events.map(event => startOfDay(new Date(event.date)));

  const selectedDayEvents = date
    ? events.filter(event => isSameDay(new Date(event.date), date))
    : [];

  const handleDateSelect = (selectedDate: Date | undefined) => {
    // Only update if it's a new day, to prevent re-renders on month change etc.
    if (selectedDate && (!date || !isSameDay(selectedDate, date))) {
       setDate(selectedDate);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card className="shadow-lg">
          <CardContent className="p-0">
             <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="p-4"
                modifiers={{
                  'event-day': eventDays,
                }}
                modifiersClassNames={{
                  'event-day': 'day-with-event',
                }}
                disabled={loading}
             />
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1">
        <Card className="h-full shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            ) : error ? (
                <p className="text-destructive">{error}</p>
            ) : selectedDayEvents.length > 0 ? (
              <div className="space-y-6">
                {selectedDayEvents.map(event => (
                  <ArticleCard key={event.id} post={event} variant="compact" />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No events for this day.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
