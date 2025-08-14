import { getPosts, getCategoryBySlug, getFeaturedImage } from '@/lib/wp';
import { notFound } from 'next/navigation';
import { ArticleCard, type Post } from '@/components/article-card';

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


export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} | RagaMagazine`,
    description: `Articles in the ${category.name} category.`,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const posts = await getPosts({ categories: category.id, per_page: 12 });
  const transformedPosts = posts.map(transformPost);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        Category: {category.name}
      </h1>
      {transformedPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {transformedPosts.map((post) => (
            <ArticleCard key={post.id} post={post} variant="default" />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No posts found in this category yet.</p>
      )}
    </div>
  );
}
