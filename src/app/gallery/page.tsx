// src/app/gallery/page.tsx
import { getPosts, getFeaturedImage } from '@/lib/wp';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { GalleryClient } from './gallery-client';
import type { Post } from '@/components/article-card';

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
      avatarUrl: wpPost._embedded?.author?.[0]?.avatar_urls?.['96'] || 'https://placehold.co/96x96',
    },
    date: wpPost.date_gmt,
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]+>/g, ''),
    tags: wpPost._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name) || [],
    views: 0,
  };
}

export const metadata = {
  title: 'Artists\' Gallery | RagaMagazine',
  description: 'A 360-degree virtual gallery showcasing our featured artists.',
};

export default async function GalleryPage() {
  const artistPosts = await getPosts({ per_page: 4 });
  const transformedPosts = artistPosts.map(transformPost);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <GalleryClient artists={transformedPosts} />
      </main>
      <Footer />
    </div>
  );
}
