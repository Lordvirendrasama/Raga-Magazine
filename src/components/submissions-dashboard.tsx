
'use client';

import { useState, useEffect } from 'react';
import { getSubmissions } from '@/app/submit-your-music/actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format, formatDistanceToNow } from 'date-fns';
import { Mail, Music, ExternalLink, User, Instagram, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface Submission {
  id: string;
  name: string;
  genre: string;
  streamingLink: string;
  bio: string;
  instagram?: string;
  email: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'rejected';
}

const statusColors = {
  pending: 'bg-yellow-500',
  reviewed: 'bg-green-500',
  rejected: 'bg-red-500',
};

export function SubmissionsDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSubmissions() {
      setLoading(true);
      const result = await getSubmissions();
      if (result.success && result.submissions) {
        setSubmissions(result.submissions);
      } else {
        toast({
            variant: 'destructive',
            title: 'Failed to load submissions',
            description: result.message || 'An unexpected error occurred.',
        });
      }
      setLoading(false);
    }
    loadSubmissions();
  }, [toast]);

  const handleEmailClick = (email: string, artistName: string) => {
    const subject = `Re: Your RagaMagazine Submission - ${artistName}`;
    const body = `Hi ${artistName},\n\nThanks for submitting your music to RagaMagazine!\n\nWe've had a listen and...\n\n\nBest,\nThe RagaMagazine Team`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return <p className="text-center text-muted-foreground">No submissions yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Artist</TableHead>
          <TableHead className="hidden md:table-cell">Submitted</TableHead>
          <TableHead>Details</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((sub) => (
          <TableRow key={sub.id}>
            <TableCell>
              <div className="font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {sub.name}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Music className="h-4 w-4 text-muted-foreground" />
                {sub.genre}
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
               <div 
                className="flex items-center gap-2"
                title={format(new Date(sub.submittedAt), 'PPP p')}
               >
                 <Calendar className="h-4 w-4 text-muted-foreground" />
                 {formatDistanceToNow(new Date(sub.submittedAt), { addSuffix: true })}
               </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col gap-2">
                    <Link href={sub.streamingLink} target="_blank" className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <ExternalLink className="h-4 w-4" />
                        Listen on Streaming
                    </Link>
                    {sub.instagram && (
                        <Link href={`https://instagram.com/${sub.instagram.replace('@', '')}`} target="_blank" className="flex items-center gap-2 text-sm text-primary hover:underline">
                           <Instagram className="h-4 w-4" />
                           {sub.instagram}
                        </Link>
                    )}
                </div>
            </TableCell>
            <TableCell className="text-right">
              <Button
                size="sm"
                onClick={() => handleEmailClick(sub.email, sub.name)}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Artist
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
