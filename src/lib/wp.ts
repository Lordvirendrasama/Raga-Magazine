// @/lib/wp.ts
const BASE_URL = 'https://ragamagazine.com/wp-json';

// Generic fetch function with error handling
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  // Use the full URL if provided, otherwise prepend BASE_URL
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const defaultOptions: RequestInit = {
    next: { revalidate: 300 }, // Revalidate every 5 minutes
  };
  const res = await fetch(url, { ...defaultOptions, ...options });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Fetches a list of posts from the WordPress REST API.
 * @param params - Optional query parameters.
 * @param postType - The type of post to fetch (e.g., 'posts', 'event').
 */
export async function getPosts(params: Record<string, any> = {}, postType: string = 'posts') {
  const isEventsCalendar = postType === 'event';
  const apiPath = isEventsCalendar ? '/tribe/events/v1/events' : `/wp/v2/${postType}`;
  
  const query = new URLSearchParams({
    per_page: '12',
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });

  if (!isEventsCalendar) {
    query.set('_embed', '1');
  } else {
    // The Events Calendar uses different parameter names
    query.set('status', 'publish');
  }

  const result = await fetchAPI(`${apiPath}?${query.toString()}`);
  
  // The Events Calendar nests posts under an 'events' key
  return isEventsCalendar ? result.events : result;
}


/**
 * Fetches a single post by its slug.
 * @param slug - The slug of the post.
 */
export async function getPostBySlug(slug: string) {
  const posts = await getPosts({ slug, _embed: '1' }, 'posts');
  if (!posts || posts.length === 0) {
    return null;
  }
  return posts[0];
}

/**
 * Fetches a single event by its slug from The Events Calendar API.
 * @param slug - The slug of the event.
 */
export async function getEventBySlug(slug: string) {
  // The Events Calendar API for a single post is typically /tribe/events/v1/events/by-slug/:slug
  const result = await fetchAPI(`/tribe/events/v1/events/by-slug/${slug}`);
  return result;
}

/**
 * Fetches all categories.
 */
export async function getCategories() {
  return fetchAPI('/wp/v2/categories');
}

/**
 * Fetches a category by its slug.
 * @param slug - The slug of the category.
 */
export async function getCategoryBySlug(slug: string) {
    const categories = await fetchAPI(`/wp/v2/categories?slug=${slug}`);
    if (!categories || categories.length === 0) {
        return null;
    }
    return categories[0];
}


/**
 * Fetches all tags.
 */
export async function getTags() {
  return fetchAPI('/wp/v2/tags');
}

/**
 * Extracts the featured image URL from a post object.
 * @param post - The post object from the WP API.
 * @returns The URL of the featured image or a placeholder.
 */
export function getFeaturedImage(post: any): string {
  // Handle The Events Calendar image format
  if (post?.image?.url) {
    return post.image.url;
  }
  
  const featuredMedia = post?._embedded?.['wp:featuredmedia'];
  if (featuredMedia && featuredMedia[0]?.source_url) {
    return featuredMedia[0].source_url;
  }
  return 'https://placehold.co/800x450'; // Fallback placeholder
}
