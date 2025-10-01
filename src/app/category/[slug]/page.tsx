import { getPosts, getCategoryBySlug, transformPost } from '@/lib/wp';
import { notFound } from 'next/navigation';
import { ArticleCard, type Post } from '@/components/article-card';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
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
  } catch (error) {
    console.error(`Failed to generate metadata for category ${params.slug}:`, error);
    return {
      title: 'Category | RagaMagazine',
      description: 'An error occurred while fetching category details.',
    };
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const posts = await getPosts({ categories: category.id, per_page: 12 });
  
  const transformedPosts: Post[] = Array.isArray(posts) ? posts.map(transformPost) : [];

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        Category: {category.name}
      </h1>
      {posts.length === 0 ? (
         <p className="text-center text-destructive">Could not load posts. Please try again later.</p>
      ) : transformedPosts.length > 0 ? (
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
