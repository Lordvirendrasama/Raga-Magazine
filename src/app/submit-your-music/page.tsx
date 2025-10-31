
import { SubmitMusicForm } from '@/components/submit-music-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
          Got a new track, EP, or video? We love discovering fresh sounds. Fill out the form below or email us your press kit.
        </p>
      </div>

      <SubmitMusicForm />

      <div className="my-12 flex items-center">
        <Separator className="flex-1" />
        <span className="mx-4 text-sm text-muted-foreground">Or, prefer to send your full press kit?</span>
        <Separator className="flex-1" />
      </div>

      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-primary" />
            Submit via Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            For labels, PR agencies, or detailed submissions, send us your materials directly.
          </p>
          <Link
            href="mailto:theragamagazine@gmail.com"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            theragamagazine@gmail.com
          </Link>
          <p className="mt-2 text-xs text-muted-foreground">
            Please include your artist bio, streaming links, high-resolution press photos, and the official release date.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
