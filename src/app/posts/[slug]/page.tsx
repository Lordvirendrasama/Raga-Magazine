import { getPostBySlug, getFeaturedImage } from '@/lib/wp';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const title = post.title.rendered;
  const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '');

  return {
    title: `${title} | RagaMagazine`,
    description: excerpt,
    openGraph: {
      title: title,
      description: excerpt,
      images: [
        {
          url: getFeaturedImage(post),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}


export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const category = post._embedded?.['wp:term']?.[0]?.find((term: any) => term.taxonomy === 'category')?.name || 'Uncategorized';
  const authorName = post._embedded?.author?.[0]?.name || 'RagaMagazine Staff';
  const authorAvatar = post._embedded?.author?.[0]?.avatar_urls?.['96'] || 'https://placehold.co/40x40';
  const featuredImageUrl = getFeaturedImage(post);
  const tags = post._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name) || [];

  return (
    <article>
      <header className="relative h-[60vh] min-h-[400px] w-full">
        <Image
          src={featuredImageUrl}
          alt={post.title.rendered}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-12">
          <div className="container mx-auto">
            <Badge variant="default">{category}</Badge>
            <h1 className="mt-4 font-headline text-3xl font-bold text-white shadow-2xl md:text-5xl lg:text-6xl max-w-4xl" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            <div className="mt-4 flex items-center gap-4">
              <Avatar>
                <AvatarImage src={authorAvatar} alt={authorName} />
                <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-white">{authorName}</p>
                <p className="text-sm text-gray-300">
                  <time dateTime={post.date_gmt}>{format(new Date(post.date_gmt), 'MMMM d, yyyy')}</time>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-8 lg:py-16">
        <div 
          className="prose prose-lg dark:prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed prose-headings:font-headline prose-a:text-accent hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }} 
        />

        {tags.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h3 className="text-lg font-semibold">Tags</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
