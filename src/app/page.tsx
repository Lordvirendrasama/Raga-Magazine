import { Header } from "@/components/header";
import { HeroCarousel } from "@/components/hero-carousel";
import { MagazineGrid } from "@/components/magazine-grid";
import { SidebarTopStories } from "@/components/sidebar-top-stories";
import { Footer } from "@/components/footer";
import { mockPosts } from "@/data/posts";

export default function Home() {
  const featuredPosts = mockPosts.filter(p => p.tags.includes('featured')).slice(0, 3);
  const magazinePosts = mockPosts.filter(p => p.tags.includes('magazine'));
  const trendingPosts = mockPosts.sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroCarousel posts={featuredPosts} />
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
