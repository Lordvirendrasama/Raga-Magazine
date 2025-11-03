
import React from 'react';
import { use } from 'react';
import PostClientPage from './post-client-page';
import { getPostBySlug, transformPost } from '@/lib/wp';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const transformedPost = transformPost(post);

  if (!transformedPost) {
    notFound();
  }
  
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${transformedPost.title} | RagaMagazine`,
    description: transformedPost.excerpt,
    openGraph: {
      title: transformedPost.title,
      description: transformedPost.excerpt,
      images: [
        {
          url: transformedPost.imageUrl,
          width: 1200,
          height: 630,
          alt: transformedPost.title,
        },
        ...previousImages,
      ],
    },
    twitter: {
        card: 'summary_large_image',
        title: transformedPost.title,
        description: transformedPost.excerpt,
        images: [transformedPost.imageUrl],
    }
  }
}


export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <PostClientPage slug={slug} />;
}
