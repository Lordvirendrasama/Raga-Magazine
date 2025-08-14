import { Header } from "@/components/header";
import { HeroCarousel } from "@/components/hero-carousel";
import { MagazineGrid } from "@/components/magazine-grid";
import { SidebarTopStories } from "@/components/sidebar-top-stories";
import { Footer } from "@/components/footer";
import { getPosts, getFeaturedImage } from "@/lib/wp";
import type { Post } from "@/components/article-card";

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
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]+>/g, ''), // Strip HTML tags
    tags: wpPost._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name) || [],
    views: 0, // WP API doesn't provide view count by default
  };
}

export default async function Home() {
  const allPosts = await getPosts({ per_page: 20, _embed: true }).catch(() => []);
  const transformedPosts = allPosts.map(transformPost);

  const featuredPosts = transformedPosts.filter(p => p.tags.includes('featured')).slice(0, 5);
  const magazinePosts = transformedPosts.slice(0, 9);
  const trendingPosts = [...transformedPosts].sort((a, b) => {
    // Basic trending sort by date as views are not available
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).slice(0, 5);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroCarousel posts={featuredPosts.length ? featuredPosts : transformedPosts.slice(0,3)} />
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2">
              <MagazineGrid initialPosts={magazinePosts} />
            </div>
            <div className="lg:col-span-1">
              <SidebarTopStories posts={trendingPosts} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
