// src/app/admin/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ExternalLink, Instagram } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const GENRES = ['Pop', 'Rock', 'Indie', 'Electronic', 'Hip-Hop', 'Classical', 'Other'];

export default function AdminPage() {
  const [submissions, loading, error] = useCollection(
    collection(firestore, 'musicSubmissions')
  );

  const [genreFilter, setGenreFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];
    
    let filtered = submissions.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (genreFilter !== 'all') {
      filtered = filtered.filter(sub => sub.genre === genreFilter);
    }
    
    if (dateFilter) {
      filtered = filtered.filter(sub => {
        const submissionDate = sub.submittedAt?.toDate ? format(sub.submittedAt.toDate(), 'yyyy-MM-dd') : '';
        return submissionDate === dateFilter;
      });
    }

    return filtered.sort((a, b) => b.submittedAt?.toMillis() - a.submittedAt?.toMillis());
  }, [submissions, genreFilter, dateFilter]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 lg:py-12">
      <div className="mb-8 md:mb-12">
        <h1 className="mb-2 font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Music Submissions
        </h1>
        <p className="text-lg text-muted-foreground">
          Review and manage all incoming artist submissions.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="genre-filter" className="text-sm font-medium">Genre:</label>
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger id="genre-filter" className="w-[180px]">
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {GENRES.map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
            <label htmlFor="date-filter" className="text-sm font-medium">Date:</label>
            <Input
              id="date-filter"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-[180px]"
            />
        </div>
      </div>
      
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artist</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Links</TableHead>
              <TableHead className="text-right">Bio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-5 w-16" /></TableCell>
              </TableRow>
            ))}
            {!loading && filteredSubmissions.map((sub: any) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">{sub.artistName}</TableCell>
                <TableCell><Badge variant="secondary">{sub.genre}</Badge></TableCell>
                <TableCell>{sub.submittedAt ? format(sub.submittedAt.toDate(), 'MMM d, yyyy') : 'N/A'}</TableCell>
                <TableCell>
                  <a href={`mailto:${sub.contactEmail}`} className="text-primary hover:underline">
                    {sub.contactEmail}
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    {sub.streamingLink && (
                      <Link href={sub.streamingLink} target="_blank" title="Streaming Link">
                        <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Link>
                    )}
                    {sub.instagramHandle && (
                      <Link href={`https://instagram.com/${sub.instagramHandle.replace('@', '')}`} target="_blank" title="Instagram">
                        <Instagram className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Link>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right max-w-xs truncate" title={sub.bio}>{sub.bio}</TableCell>
              </TableRow>
            ))}
             {!loading && filteredSubmissions.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                        No submissions found for the selected filters.
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </div>

       {error && <div className="mt-4 text-center text-destructive">Error: {error.message}</div>}
    </div>
  );
}