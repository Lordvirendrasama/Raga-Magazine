// src/components/submit-music-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { createSubmission } from '@/lib/submissions';
import { Loader2 } from 'lucide-react';

const GENRES = ['Pop', 'Rock', 'Indie', 'Electronic', 'Hip-Hop', 'Classical', 'Other'];

const formSchema = z.object({
  artistName: z.string().min(2, 'Artist name must be at least 2 characters.'),
  genre: z.enum(GENRES as [string, ...string[]], {
    required_error: "You need to select a genre.",
  }),
  streamingLink: z.string().url('Please enter a valid URL (e.g., Spotify, Apple Music, YouTube).'),
  bio: z.string().min(10, 'Bio must be at least 10 characters.').max(500, 'Bio cannot exceed 500 characters.'),
  instagramHandle: z.string().optional(),
  contactEmail: z.string().email('Please enter a valid email address.'),
  pressPhoto: z
    .instanceof(File)
    .refine(file => file.size < 5000000, `Max file size is 5MB.`)
    .refine(file => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only .jpg, .png, and .webp formats are supported."
    ),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms to submit.",
  }),
});

export function SubmitMusicForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artistName: '',
      streamingLink: '',
      bio: '',
      instagramHandle: '',
      contactEmail: '',
      agreeToTerms: false,
    },
  });
  
  const fileRef = form.register('pressPhoto');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await createSubmission(values);
      toast({
        title: 'Submission Received!',
        description: "Thanks for sending your music! Our editorial team will review it soon.",
        variant: 'default',
      });
      form.reset();
      router.refresh();
    } catch (error) {
      console.error('Submission failed:', error);
      toast({
        title: 'Submission Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="bg-card border-border shadow-sm">
        <CardHeader>
            <CardTitle className="text-2xl font-headline">Quick Submission</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="artistName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Artist / Project Name</FormLabel>
                        <FormControl>
                          <Input className="rounded-md" placeholder="e.g., The Midnight Bloom" {...field} />
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
                                <SelectTrigger className="rounded-md">
                                <SelectValue placeholder="Select a genre" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {GENRES.map(genre => (
                                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                                ))}
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
                      <FormLabel>Streaming Link</FormLabel>
                      <FormControl>
                        <Input className="rounded-md" placeholder="https://open.spotify.com/track/..." {...field} />
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
                          placeholder="Tell us about your sound, your story, and your influences."
                          className="resize-y rounded-md min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="instagramHandle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram Handle (Optional)</FormLabel>
                          <FormControl>
                            <Input className="rounded-md" placeholder="@your-artist-name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input className="rounded-md" type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>

                <FormField
                  control={form.control}
                  name="pressPhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Press Photo</FormLabel>
                      <FormControl>
                        <Input className="rounded-md file:text-foreground" type="file" {...fileRef} />
                      </FormControl>
                      <FormDescription>
                        A high-quality photo for your feature. Max 5MB.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
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
                
                <Button type="submit" size="lg" className="w-full rounded-md" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Send My Music'
                  )}
                </Button>
              </form>
            </Form>
        </CardContent>
    </Card>
  );
}
