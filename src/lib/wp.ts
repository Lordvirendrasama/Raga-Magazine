// @/lib/wp.ts
import { decode } from 'html-entities';
import type { Post } from '@/components/article-card';
import placeholderImages from '@/app/lib/placeholder-images.json';
import { fallbackPosts } from '@/data/posts';


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
export async function getPosts(params: Record<string, any> = {}, postType: string = 'posts'): Promise<any[]> {
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
    console.warn(`API fetch failed. Falling back to local data.`);
    // If the fetch fails, use the local fallback data.
    // This is a temporary measure to ensure the app runs without network.
    return fallbackPosts;
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
  if (posts.length > 0) {
    return posts[0];
  }
  // If not found via API, check fallback data
  return fallbackPosts.find(p => p.slug === slug) || null;
}


/**
 * Fetches a single event by its slug from The Events Calendar API.
 * @param slug - The slug of the event.
 */
export async function getEventBySlug(slug: string) {
  const result = await fetchAPI(`/tribe/events/v1/events/by-slug/${slug}`);
  if (result) {
    return result;
  }
  return fallbackPosts.find(p => p.isEvent && p.slug === slug) || null;
}

/**
 * Fetches all categories.
 */
export async function getCategories() {
  const result = await fetchAPI('/wp/v2/categories?per_page=50');
  if (Array.isArray(result)) {
    return result;
  }
  // Fallback for categories if API fails
  return [
      { name: 'News', slug: 'news', count: 5 },
      { name: 'Featured', slug: 'featured', count: 2 },
      { name: 'Culture', slug: 'culture', count: 3 }
  ];
}

/**
 * Fetches a category by its slug.
 */
export async function getCategoryBySlug(slug:string) {
    const categories = await getCategories();
    return categories.find((cat: any) => cat.slug === slug) || null;
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
    
    // Check if a placeholder is assigned in the fallback data
    if (post?.placeholderImageId) {
        const image = placeholderImages.images.find(img => img.url.includes(`seed/${post.placeholderImageId}/`));
        return image || defaultImage;
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
  // If the post is already in the correct format (from fallback data), return it.
  if (wpPost && wpPost.author && typeof wpPost.author === 'object') {
    return wpPost as Post;
  }

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
