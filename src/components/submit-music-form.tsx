
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

const formSchema = z.object({
  artistName: z.string().min(2, {
    message: 'Artist name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  musicLink: z.string().url({
    message: 'Please enter a valid URL (e.g., Spotify, Apple Music, YouTube).',
  }),
  message: z.string().optional(),
});

export function SubmitMusicForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artistName: '',
      email: '',
      musicLink: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Submission values:', values);
    toast({
      title: 'Submission Received!',
      description: "Thanks for sending us your music. We'll be in touch if it's a good fit.",
    });
    form.reset();
  }

  return (
    <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Artist Information</CardTitle>
            <CardDescription>
                Tell us about yourself and share a link to your best work.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="artistName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Artist / Band Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your artist or band name" {...field} />
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
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        We'll use this to contact you if we feature your music.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="musicLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link to Your Music</FormLabel>
                      <FormControl>
                        <Input placeholder="https://open.spotify.com/track/..." {...field} />
                      </FormControl>
                      <FormDescription>
                        A link to your track, album, or video (Spotify, YouTube, SoundCloud, etc.).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little about your music, the story behind it, or why you think it's a great fit for RagaMagazine."
                          className="resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full">
                  Submit Music
                </Button>
              </form>
            </Form>
        </CardContent>
    </Card>
  );
}
