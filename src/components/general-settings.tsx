
'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Globe, Headphones } from 'lucide-react';

export function GeneralSettings() {
  const { toast } = useToast();

  // State for existing settings
  const [spotifyUrl, setSpotifyUrl] = useState(
    'https://open.spotify.com/embed/playlist/3uyM6sSqMepnevczhOfxUT?utm_source=generator&theme=0'
  );

  // State for new SEO settings
  const [siteTitle, setSiteTitle] = useState('RagaMagazine');
  const [siteDescription, setSiteDescription] = useState('The future of reading is here.');
  const [metaKeywords, setMetaKeywords] = useState('music, magazine, articles, indie, rock, pop, electronic, hip-hop');


  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would save this to a database or a configuration file.
    // For now, we'll just show a toast notification.
    toast({
      title: 'Settings Saved!',
      description: 'Your new settings have been saved (simulation).',
    });
  };

  return (
    <form onSubmit={handleSave}>
        <div className="space-y-8">
        {/* Sidebar Settings */}
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Sidebar Settings</h3>
            </div>
            <div className="space-y-2">
            <Label htmlFor="spotify-url">Spotify Playlist URL</Label>
            <Input
                id="spotify-url"
                placeholder="Enter Spotify embed URL"
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
                This updates the Spotify playlist widget in the sidebar. Get
                the embed URL from Spotify by clicking "Share" on a playlist
                and selecting "Embed playlist".
            </p>
            </div>
        </div>

        <Separator />

        {/* SEO Settings */}
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">SEO & Metadata</h3>
            </div>
            <div className="space-y-2">
            <Label htmlFor="site-title">Site Title</Label>
            <Input
                id="site-title"
                placeholder="Your website's main title"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
            />
            </div>
            <div className="space-y-2">
            <Label htmlFor="site-description">Meta Description</Label>
            <Textarea
                id="site-description"
                placeholder="A short description of your website for search engines."
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
            />
            </div>
            <div className="space-y-2">
            <Label htmlFor="meta-keywords">Meta Keywords</Label>
            <Input
                id="meta-keywords"
                placeholder="e.g., music, news, reviews, indie"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
                Comma-separated keywords for search engines.
            </p>
            </div>
        </div>
        </div>
      <CardFooter className="mt-8 px-0">
        <Button type="submit">Save All Changes</Button>
      </CardFooter>
    </form>
  );
}
