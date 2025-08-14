import Image from 'next/image';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const cardVariants = cva(
  'group relative flex flex-col overflow-hidden rounded-lg bg-card text-card-foreground shadow-md transition-shadow hover:shadow-xl',
  {
    variants: {
      variant: {
        default: 'flex-col',
        featured: 'col-span-1 md:col-span-2 lg:row-span-2 flex-col',
        compact: 'flex-row items-center',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const imageContainerVariants = cva(
  'relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'aspect-video',
        featured: 'aspect-video',
        compact: 'w-1/3 aspect-square flex-shrink-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const contentVariants = cva(
  'flex flex-col',
  {
    variants: {
      variant: {
        default: 'p-4',
        featured: 'p-6',
        compact: 'p-4 w-2/3',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  imageUrl: string;
  imageHint?: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  date: string;
  excerpt: string;
  tags: string[];
  views: number;
}

interface ArticleCardProps extends VariantProps<typeof cardVariants> {
  post: Post;
  className?: string;
}

export function ArticleCard({ post, variant, className }: ArticleCardProps) {
  return (
    <article className={cn(cardVariants({ variant }), className)}>
      <Link href={`/posts/${post.slug}`} className="absolute inset-0 z-10" aria-label={post.title} />
      <div className={cn(imageContainerVariants({ variant }))}>
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          data-ai-hint={post.imageHint}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className={cn(contentVariants({ variant }), 'flex-grow')}>
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary">{post.category}</Badge>
        </div>
        <h3 className={cn('font-headline text-lg font-bold leading-tight', variant === 'featured' && 'text-2xl md:text-3xl', variant === 'compact' ? 'text-base' : 'text-xl')}>
          <span className="bg-gradient-to-r from-accent/90 to-accent bg-bottom bg-no-repeat bg-[length:0%_2px] transition-[background-size] duration-500 group-hover:bg-[length:100%_2px] z-20 relative">
            {post.title}
          </span>
        </h3>
        {variant !== 'compact' && (
          <p className="mt-2 text-sm text-muted-foreground flex-grow" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        )}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{post.author.name}</span>
          <span>&middot;</span>
          <time dateTime={post.date}>{format(new Date(post.date), 'MMM d, yyyy')}</time>
        </div>
      </div>
    </article>
  );
}
