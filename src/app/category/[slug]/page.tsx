
import React from 'react';
import { use } from 'react';
import CategoryClientPage from './category-client-page';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CategoryClientPage slug={slug} />;
}
