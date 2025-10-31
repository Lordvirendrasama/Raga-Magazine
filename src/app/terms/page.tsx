
'use client';

import { Card, CardContent } from '@/components/ui/card';

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
            <h2 className="font-headline text-2xl font-semibold mb-4">1. Use of the Service</h2>
            <div className="space-y-2 text-muted-foreground">
              <h3 className="font-semibold text-foreground">1.1 Eligibility</h3>
              <p>You must be at least 13 years old to use Raga Magazine. By using the Service, you represent that you are legally capable of entering into these Terms.</p>
              
              <h3 className="font-semibold text-foreground pt-2">1.2 Account Creation</h3>
              <p>Users may create personal accounts to track reading history, maintain streaks, and engage with community features. You are responsible for safeguarding your login credentials and for all activities under your account.</p>

              <h3 className="font-semibold text-foreground pt-2">1.3 Permitted Use</h3>
              <p>You agree to use the Service only for lawful purposes and in compliance with all applicable laws and regulations. You must not:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Copy, distribute, or modify our content without permission.</li>
                <li>Attempt to hack, reverse-engineer, or disrupt our Service.</li>
                <li>Post or submit unlawful, defamatory, or infringing content.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-semibold mb-4">2. Intellectual Property</h2>
            <div className="space-y-2 text-muted-foreground">
              <h3 className="font-semibold text-foreground">2.1 Ownership</h3>
              <p>All content on Raga Magazine, including text, design, graphics, logos, and other materials, is owned by or licensed to The 8 Bit Bistro and protected under applicable copyright and trademark laws.</p>
              
              <h3 className="font-semibold text-foreground pt-2">2.2 User License</h3>
              <p>You are granted a limited, non-exclusive, and non-transferable right to access and use the site for personal, non-commercial purposes.</p>

              <h3 className="font-semibold text-foreground pt-2">2.3 Content Usage</h3>
              <p>You may share articles via social media or hyperlinks, provided you credit Raga Magazine and do not alter or monetize our content.</p>
            </div>
          </section>
          
          <section>
            <h2 className="font-headline text-2xl font-semibold mb-4">3. User-Generated Content</h2>
             <div className="space-y-2 text-muted-foreground">
                <h3 className="font-semibold text-foreground">3.1 Submissions</h3>
                <p>Users may submit songs, event listings, articles, or other creative content (“User Submissions”). By submitting content, you grant us a worldwide, royalty-free, non-exclusive license to use, display, reproduce, and distribute it on Raga Magazine and its associated platforms.</p>
                
                <h3 className="font-semibold text-foreground pt-2">3.2 Your Responsibility</h3>
                <p>You represent that your submission is your original work and that you have the right to grant this license. Raga Magazine is not responsible for user-submitted content and reserves the right to remove any content that violates these Terms or applicable law.</p>

                <h3 className="font-semibold text-foreground pt-2">3.3 Editorial Rights</h3>
                <p>We may edit or adapt User Submissions for clarity, formatting, or compliance with editorial guidelines.</p>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-semibold mb-4">4. Advertisements and Sponsorships</h2>
            <div className="space-y-2 text-muted-foreground">
                <h3 className="font-semibold text-foreground">4.1 Ads</h3>
                <p>Raga Magazine may display advertisements, affiliate links, or sponsored content. Some links may generate revenue or commissions for us.</p>
                
                <h3 className="font-semibold text-foreground pt-2">4.2 Transparency</h3>
                <p>Sponsored posts or branded content will be clearly marked as such. We do not endorse third-party products unless explicitly stated.</p>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-semibold mb-2">5. Account Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to suspend or terminate your account without notice if you violate these Terms or engage in conduct that may harm Raga Magazine or other users.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-semibold mb-4">6. Disclaimers</h2>
            <div className="space-y-2 text-muted-foreground">
                <h3 className="font-semibold text-foreground">6.1 No Warranty</h3>
                <p>All content is provided for informational and entertainment purposes only. We do not guarantee accuracy, reliability, or completeness.</p>
                
                <h3 className="font-semibold text-foreground pt-2">6.2 Limitation of Liability</h3>
                <p>To the fullest extent permitted by law, The 8 Bit Bistro and its affiliates are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
            </div>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-semibold mb-2">7. Governing Law</h2>
            <p className="text-muted-foreground">
             These Terms are governed by and construed in accordance with the laws of India, specifically under the jurisdiction of the courts of Maharashtra.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-2xl font-semibold mb-2">8. Modifications</h2>
            <p className="text-muted-foreground">
              We may update or revise these Terms from time to time. Continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

           <section>
            <h2 className="font-headline text-2xl font-semibold mb-2">9. Short Privacy Summary</h2>
            <p className="text-muted-foreground">
              Raga Magazine collects minimal user data, such as email addresses, reading activity, and submission history, solely to enhance user experience. We do not sell personal information to third parties. By using Raga Magazine, you consent to our collection and use of data as described. A full Privacy Policy will be provided in the future for transparency and compliance.
            </p>
          </section>

           <section>
            <h2 className="font-headline text-2xl font-semibold mb-2">10. Contact</h2>
            <p className="text-muted-foreground">
              If you have questions or concerns about these Terms, please reach out to: theragamagazine@gmail.com
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
