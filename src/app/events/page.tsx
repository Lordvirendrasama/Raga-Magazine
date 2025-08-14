import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { EventCalendar } from '@/components/event-calendar';

export async function generateMetadata() {
  return {
    title: 'Events Calendar | RagaMagazine',
    description: 'Browse upcoming and past events in our interactive calendar.',
  };
}

export default function EventsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="text-center mb-12">
            <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Events Calendar
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our curated events. Select a day to see what's happening.
            </p>
          </div>
          <EventCalendar />
        </div>
      </main>
      <Footer />
    </div>
  );
}
