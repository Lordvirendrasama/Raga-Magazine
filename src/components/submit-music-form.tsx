
'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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

// Note: react-hook-form is temporarily disabled for basic HTML submission
// to ensure Formspree activation works correctly. We can re-enable it later.

export function SubmitMusicForm() {
  return (
    <Card>
      <CardContent className="p-6">
        <form
          action="https://formspree.io/f/mqkrvadv"
          method="POST"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <FormLabel htmlFor="name">Artist/Project Name</FormLabel>
              <Input id="name" name="name" placeholder="e.g., The Midnight Bloom" required />
            </div>
            <div>
              <FormLabel htmlFor="genre">Genre</FormLabel>
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

          <div>
            <FormLabel htmlFor="streamingLink">Streaming Link (Spotify, Apple Music, YouTube, etc.)</FormLabel>
            <Input id="streamingLink" name="streamingLink" type="url" placeholder="https://..." required />
          </div>

          <div>
            <FormLabel htmlFor="bio">Short Artist Bio</FormLabel>
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
            <div>
              <FormLabel htmlFor="instagram">Instagram Handle (Optional)</FormLabel>
              <Input id="instagram" name="instagram" placeholder="@yourhandle" />
            </div>
            <div>
              <FormLabel htmlFor="email">Contact Email</FormLabel>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
          </div>
          
          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <Checkbox id="agreement" name="agreement" required />
            <div className="space-y-1 leading-none">
              <FormLabel htmlFor="agreement">
                I agree to be featured on Raga Magazine and its social platforms.
              </FormLabel>
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
