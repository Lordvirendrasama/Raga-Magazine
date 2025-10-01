
// @/lib/wp.ts
import { decode } from 'html-entities';
import type { Post } from '@/components/article-card';
import placeholderImages from '@/app/lib/placeholder-images.json';


const BASE_URL = 'https://ragamagazine.com/wp-json';

// Generic fetch function with robust error handling
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  try {
    const res = await fetch(url, { cache: 'no-store', ...options });

    if (!res.ok) {
      // Don't log the error here, let the caller handle it.
      return null;
    }
    // Check for empty response body before parsing JSON
    const text = await res.text();
    if (!text) {
        return null;
    }
    return JSON.parse(text);
  } catch (error: any) {
    // This will catch network errors (e.g., "fetch failed")
    console.error(`Network error fetching ${url}:`, error.message);
    return null;
  }
}

/**
 * Fetches a list of posts from the WordPress REST API.
 * @param params - Optional query parameters.
 * @param postType - The type of post to fetch (e.g., 'posts', 'event').
 */
export async function getPosts(params: Record<string, any> = {}, postType: string = 'posts') {
  const isEventsCalendar = postType === 'event';
  const apiPath = isEventsCalendar ? '/tribe/events/v1/events' : '/wp/v2/posts';
  
  const defaultParams: Record<string, string> = {
    per_page: '12',
  };

  if (!isEventsCalendar) {
    defaultParams['_embed'] = '1';
  } else {
    defaultParams['status'] = 'publish';
  }

  const query = new URLSearchParams({
    ...defaultParams,
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });

  const result = await fetchAPI(`${apiPath}?${query.toString()}`);
  
  if (!result) {
    return []; // Return an empty array on fetch failure
  }

  const posts = isEventsCalendar ? result.events : result;
  return Array.isArray(posts) ? posts : [];
}


/**
 * Fetches a single post by its slug.
 * @param slug - The slug of the post.
 */
export async function getPostBySlug(slug: string) {
  const posts = await getPosts({ slug, per_page: 1 });
  return posts[0] || null;
}


/**
 * Fetches a single event by its slug from The Events Calendar API.
 * @param slug - The slug of the event.
 */
export async function getEventBySlug(slug: string) {
  return await fetchAPI(`/tribe/events/v1/events/by-slug/${slug}`);
}

/**
 * Fetches all categories.
 */
export async function getCategories() {
  const result = await fetchAPI('/wp/v2/categories?per_page=50');
  return Array.isArray(result) ? result : [];
}

/**
 * Fetches a category by its slug.
 */
export async function getCategoryBySlug(slug: string) {
    const categories = await fetchAPI(`/wp/v2/categories?slug=${slug}`);
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return null;
    }
    return categories[0];
}

/**
 * Fetches all tags.
 */
export async function getTags() {
  const result = await fetchAPI('/wp/v2/tags');
  return Array.isArray(result) ? result : [];
}

/**
 * Extracts the featured image URL from a WordPress post object.
 * Provides a fallback to a placeholder if no image is found.
 * @param post - The post object from WordPress.
 * @returns The URL of the featured image or a placeholder.
 */
export function getFeaturedImage(post: any): { url: string; hint?: string } {
    const defaultImage = placeholderImages.images[0] || { url: 'https://picsum.photos/seed/1/1200/800', hint: 'abstract music' };

    if (!post) {
      return defaultImage;
    }

    // For standard posts
    const featuredMedia = post?._embedded?.['wp:featuredmedia']?.[0];
    if (featuredMedia?.source_url) {
        return { url: featuredMedia.source_url, hint: post.slug };
    }

    // For The Events Calendar events
    if (post?.image?.url) {
        return { url: post.image.url, hint: post.slug };
    }
    
    // Fallback to a random placeholder from our list if no image is found
    if (post?.id) {
        const index = post.id % placeholderImages.images.length;
        return placeholderImages.images[index] || defaultImage;
    }

    return defaultImage;
}


/**
 * Transforms a WordPress post object (from REST API) into the app's Post format.
 * This function handles both standard posts and The Events Calendar event posts.
 * @param wpPost - The post object from WordPress.
 * @returns A Post object.
 */
export function transformPost(wpPost: any): Post {
  const isEvent = wpPost?.type === 'tribe_events' || wpPost?.hasOwnProperty('start_date');

  const title = decode(wpPost?.title?.rendered || wpPost?.title || 'Untitled');
  const excerpt = decode((wpPost?.excerpt?.rendered || wpPost?.description || '').replace(/<[^>]+>/g, ''));
  
  let category = 'Uncategorized';
  const terms = wpPost?._embedded?.['wp:term']?.[0];
  if (terms && Array.isArray(terms) && terms.length > 0) {
      const categoryTerm = terms.find((term: any) => term.taxonomy === 'category');
      if (categoryTerm) {
        category = categoryTerm.name;
      }
  } else if (isEvent && wpPost?.categories?.[0]?.name) {
      category = wpPost.categories[0].name;
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
