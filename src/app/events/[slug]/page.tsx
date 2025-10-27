
import React from 'react';
import { use } from 'react';
import EventClientPage from './event-client-page';

export default function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <EventClientPage slug={slug} />;
}
