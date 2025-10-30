
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import MouseFollower from '@/components/mouse-follower';
import { PageFlipper } from '@/components/page-flipper';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MuteProvider } from '@/hooks/use-mute';
import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/loading-screen';
import { GlobalLinkSound } from '@/components/global-link-sound';
import { Marquee } from '@/components/marquee';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide the loading screen as soon as the component mounts and is interactive.
    setIsLoading(false);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <title>RagaMagazine</title>
        <meta name="description" content="The future of reading is here." />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')} suppressHydrationWarning>
        {isLoading && <LoadingScreen />}
        <div className={cn('transition-opacity duration-500', isLoading ? 'opacity-0' : 'opacity-100')}>
          <FirebaseClientProvider>
            <MuteProvider>
              <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
              >
                <Header />
                <main className="flex-1 flex flex-col relative z-10">
                  <MouseFollower />
                  <PageFlipper>{children}</PageFlipper>
                </main>
                <Footer />
                <Marquee />
                <Toaster />
                <GlobalLinkSound />
              </ThemeProvider>
            </MuteProvider>
          </FirebaseClientProvider>
        </div>
      </body>
    </html>
  );
}
