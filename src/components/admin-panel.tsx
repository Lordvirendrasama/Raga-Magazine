'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function AdminPanel() {
  const { toast } = useToast();
  const [spotifyUrl, setSpotifyUrl] = useState('https://open.spotify.com/embed/playlist/3uyM6sSqMepnevczhOfxUT?utm_source=generator&theme=0');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would save this to a database or a configuration file.
    // For now, we'll just show a toast notification.
    toast({
      title: 'Settings Saved!',
      description: 'Your new Spotify playlist URL has been saved (simulation).',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sidebar Settings</CardTitle>
        <CardDescription>
          Update the content displayed in the sidebar across the site.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSave}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spotify-url">Spotify Playlist URL</Label>
              <Input
                id="spotify-url"
                placeholder="Enter Spotify embed URL"
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
              />
               <p className="text-sm text-muted-foreground">
                This will update the Spotify playlist widget in the sidebar. You can get the embed URL from Spotify by clicking "Share" on a playlist and selecting "Embed playlist".
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
