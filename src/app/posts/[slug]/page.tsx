
import { getPostBySlug } from '@/lib/wp';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { decode } from 'html-entities';
import { getFeaturedImage } from '@/lib/wp';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = await getPostBySlug(params.slug);
  } catch (error) {
    console.error(`Failed to generate metadata for post ${params.slug}:`, error);
    return {
      title: 'Error',
      description: 'Could not load post details.',
    };
  }

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const title = decode(post.title.rendered);
  const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '');
  const { url: imageUrl } = getFeaturedImage(post);

  return {
    title: `${title} | RagaMagazine`,
    description: excerpt,
    openGraph: {
      title: title,
      description: excerpt,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  let postData;

  try {
    postData = await getPostBySlug(params.slug);
  } catch (error) {
    console.error(`Failed to fetch post ${params.slug}:`, error);
    // This will be caught by the check below and trigger notFound()
  }

  if (!postData) {
    notFound();
  }
  
  const title = postData.title.rendered;
  const category = postData._embedded?.['wp:term']?.[0]?.find((term: any) => term.taxonomy === 'category')?.name || 'Uncategorized';
  const authorName = postData._embedded?.author?.[0]?.name || 'RagaMagazine Staff';
  const authorAvatar = postData._embedded?.author?.[0]?.avatar_urls?.['96'] || 'https://secure.gravatar.com/avatar/?s=96&d=mm&r=g';
  const { url: featuredImageUrl, hint: imageHint } = getFeaturedImage(postData);
  const tags = postData._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name) || [];
  const dateGmt = postData.date_gmt;
  const content = postData.content.rendered;


  return (
    <article>
      <header className="relative h-[30vh] min-h-[300px] w-full md:h-[50vh]">
        <Image
          src={featuredImageUrl}
          alt={decode(title)}
          fill
          className="object-cover"
          priority
          data-ai-hint={imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 md:p-12">
          <div className="container mx-auto">
            <Badge variant="default">{category}</Badge>
            <h1 className="mt-4 font-headline text-2xl font-bold text-white shadow-2xl md:text-4xl lg:text-5xl max-w-4xl" dangerouslySetInnerHTML={{ __html: title }} />
            <div className="mt-4 flex items-center gap-4">
              <Avatar>
                <AvatarImage src={authorAvatar} alt={authorName} />
                <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-white">{authorName}</p>
                <p className="text-sm text-gray-300">
                  <time dateTime={dateGmt}>{format(new Date(dateGmt), 'MMMM d, yyyy')}</time>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-8 lg:py-16">
        <div 
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: content }} 
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


