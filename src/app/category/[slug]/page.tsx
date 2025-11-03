
import React from 'react';
import { use } from 'react';
import CategoryClientPage from './category-client-page';
import { getCategoryBySlug, transformPost } from '@/lib/wp';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The category you are looking for could not be found.',
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `Category: ${category.name} | RagaMagazine`,
    description: category.description || `Explore articles in the ${category.name} category on RagaMagazine.`,
    openGraph: {
        title: `Category: ${category.name}`,
        description: category.description || `Explore articles in the ${category.name} category.`,
        images: [...previousImages],
    },
  }
}


export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CategoryClientPage slug={slug} />;
}
