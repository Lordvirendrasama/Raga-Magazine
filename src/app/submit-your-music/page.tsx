
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Music } from 'lucide-react';
import Link from 'next/link';

export default function SubmitMusicPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 lg:py-12">
      <div className="mb-8 text-center md:mb-12">
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl flex items-center justify-center gap-4">
          <Music className="h-10 w-10 text-primary" />
          Submit Your Music to Raga
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Got a new track, EP, or video? We love discovering fresh sounds. The best way to reach us is by email.
        </p>
      </div>

      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-3">
            <Mail className="h-6 w-6 text-primary" />
            Submit via Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            For labels, PR agencies, or detailed submissions, send us your materials directly.
            Please include your artist bio, streaming links, high-resolution press photos, and the official release date.
          </p>
          <Button asChild size="lg">
            <Link
              href="mailto:theragamagazine@gmail.com"
            >
              <Mail className="mr-2 h-5 w-5" /> Open Email Client
            </Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
             theragamagazine@gmail.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
