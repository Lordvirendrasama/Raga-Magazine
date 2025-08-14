import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function VirtualMagazinePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <h1 className="mb-8 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Virtual Magazine
          </h1>
          <p className="text-muted-foreground">
            Welcome to the virtual magazine. More content coming soon!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
