
'use client';

import { ArticleCard, type Post } from './article-card';

interface RelatedArticlesProps {
  posts: Post[];
}

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-6 font-headline text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        Related Stories
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} variant="default" />
        ))}
      </div>
    </section>
  );
}
