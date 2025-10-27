
import React from 'react';
import { use } from 'react';
import PostClientPage from './post-client-page';

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <PostClientPage slug={slug} />;
}
