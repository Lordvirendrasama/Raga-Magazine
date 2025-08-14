// src/app/gallery/page.tsx
import { getPosts, getFeaturedImage } from '@/lib/wp';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { GalleryClient } from './gallery-client';
import type { Post } from '@/components/article-card';
import { notFound } from 'next/navigation';

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
    fullContent: wpPost.content.rendered, // Adding full content
    tags: wpPost._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name) || [],
    views: 0,
  };
}

export const metadata = {
  title: 'Latest Article | RagaMagazine',
  description: 'A 360-degree virtual showcase of our latest featured article.',
};

export default async function GalleryPage() {
  const latestPosts = await getPosts({ per_page: 1 });
  
  if (!latestPosts || latestPosts.length === 0) {
    notFound();
  }

  const latestPost = transformPost(latestPosts[0]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <GalleryClient post={latestPost} />
      </main>
      <Footer />
    </div>
  );
}
