import { getPosts, getFeaturedImage } from '@/lib/wp';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ArticleCard, type Post } from '@/components/article-card';

// Helper function to transform WordPress posts to the app's Post format
function transformPost(wpPost: any): Post {
  // Custom post types might not have categories in the same way.
  // We'll assign a static category or look for a custom taxonomy if available.
  const category = 'Event'; 
  
  return {
    id: wpPost.id,
    title: wpPost.title.rendered,
    slug: wpPost.slug,
    category: category,
    imageUrl: getFeaturedImage(wpPost),
    imageHint: wpPost.title.rendered.split(' ').slice(0, 2).join(' ').toLowerCase(),
    author: {
      name: wpPost._embedded?.author?.[0]?.name || 'RagaMagazine Staff',
      avatarUrl: wpPost._embedded?.author?.[0]?.avatar_urls?.['96'] || 'https://placehold.co/40x40',
    },
    date: wpPost.date_gmt,
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]+>/g, ''), // Strip HTML tags
    tags: wpPost._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name) || [],
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
    const posts = await getPosts({ per_page: 12 }, 'event');
    transformedPosts = posts.map(transformPost);
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
