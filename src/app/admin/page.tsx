
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { getMuseumContent, updateMuseumContent, type MuseumWall } from '@/lib/museum-content';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';

type FormValues = {
  walls: Omit<MuseumWall, 'id'>[];
};

type PageStatus = 'loading' | 'success' | 'error';

export default function AdminPage() {
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
        const fetchData = async () => {
            try {
                const content = await getMuseumContent();
                reset({ walls: content.map(({ id, ...rest }) => rest) });
                setStatus('success');
            } catch (e) {
                 toast({
                    title: "Error",
                    description: "Could not load museum content.",
                    variant: "destructive"
                });
                setStatus('error');
            }
        };

        fetchData();
    }, [reset, toast]);

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
                        {status === 'error' ? (
                            <p className="text-center text-destructive">Could not load admin data.</p>
                        ) : (
                            [...Array(4)].map((_, i) => (
                                 <div key={i} className="space-y-4 p-4 border rounded-lg">
                                    <Skeleton className="h-6 w-1/5 mb-4" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-1/6" />
                                        <Skeleton className="h-20 w-full" />
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
                Edit the text paragraph and YouTube video for the four walls of the 3D museum.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                         <h3 className="font-headline text-xl font-semibold">Wall {index + 1}</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`walls[${index}].text`}>Text Paragraph</Label>
                          <Textarea {...register(`walls.${index}.text`)} id={`walls[${index}].text`} rows={3} />
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
