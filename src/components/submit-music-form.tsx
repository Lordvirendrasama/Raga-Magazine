
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { useEffect, useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Artist name must be at least 2 characters.' }),
  genre: z.enum(['Pop', 'Rock', 'Indie', 'Electronic', 'Hip-Hop', 'Classical', 'Other']),
  streamingLink: z.string().url({ message: 'Please enter a valid URL.' }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters.' }).max(500, { message: 'Bio cannot exceed 500 characters.' }),
  instagram: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  agreement: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms to submit.',
  }),
});

export function SubmitMusicForm() {
    const [redirectUrl, setRedirectUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setRedirectUrl(window.location.href);
        }
    }, []);
    
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      streamingLink: '',
      bio: '',
      instagram: '',
      email: '',
      agreement: false,
    },
  });

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form
            action="https://formsubmit.co/theragamagazine@gmail.com"
            method="POST"
            className="space-y-6"
          >
            {/* FormSubmit.co hidden fields */}
            <input type="hidden" name="_subject" value={`New Music Submission: ${form.watch('name')}`} />
            <input type="hidden" name="_next" value={redirectUrl} />
            <input type="text" name="_honey" style={{ display: 'none' }} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist/Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Midnight Bloom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a genre" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="streamingLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Streaming Link (Spotify, Apple Music, YouTube, etc.)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Artist Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself and your music..."
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram Handle (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="@yourhandle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="agreement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to be featured on Raga Magazine and its social platforms.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" size="lg">
              Send My Music
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
