
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from './ui/card';
import { Label } from '@/components/ui/label';

export function SubmitMusicForm() {
  return (
    <Card>
      <CardContent className="p-6">
        <form
          name="music-submissions"
          method="POST"
          data-netlify="true"
          className="space-y-6"
        >
          <input type="hidden" name="form-name" value="music-submissions" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Artist/Project Name</Label>
              <Input id="name" name="name" placeholder="e.g., The Midnight Bloom" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select name="genre" required>
                <SelectTrigger id="genre">
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pop">Pop</SelectItem>
                  <SelectItem value="Rock">Rock</SelectItem>
                  <SelectItem value="Indie">Indie</SelectItem>
                  <SelectItem value="Electronic">Electronic</SelectItem>
                  <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
                  <SelectItem value="Classical">Classical</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="streamingLink">Streaming Link (Spotify, Apple Music, YouTube, etc.)</Label>
            <Input id="streamingLink" name="streamingLink" type="url" placeholder="https://..." required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Short Artist Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself and your music..."
              className="resize-y"
              required
              minLength={10}
              maxLength={500}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Handle (Optional)</Label>
              <Input id="instagram" name="instagram" placeholder="@yourhandle" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
          </div>
          
          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <Checkbox id="agreement" name="agreement" required />
            <div className="space-y-1 leading-none">
              <Label htmlFor="agreement">
                I agree to be featured on Raga Magazine and its social platforms.
              </Label>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Send My Music
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
