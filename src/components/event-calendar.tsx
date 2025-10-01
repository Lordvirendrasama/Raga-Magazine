
'use client';

import { useState, useEffect } from 'react';
import { format, isSameDay, startOfDay } from 'date-fns';
import { getPosts, transformPost } from '@/lib/wp';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArticleCard, type Post } from '@/components/article-card';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, List } from 'lucide-react';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkDevice = () => setIsMobile(window.innerWidth < 768);
        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);
    return isMobile;
}

export function EventCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);
        const fetchedEvents = await getPosts({ per_page: 100 }, 'event');
        if (fetchedEvents && fetchedEvents.length > 0) {
            setEvents(fetchedEvents.map(transformPost));
        } else {
            // Don't set an error if it's just empty, but do if fetch failed
            if (!fetchedEvents) {
              setError('Could not load events. Please try again later.');
            }
            setEvents([]);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError('An unexpected error occurred while fetching events.');
        setEvents([]); 
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
    if (selectedDate && (!date || !isSameDay(selectedDate, date))) {
       setDate(selectedDate);
    }
  }

  const renderEventsList = () => (
    loading ? (
        <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
    ) : error ? (
        <p className="py-8 text-center text-destructive">{error}</p>
    ) : selectedDayEvents.length > 0 ? (
      <div className="space-y-6">
        {selectedDayEvents.map(event => (
          <ArticleCard key={event.id} post={event} variant="compact" />
        ))}
      </div>
    ) : (
      <p className="py-8 text-center text-muted-foreground">No events for this day.</p>
    )
  );

  const renderCalendar = () => (
     <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="p-0 sm:p-4"
        modifiers={{
          'event-day': eventDays,
        }}
        modifiersClassNames={{
          'event-day': 'day-with-event',
        }}
        disabled={loading}
     />
  );
  
  if (isMobile) {
    return (
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="calendar"><CalendarIcon className="mr-2 h-4 w-4"/>Calendar</TabsTrigger>
          <TabsTrigger value="events"><List className="mr-2 h-4 w-4"/>Events ({selectedDayEvents.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <Card className="shadow-lg">
            <CardContent className="p-2">
              {renderCalendar()}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="events">
           <Card className="h-full shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl">
                  {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderEventsList()}
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card className="shadow-lg">
          <CardContent className="p-0">
             {renderCalendar()}
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
            {renderEventsList()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
