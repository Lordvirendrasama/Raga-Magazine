
'use client';

import { useState, useEffect } from 'react';

// A-Frame's components are not standard HTML, so we need to declare them for TypeScript/JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'a-sky': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export default function MuseumPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    setIsMounted(true);
  }, []);

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      {isMounted && (
        <a-scene embedded>
          {/* We use a 360-degree image to create the room environment. 
              This is a placeholder image of an empty museum room.
              The user can look around with their mouse. */}
          <a-sky src="https://images.unsplash.com/photo-1594910002127-a9a7c3c169e3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3" />
        </a-scene>
      )}
    </div>
  );
}
