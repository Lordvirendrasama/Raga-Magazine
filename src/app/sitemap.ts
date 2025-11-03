import { getPosts } from '@/lib/wp';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://ragamagazine.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts({ per_page: 100 });

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.modified_gmt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/submit-your-music`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
     {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [
    ...staticPages,
    ...postEntries,
  ];
}
