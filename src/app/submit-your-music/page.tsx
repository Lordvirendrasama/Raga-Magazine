// src/app/submit-your-music/page.tsx
import { SubmitMusicForm } from "@/components/submit-music-form";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function SubmitMusicPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-12 lg:py-20">
        
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-headline text-5xl font-bold tracking-tight md:text-6xl">
            🎵 Submit Your Music to Raga
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Got a new track, EP, or video? We love discovering fresh sounds. Fill out the form below or email us your press kit.
          </p>
        </div>
        
        {/* Section 1: Quick Submission Form */}
        <SubmitMusicForm />

        {/* Divider */}
        <div className="my-16 flex items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-muted-foreground text-sm">
            Prefer to send your full press kit or EPK?
          </span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Section 2: Email Submission Option */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Submit via Email</CardTitle>
            <CardDescription>
              For labels, PR agencies, or detailed submissions, send us your materials directly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">
              Include your artist bio, streaming links, high-resolution press photos, and the official release date.
            </p>
            <Button asChild className="w-full md:w-auto">
              <Link href="mailto:submissions@ragamagazine.in">
                <Mail className="mr-2 h-4 w-4" />
                submissions@ragamagazine.in
              </Link>
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}