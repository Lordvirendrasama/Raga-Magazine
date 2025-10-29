
import { Music4 } from 'lucide-react';

export default function PlaylistsPage() {
  const playlists = [
    {
      id: '37i9dQZF1DXcBWIGoYBM5M',
      title: 'Today\'s Top Hits',
      description: 'The most played tracks in the world right now.',
    },
    {
      id: '37i9dQZF1DWXRqgorJj26U',
      title: 'RapCaviar',
      description: 'The freshest tracks in the hip-hop world.',
    },
    {
      id: '37i9dQZF1DX1lVhptIYRda',
      title: 'Viva Latino',
      description: 'The hottest Latin hits. Updated weekly.',
    },
    {
      id: '3uyM6sSqMepnevczhOfxUT',
      title: 'RagaMagazine Picks',
      description: 'Our special selection of tracks featured in the magazine.',
    },
     {
      id: '37i9dQZF1DX4sWSpwq3LiO',
      title: 'Peaceful Piano',
      description: 'Relax and indulge with beautiful piano pieces.',
    },
    {
      id: '37i9dQZF1DX0XUfTFmNBRM',
      title: 'Rock Classics',
      description: 'Rock legends and epic songs that continue to inspire.',
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8 text-center md:mb-12">
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Curated Playlists
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Handpicked playlists to soundtrack your reading journey. Discover new music and enjoy the classics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="group rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-lg">
            <h2 className="flex items-center gap-2 font-headline text-2xl font-bold">
              <Music4 className="h-6 w-6 text-primary" />
              {playlist.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{playlist.description}</p>
            <div className="mt-4">
              <iframe
                style={{ borderRadius: '12px' }}
                src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0`}
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`Spotify Embed: ${playlist.title}`}
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
