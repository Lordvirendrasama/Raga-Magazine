
'use client';

import { Music, Music2, Music3, Music4 } from 'lucide-react';
import { cn } from '@/lib/utils';

const notes = [
  { Icon: Music, size: 'w-4 h-4', position: 'bottom-2 left-2', delay: '0s', duration: '1.5s' },
  { Icon: Music2, size: 'w-5 h-5', position: 'bottom-8 right-5', delay: '0.2s', duration: '1.8s' },
  { Icon: Music3, size: 'w-3 h-3', position: 'bottom-1 right-10', delay: '0.5s', duration: '2s' },
  { Icon: Music4, size: 'w-6 h-6', position: 'bottom-5 left-8', delay: '0.8s', duration: '1.6s' },
  { Icon: Music, size: 'w-4 h-4', position: 'bottom-12 right-12', delay: '1s', duration: '1.9s' },
];

interface MusicNoteAnimationProps {
  isPlaying: boolean;
}

export const MusicNoteAnimation = ({ isPlaying }: MusicNoteAnimationProps) => {
  if (!isPlaying) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      {notes.map(({ Icon, size, position, delay, duration }, index) => (
        <Icon
          key={index}
          className={cn(
            'absolute text-primary/60 animate-note-pop-out',
            size,
            position
          )}
          style={{
            animationDelay: delay,
            animationDuration: duration,
          }}
        />
      ))}
    </div>
  );
};
