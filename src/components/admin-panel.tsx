
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
import { Globe, Construction } from 'lucide-react';
import { GeneralSettings } from '@/components/general-settings';
import { DevTools } from './dev-tools';


export function AdminPanel() {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            General Settings
        </TabsTrigger>
        <TabsTrigger value="dev-tools">
            <Construction className="mr-2 h-4 w-4" />
            Developer Tools
        </TabsTrigger>
      </TabsList>
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
       <TabsContent value="dev-tools">
        <DevTools />
      </TabsContent>
    </Tabs>
  );
}
