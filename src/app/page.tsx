
import { HeroCarousel } from "@/components/hero-carousel";
import { MagazineGrid } from "@/components/magazine-grid";
import { SidebarTopStories } from "@/components/sidebar-top-stories";
import { getPosts, transformPost } from "@/lib/wp";
import type { Post } from "@/components/article-card";

export default async function Home() {
  const rawPosts = await getPosts({ per_page: 20 });
  
  if (!rawPosts || rawPosts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 lg:py-12 text-center">
        <h2 className="font-headline text-2xl font-bold text-destructive">Could Not Load Posts</h2>
        <p className="mt-2 text-muted-foreground">There was a problem connecting to the content server. Please try again later.</p>
      </div>
    );
  }
  
  const transformedPosts: Post[] = rawPosts.map(transformPost);
  
  const featuredPosts = transformedPosts.filter(p => p.tags.includes('featured')).slice(0, 5);
  const magazinePosts = transformedPosts.slice(0, 9);
  const trendingPosts = [...transformedPosts].sort((a, b) => {
    // Basic trending sort by date as views are not available
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).slice(0, 5);

  return (
    <>
      <HeroCarousel posts={featuredPosts.length > 0 ? featuredPosts : transformedPosts.slice(0,3)} />
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
    </>
  );
}
