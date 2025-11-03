
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useScalePlayer, scaleFrequencies } from '@/hooks/use-scale-player';
import { throttle } from 'lodash';
import { useIsMobile } from '@/hooks/use-mobile';

export function GlobalLinkSound() {
  const playNote = useScalePlayer();
  const noteCounterRef = useRef(0);
  const lastHoveredElementRef = useRef<EventTarget | null>(null);
  const isMobile = useIsMobile();

  const playNextNote = useCallback(() => {
    playNote(noteCounterRef.current);
    noteCounterRef.current = (noteCounterRef.current + 1) % scaleFrequencies.length;
  }, [playNote]);

  const throttledPlay = useCallback(throttle(playNextNote, 200, { trailing: false }), [playNextNote]);


  useEffect(() => {
    if (isMobile) {
      const handleTouchStart = () => {
        throttledPlay();
      };
      
      document.addEventListener('touchstart', handleTouchStart);

      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        throttledPlay.cancel();
      };

    } else {
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
    }
  }, [isMobile, throttledPlay]);

  return null;
}
