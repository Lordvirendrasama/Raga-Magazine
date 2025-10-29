
import { SubmitMusicForm } from "@/components/submit-music-form";

export default function SubmitMusicPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 lg:py-12">
      <div className="mb-8 text-center md:mb-12">
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Submit Your Music
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Have a track, album, or music video you want us to hear? Fill out the form below for a chance to be featured on RagaMagazine.
        </p>
      </div>
      <SubmitMusicForm />
    </div>
  );
}
