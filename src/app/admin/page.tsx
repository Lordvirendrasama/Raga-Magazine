
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler, type FieldValues } from "react-hook-form";
import { getMuseumContent, updateMuseumContent, type MuseumWall } from '@/lib/museum-content';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';

type FormValues = {
  walls: MuseumWall[];
};

export default function AdminPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);

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
        const timer = setTimeout(() => {
            if (user && !user.isAdmin) {
                router.push('/');
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [user, router]);

    useEffect(() => {
        if (user?.isAdmin) {
            const fetchContent = async () => {
                setLoading(true);
                const content = await getMuseumContent();
                reset({ walls: content });
                setLoading(false);
            };
            fetchContent();
        }
    }, [user, reset]);


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
    
    if (loading) {
        return (
             <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="mb-8">
                    <Skeleton className="h-12 w-1/3 mb-4" />
                    <Skeleton className="h-6 w-2/3" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/4" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[...Array(4)].map((_, i) => (
                             <div key={i} className="space-y-2 p-4 border rounded-lg">
                                <Skeleton className="h-6 w-1/5 mb-4" />
                                <Skeleton className="h-4 w-1/6" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-4 w-1/6" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-4 w-1/6" />
                                <Skeleton className="h-10 w-full" />
                             </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        )
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
            <CardHeader>
            <CardTitle>Museum Content</CardTitle>
            <CardDescription>
                Edit the text and images for the four walls of the 3D museum.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 {fields.map((field, index) => (
                    <div key={field.id} className="space-y-2 p-4 border rounded-lg">
                         <h3 className="font-headline text-xl font-semibold">Wall {index + 1}</h3>
                        
                        <Label htmlFor={`walls[${index}].artistName`}>Artist Name</Label>
                        <Input {...register(`walls.${index}.artistName`)} id={`walls[${index}].artistName`} />
                        
                        <Label htmlFor={`walls[${index}].artistDescription`}>Artist Description</Label>
                        <Textarea {...register(`walls.${index}.artistDescription`)} id={`walls[${index}].artistDescription`} rows={3} />

                        <Label htmlFor={`walls[${index}].imageUrl`}>Image URL</Label>
                        <Input {...register(`walls.${index}.imageUrl`)} id={`walls[${index}].imageUrl`} />
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
