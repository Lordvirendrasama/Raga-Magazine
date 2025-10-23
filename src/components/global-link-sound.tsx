
'use client';

import { useEffect, useRef } from 'react';
import { useScalePlayer, scaleFrequencies } from '@/hooks/use-scale-player';
import { throttle } from 'lodash';

export function GlobalLinkSound() {
  const playNote = useScalePlayer();
  const noteCounterRef = useRef(0);
  const lastHoveredElementRef = useRef<EventTarget | null>(null);

  useEffect(() => {
    const playNextNote = () => {
      playNote(noteCounterRef.current);
      noteCounterRef.current = (noteCounterRef.current + 1) % scaleFrequencies.length;
    };

    const throttledPlay = throttle(playNextNote, 200, { trailing: false });

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const linkElement = target.closest('a');

      if (linkElement && lastHoveredElementRef.current !== linkElement) {
        throttledPlay();
        lastHoveredElementRef.current = linkElement;
      } else if (!linkElement) {
        lastHoveredElementRef.current = null;
      }
    };
    
    document.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      throttledPlay.cancel();
    };
  }, [playNote]);

  return null;
}
