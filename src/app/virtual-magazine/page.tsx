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
  const allPosts = await getPosts({ per_page: 10 });
  const magazinePosts = allPosts.map(transformPost);

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 overflow-hidden p-4 md:p-8">
          {magazinePosts.length > 0 ? (
            <VirtualMagazine posts={magazinePosts} />
          ) : (
            <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">
                The magazine is currently empty. Check back soon!
                </p>
            </div>
          )}
      </main>
    </div>
  );
}
