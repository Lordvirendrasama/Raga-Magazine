
// @/lib/wp.ts
import { decode } from 'html-entities';
import type { Post } from '@/components/article-card';
import placeholderImages from '@/app/lib/placeholder-images.json';

const BASE_URL = 'https://darkgrey-gazelle-504232.hostingersite.com/wp-json';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  try {
    const res = await fetch(url, { cache: 'no-store', ...options });

    if (!res.ok) {
      console.error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
      return null;
    }
    const text = await res.text();
    if (!text) {
        return null;
    }
    return JSON.parse(text);
  } catch (error: any) {
    console.error(`Network error fetching ${url}:`, error.message);
    return null;
  }
}

export async function getPosts(params: Record<string, any> = {}, postType: string = 'posts'): Promise<Post[]> {
  const isEventsCalendar = postType === 'event';
  const apiPath = isEventsCalendar ? '/tribe/events/v1/events' : '/wp/v2/posts';
  
  const defaultParams: Record<string, string> = {
    per_page: '12',
    _embed: '1'
  };

  if (isEventsCalendar) {
    delete defaultParams['_embed']; // Events API doesn't use _embed
    defaultParams['status'] = 'publish';
  }

  const query = new URLSearchParams({
    ...defaultParams,
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });

  const result = await fetchAPI(`${apiPath}?${query.toString()}`);
  
  if (!result) {
    return [];
  }

  const postsData = isEventsCalendar ? result.events : result;
  if (!Array.isArray(postsData)) {
    return [];
  }

  return postsData.map(transformPost).filter(p => p !== null) as Post[];
}

export async function getPostBySlug(slug: string) {
    const data = await fetchAPI(`/wp/v2/posts?slug=${slug}&_embed=1`);
    if (data && data.length > 0) {
        return data[0];
    }
    return null;
}

export async function getEventBySlug(slug: string) {
  const result = await fetchAPI(`/tribe/events/v1/events/by-slug/${slug}`);
  if (result) {
    // The events endpoint doesn't support _embed, so we need to process it.
    // The result from by-slug is a single object, not an array.
    return result;
  }
  return null;
}

export async function getCategories() {
  const result = await fetchAPI('/wp/v2/categories?per_page=50');
  if (Array.isArray(result)) {
    return result;
  }
  return [];
}

export async function getCategoryBySlug(slug:string) {
    const categories = await getCategories();
    return categories.find((cat: any) => cat.slug === slug) || null;
}

export async function getTags() {
  const result = await fetchAPI('/wp/v2/tags');
  return Array.isArray(result) ? result : [];
}

export function getFeaturedImage(post: any): { url: string; hint?: string } {
    const defaultImage = placeholderImages.images[0] || { url: 'https://picsum.photos/seed/1/1200/800', hint: 'abstract music' };

    if (!post) {
      return defaultImage;
    }
    
    // 1. Check for event image (from /tribe/events/v1/events)
    if (post.image && post.image.url) {
        return { url: post.image.url, hint: post.slug };
    }

    // 2. Check for standard embedded featured media (from /wp/v2/posts)
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    if (featuredMedia && featuredMedia.source_url) {
        return { url: featuredMedia.source_url, hint: post.slug };
    }
    
    // 3. Fallback to placeholder if no image is found, using post ID for variety
    if (post.id) {
        const index = post.id % placeholderImages.images.length;
        return placeholderImages.images[index] || defaultImage;
    }

    // 4. Ultimate fallback
    return defaultImage;
}

export function transformPost(wpPost: any): Post | null {
  if (!wpPost || !wpPost.id) {
    return null;
  }

  const isEvent = wpPost?.type === 'tribe_events' || wpPost?.hasOwnProperty('start_date');

  const title = decode(wpPost?.title?.rendered || wpPost?.title || 'Untitled');
  const excerpt = decode((wpPost?.excerpt?.rendered || wpPost?.description || '').replace(/<[^>]+>/g, ''));
  
  let category = 'Uncategorized';
  if (isEvent && wpPost?.categories?.[0]?.name) {
    category = wpPost.categories[0].name;
  } else {
    const terms = wpPost?._embedded?.['wp:term']?.[0];
    if (terms && Array.isArray(terms) && terms.length > 0) {
        const categoryTerm = terms.find((term: any) => term.taxonomy === 'category');
        if (categoryTerm) {
          category = categoryTerm.name;
        }
    }
  }

  const slug = wpPost.slug || '';
  
  const authorName = wpPost?._embedded?.author?.[0]?.name || wpPost?.author?.display_name || 'RagaMagazine Staff';
  const authorAvatar = wpPost?._embedded?.author?.[0]?.avatar_urls?.['96'] || 'https://secure.gravatar.com/avatar/?s=96&d=mm&r=g';

  const wpTags = wpPost?._embedded?.['wp:term']?.[1] || wpPost?.tags || [];
  const tags = Array.isArray(wpTags) ? wpTags.map((tag: any) => tag.name) : [];

  const { url: imageUrl, hint: imageHint } = getFeaturedImage(wpPost);

  return {
    id: wpPost.id,
    title,
    slug,
    category,
    imageUrl,
    imageHint,
    author: {
      name: authorName,
      avatarUrl: authorAvatar,
    },
    date: wpPost.date_gmt || wpPost.start_date,
    excerpt,
    tags,
    views: 0,
    isEvent,
  };
}
