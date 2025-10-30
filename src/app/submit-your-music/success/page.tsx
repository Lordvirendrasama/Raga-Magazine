import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function SubmissionSuccessPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 lg:py-16 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        Submission Received!
      </h1>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
        Thank you for sending us your music. We listen to everything we receive and will be in touch if it's a good fit for RagaMagazine.
      </p>
      <Button asChild>
        <Link href="/">Return to Homepage</Link>
      </Button>
    </div>
  );
}
