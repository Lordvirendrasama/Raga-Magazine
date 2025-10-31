
'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Headphones, Inbox } from 'lucide-react';
import { GeneralSettings } from '@/components/general-settings';
import { SubmissionsDashboard } from './submissions-dashboard';

export function AdminPanel() {
  return (
    <Tabs defaultValue="submissions" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="submissions">
            <Inbox className="mr-2 h-4 w-4" />
            Submissions
        </TabsTrigger>
        <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            General Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="submissions">
        <Card>
          <CardHeader>
            <CardTitle>Music Submissions</CardTitle>
            <CardDescription>
              Review and manage all music submissions from artists.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <SubmissionsDashboard />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="general">
        <Card>
            <CardHeader>
                <CardTitle>Website Management</CardTitle>
                <CardDescription>
                    Update general content and metadata across your site.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <GeneralSettings />
            </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
