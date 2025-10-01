"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function DevTools() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dev Tools</CardTitle>
        <CardDescription>
          This section is currently empty.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Developer tools will be available here in a future update.</p>
      </CardContent>
    </Card>
  );
}
