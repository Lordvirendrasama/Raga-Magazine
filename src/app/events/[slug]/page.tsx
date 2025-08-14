import { getEventBySlug } from '@/lib/wp';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  // The Events Calendar API returns a plain string for the title
  const title = event.title;
  // The description might contain HTML, so we strip it for the metadata
  const excerpt = event.description.replace(/<[^>]+>/g, '');

  return {
    title: `${title} | RagaMagazine`,
    description: excerpt,
    openGraph: {
      title: title,
      description: excerpt,
      images: [
        {
          url: event.image?.url || 'https://placehold.co/1200x630',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}


export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  const category = event.categories?.[0]?.name || 'Event';
  // Author data might be structured differently in The Events Calendar
  const authorName = event.author?.display_name || 'RagaMagazine Staff';
  const authorAvatar = 'https://secure.gravatar.com/avatar/?s=96&d=mm&r=g'; // Default avatar
  const featuredImageUrl = event.image?.url || 'https://placehold.co/1200x630';
  const tags = event.tags?.map((tag: any) => tag.name) || [];

  const venue = event.venue;
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);

  return (
    <article>
      <header className="relative h-[60vh] min-h-[400px] w-full">
        <Image
          src={featuredImageUrl}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-12">
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
          className="prose prose-lg dark:prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed prose-headings:font-headline prose-a:text-accent hover:prose-a:underline"
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
