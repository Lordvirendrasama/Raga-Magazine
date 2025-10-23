
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect if user is not an admin.
        // A short delay before checking to allow auth state to settle.
        const timer = setTimeout(() => {
            if (user && !user.isAdmin) {
                router.push('/');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [user, router]);


    if (!user) {
        return (
             <div className="container mx-auto px-4 py-8 lg:py-12 text-center">
                <p>Verifying access...</p>
            </div>
        );
    }
    
    if (!user.isAdmin) {
        return (
             <div className="container mx-auto px-4 py-8 lg:py-12 text-center">
                <p>Access Denied. Redirecting...</p>
            </div>
        );
    }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Admin Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your website content and settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>
            This section is under construction. Future updates will allow you to edit headlines and other content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
