// @/lib/wp.ts
const BASE_URL = 'https://ragamagazine.com/wp-json/wp/v2';

// Generic fetch function with error handling
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
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
  const query = new URLSearchParams({
    per_page: '12',
    _embed: '1',
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  return fetchAPI(`/${postType}?${query.toString()}`);
}

/**
 * Fetches a single post by its slug.
 * @param slug - The slug of the post.
 */
export async function getPostBySlug(slug: string) {
  const posts = await getPosts({ slug, _embed: '1' });
  if (!posts || posts.length === 0) {
    return null;
  }
  return posts[0];
}

/**
 * Fetches all categories.
 */
export async function getCategories() {
  return fetchAPI('/categories');
}

/**
 * Fetches a category by its slug.
 * @param slug - The slug of the category.
 */
export async function getCategoryBySlug(slug: string) {
    const categories = await fetchAPI(`/categories?slug=${slug}`);
    if (!categories || categories.length === 0) {
        return null;
    }
    return categories[0];
}


/**
 * Fetches all tags.
 */
export async function getTags() {
  return fetchAPI('/tags');
}

/**
 * Extracts the featured image URL from a post object.
 * @param post - The post object from the WP API.
 * @returns The URL of the featured image or a placeholder.
 */
export function getFeaturedImage(post: any): string {
  const featuredMedia = post?._embedded?.['wp:featuredmedia'];
  if (featuredMedia && featuredMedia[0]?.source_url) {
    return featuredMedia[0].source_url;
  }
  return 'https://placehold.co/800x450'; // Fallback placeholder
}
