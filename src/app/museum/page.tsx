
// This file is renamed to page-wrapper.tsx in this change.
// The new page.tsx will be a server component that fetches data.
// For the purpose of this tool, we are modifying the existing page.tsx
// to become the new server component wrapper.

import { getMuseumContent } from '@/lib/museum-content';
import MuseumClientPage from './museum-client-page';

export default async function MuseumPage() {
  const initialWalls = await getMuseumContent();

  return <MuseumClientPage initialWalls={initialWalls} />;
}
