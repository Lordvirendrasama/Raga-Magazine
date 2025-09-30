
'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMute } from '@/hooks/use-mute';

export function MuteToggle() {
  const { isMuted, toggleMute } = useMute();

  return (
    <Button variant="ghost" size="icon" onClick={toggleMute} aria-label="Toggle sound">
      {isMuted ? (
        <VolumeX className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Volume2 className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}
