import { AdminPanel } from '@/components/admin-panel';

export default function AdminPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 lg:py-12">
      <div className="mb-8 text-center md:mb-12">
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Admin Panel
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Manage your website settings, content, and submissions.
        </p>
      </div>

      <AdminPanel />
    </div>
  );
}
