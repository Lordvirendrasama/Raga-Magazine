
'use client';

import { useState, useEffect } from 'react';
import { getPosts, getCategoryBySlug } from '@/lib/wp';
import type { Post } from '@/components/article-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Music4 } from 'lucide-react';
import { decode } from 'html-entities';

interface PlaylistPost extends Post {
  spotifyEmbedUrl?: string;
}

// Function to extract Spotify embed URL from post content
function getSpotifyEmbedUrl(content: string): string | undefined {
  if (!content) return undefined;
  const match = content.match(/<iframe.*?src="(https?:\/\/(?:open|embed)\.spotify\.com\/[^"]+)".*?<\/iframe>/);
  return match ? match[1] : undefined;
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<PlaylistPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlaylists() {
      setLoading(true);
      try {
        // WordPress category slugs are often singular. Let's try 'playlist'
        const playlistCategory = await getCategoryBySlug('playlist');
        
        if (!playlistCategory) {
          console.error("The 'playlist' category was not found in your WordPress site. Please create it and add posts with Spotify embeds to it.");
          setPlaylists([]);
          setLoading(false);
          return;
        }
        
        // Fetch posts from the "playlist" category
        const rawPosts = await getPosts({ categories: playlistCategory.id, per_page: 12 });
        
        const playlistPosts: PlaylistPost[] = rawPosts
          .map(post => {
            // The fullContent should be available now from our updated transformPost
            const spotifyEmbedUrl = getSpotifyEmbedUrl(post.fullContent || '');
            if (spotifyEmbedUrl) {
              return { ...post, spotifyEmbedUrl };
            }
            return null;
          })
          .filter((p): p is PlaylistPost => p !== null);

        setPlaylists(playlistPosts);

      } catch (error) {
        console.error("Failed to fetch playlists:", error);
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaylists();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <Skeleton className="h-12 w-1/3 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-80 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 text-center md:mb-12">
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Curated Playlists
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Handpicked playlists to soundtrack your reading journey. Discover new music and enjoy the classics from our articles.
        </p>
      </div>

      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="group rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-lg">
              <h2 className="flex items-center gap-2 font-headline text-2xl font-bold" dangerouslySetInnerHTML={{ __html: playlist.title }} />
              <p className="mt-2 text-sm text-muted-foreground">{decode(playlist.excerpt)}</p>
              {playlist.spotifyEmbedUrl && (
                <div className="mt-4">
                  <iframe
                    style={{ borderRadius: '12px' }}
                    src={playlist.spotifyEmbedUrl.replace('open.spotify.com', 'embed.spotify.com')}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={`Spotify Embed: ${playlist.title}`}
                  ></iframe>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No playlists found. Check back soon!</p>
      )}
    </div>
  );
}
