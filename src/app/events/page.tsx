import { getPosts, getFeaturedImage } from '@/lib/wp';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ArticleCard, type Post } from '@/components/article-card';

// Helper function to transform The Events Calendar posts to the app's Post format
function transformEventPost(wpPost: any): Post {
  return {
    id: wpPost.id,
    title: wpPost.title,
    slug: wpPost.slug,
    category: wpPost.categories?.[0]?.name || 'Event',
    imageUrl: wpPost.image?.url || 'https://placehold.co/800x450',
    imageHint: wpPost.title.split(' ').slice(0, 2).join(' ').toLowerCase(),
    author: {
      name: wpPost.author?.display_name || 'RagaMagazine Staff',
      avatarUrl: 'https://secure.gravatar.com/avatar/?s=96&d=mm&r=g', // Gravatar default
    },
    date: wpPost.start_date,
    excerpt: wpPost.description?.replace(/<[^>]+>/g, '') || '', // Strip HTML tags
    tags: wpPost.tags?.map((tag: any) => tag.name) || [],
    views: 0,
  };
}


export async function generateMetadata() {
  return {
    title: 'Events | RagaMagazine',
    description: 'Upcoming and past events from RagaMagazine.',
  };
}

export default async function EventsPage() {
  let transformedPosts: Post[] = [];
  let fetchError = false;

  try {
    const events = await getPosts({}, 'event');
    transformedPosts = events.map(transformEventPost);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    fetchError = true;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Events
          </h1>
          {fetchError ? (
             <p className="text-center text-muted-foreground">Could not load events. Please try again later.</p>
          ) : transformedPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {transformedPosts.map((post) => (
                <ArticleCard key={post.id} post={post} variant="default" />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No events found at the moment. Please check back soon!</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
