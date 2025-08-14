import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getPosts, getFeaturedImage } from '@/lib/wp';
import { Post } from '@/components/article-card';
import { VirtualMagazine } from '@/components/virtual-magazine';

// Helper function to transform WordPress posts to the app's Post format
function transformPost(wpPost: any): Post {
  const category = wpPost._embedded?.['wp:term']?.[0]?.find((term: any) => term.taxonomy === 'category')?.name || 'Uncategorized';
  
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
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]+>/g, ''),
    fullContent: wpPost.content.rendered,
    tags: wpPost._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name) || [],
    views: 0,
  };
}

export default async function VirtualMagazinePage() {
  const allPosts = await getPosts({ per_page: 20 });
  const magazinePosts = allPosts.map(transformPost);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto flex h-full flex-col items-center justify-center px-4 py-8 lg:py-12">
          <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Virtual Magazine
          </h1>
          {magazinePosts.length > 0 ? (
            <VirtualMagazine posts={magazinePosts} />
          ) : (
            <p className="text-muted-foreground">
              The magazine is currently empty. Check back soon!
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
