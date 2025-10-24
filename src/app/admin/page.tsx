
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { getMuseumContent, updateMuseumContent, type MuseumWall } from '@/lib/museum-content';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';

type FormValues = {
  walls: MuseumWall[];
};

type PageStatus = 'loading' | 'success' | 'denied';

export default function AdminPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [status, setStatus] = useState<PageStatus>('loading');

    const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormValues>({
        defaultValues: {
            walls: []
        }
    });
    const { fields } = useFieldArray({
        control,
        name: "walls"
    });

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            // This pattern ensures we don't proceed until auth state is resolved.
            if (user === undefined) {
                setStatus('loading');
                return;
            }

            if (!user || !user.isAdmin) {
                toast({
                    title: "Access Denied",
                    description: "You do not have permission to view this page.",
                    variant: "destructive"
                });
                setStatus('denied');
                router.push('/');
                return;
            }
            
            // User is admin, fetch content.
            try {
                const content = await getMuseumContent();
                reset({ walls: content });
                setStatus('success');
            } catch (e) {
                 toast({
                    title: "Error",
                    description: "Could not load museum content.",
                    variant: "destructive"
                });
                setStatus('denied');
            }
        };

        checkAuthAndFetchData();
    }, [user, router, reset, toast]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            await updateMuseumContent(data.walls);
            toast({
                title: "Success!",
                description: "Museum content has been updated.",
            });
        } catch (error) {
            console.error("Failed to update museum content:", error);
            toast({
                title: "Error",
                description: "Failed to update museum content. Please try again.",
                variant: "destructive",
            });
        }
    };
    
    if (status !== 'success') {
        return (
             <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="mb-8">
                    <Skeleton className="h-12 w-1/3 mb-4" />
                    <Skeleton className="h-6 w-2/3" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/4 mb-2" />
                        <Skeleton className="h-5 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {status === 'denied' ? (
                            <p className="text-center text-destructive">Access Denied. You will be redirected.</p>
                        ) : (
                            [...Array(4)].map((_, i) => (
                                 <div key={i} className="space-y-4 p-4 border rounded-lg">
                                    <Skeleton className="h-6 w-1/5 mb-4" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-1/6" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-1/6" />
                                        <Skeleton className="h-20 w-full" />
                                    </div>

                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-1/6" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                     <div className="space-y-2">
                                        <Skeleton className="h-4 w-1/6" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                 </div>
                            ))
                        )}
                    </CardContent>
                </Card>
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
          Manage the content for the 3D museum experience.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
            <CardHeader>
            <CardTitle>Museum Content</CardTitle>
            <CardDescription>
                Edit the text, images, and videos for the four walls of the 3D museum.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                         <h3 className="font-headline text-xl font-semibold">Wall {index + 1}</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`walls[${index}].artistName`}>Artist Name</Label>
                          <Input {...register(`walls.${index}.artistName`)} id={`walls[${index}].artistName`} />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`walls[${index}].artistDescription`}>Artist Description</Label>
                          <Textarea {...register(`walls.${index}.artistDescription`)} id={`walls[${index}].artistDescription`} rows={3} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`walls[${index}].imageUrl`}>Image URL</Label>
                            <Input {...register(`walls.${index}.imageUrl`)} id={`walls[${index}].imageUrl`} />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor={`walls[${index}].youtubeUrl`}>YouTube Embed URL</Label>
                            <Input {...register(`walls.${index}.youtubeUrl`)} id={`walls[${index}].youtubeUrl`} placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID" />
                        </div>
                    </div>
                ))}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Museum Content'}
                </Button>
            </CardContent>
        </Card>
      </form>
    </div>
  );
}
