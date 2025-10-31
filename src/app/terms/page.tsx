
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 lg:py-12">
      <div className="mb-8 text-center md:mb-12">
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Terms of Service
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6 md:p-8">
          <section>
            <h2 className="font-headline text-2xl font-semibold mb-2">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to RagaMagazine ("we," "our," "us"). These Terms of Service ("Terms") govern your use of our website located at this domain (the "Service"). By accessing or using the Service, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-semibold mb-2">2. Use of Our Service</h2>
            <p className="text-muted-foreground">
              You agree to use our Service only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Service. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our Service.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-semibold mb-2">3. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The Service and its original content, features, and functionality are and will remain the exclusive property of RagaMagazine and its licensors. Our content is protected by copyright, trademark, and other laws of both foreign and domestic countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of RagaMagazine.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-semibold mb-2">4. Links To Other Web Sites</h2>
            <p className="text-muted-foreground">
                Our Service may contain links to third-party web sites or services that are not owned or controlled by RagaMagazine. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-semibold mb-2">5. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-semibold mb-2">6. Disclaimer</h2>
            <p className="text-muted-foreground">
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-semibold mb-2">7. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which RagaMagazine is based, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-semibold mb-2">8. Changes to These Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect.
            </p>
          </section>

           <section>
            <h2 className="font-headline text-2xl font-semibold mb-2">9. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms, please contact us at contact@ragamagazine.in.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
