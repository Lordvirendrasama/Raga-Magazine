
// @/lib/wp.ts
import { decode } from 'html-entities';
import type { Post } from '@/components/article-card';
import placeholderImages from '@/app/lib/placeholder-images.json';

const BASE_URL = 'https://darkgrey-gazelle-504232.hostingersite.com/wp-json';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  const res = await fetch(url, {
    ...options,
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });

  if (!res.ok) {
    console.error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    try {
      const errorBody = await res.json();
      console.error('Error body:', errorBody);
    } catch(e) {
       // Ignore if body isn't json
    }
    return null;
  }
  const text = await res.text();
  if (!text) {
      return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse JSON from WP API:', text);
    return null;
  }
}

export async function getPosts(params: Record<string, any> = {}): Promise<any[]> {
  const apiPath = `/wp/v2/posts`;
  
  const defaultParams: Record<string, string> = {
    per_page: params.per_page || '12',
    _embed: '1',
  };

  const query = new URLSearchParams({
    ...defaultParams,
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  
  const result = await fetchAPI(`${apiPath}?${query.toString()}`);
  
  if (!result || !Array.isArray(result)) {
    return [];
  }
  return result;
}

export async function getPostBySlug(slug: string) {
    const rawPosts = await fetchAPI(`/wp/v2/posts?slug=${slug}&_embed=1`);
    if (rawPosts && rawPosts.length > 0) {
        return rawPosts[0];
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
    const result = await fetchAPI(`/wp/v2/categories?slug=${slug}`);
    if (result && Array.isArray(result) && result.length > 0) {
        return result[0];
    }
    return null;
}

export async function getTags() {
  const result = await fetchAPI('/wp/v2/tags?_embed=1');
  return Array.isArray(result) ? result : [];
}

export function getFeaturedImage(post: any): { url: string; hint?: string } {
    const defaultImage = placeholderImages.images[0] || { url: 'https://picsum.photos/seed/1/1200/800', hint: 'abstract music' };

    if (!post) {
      return defaultImage;
    }
    
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
    if (featuredMedia && featuredMedia.source_url) {
        return { url: featuredMedia.source_url, hint: post.slug };
    }
    
    if (post.id) {
        const index = post.id % placeholderImages.images.length;
        return placeholderImages.images[index] || defaultImage;
    }

    return defaultImage;
}

export function transformPost(wpPost: any): Post | null {
  if (!wpPost || !wpPost.id) {
    return null;
  }

  const title = decode(wpPost?.title?.rendered || 'Untitled');
  const excerpt = decode((wpPost?.excerpt?.rendered || '').replace(/<[^>]+>/g, ''));
  
  let category = 'Uncategorized';
  if (wpPost?._embedded?.['wp:term']?.[0]) {
      const terms = wpPost._embedded['wp:term'][0];
      if (terms && Array.isArray(terms) && terms.length > 0) {
          const categoryTerm = terms.find((term: any) => term.taxonomy === 'category' && term.slug !== 'uncategorized');
          category = categoryTerm ? categoryTerm.name : 'Uncategorized';
      }
  }


  const slug = wpPost.slug || '';
  
  const authorName = wpPost?._embedded?.author?.[0]?.name || 'RagaMagazine Staff';
  const authorAvatar = wpPost?._embedded?.author?.[0]?.avatar_urls?.['96'] || 'https://secure.gravatar.com/avatar/?s=96&d=mm&r=g';

  let tags: string[] = [];
  if (wpPost?._embedded?.['wp:term']?.[1]) {
      const wpTags = wpPost._embedded['wp:term'][1] || [];
      if (Array.isArray(wpTags)) {
        tags = wpTags.map((tag: any) => tag.name);
      }
  }
  
  if (wpPost.tags?.nodes) { // Handle GraphQL-like tag structure if present
      tags = wpPost.tags.nodes.map((tag: any) => tag.name);
  }

  const { url: imageUrl, hint: imageHint } = getFeaturedImage(wpPost);
  
  const fullContent = wpPost?.content?.rendered || '';

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
    date: wpPost.date_gmt,
    excerpt,
    tags,
    views: 0,
    fullContent,
  };
}
