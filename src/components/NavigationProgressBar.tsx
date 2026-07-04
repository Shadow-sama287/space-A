'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Reset loading state whenever pathname or search params finish updating
  useEffect(() => {
    setIsLoading(false);
    setProgress(100);
    const timer = setTimeout(() => {
      setProgress(0);
    }, 200);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Intercept click events on standard navigation links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLAnchorElement;
      if (!target) return;

      const targetUrl = target.getAttribute('href');
      if (
        targetUrl &&
        targetUrl.startsWith('/') &&
        targetUrl !== pathname &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        setIsLoading(true);
        setProgress(30);

        // Gradually increment progress bar while waiting for server response
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 85) {
              clearInterval(interval);
              return 85;
            }
            return prev + 15;
          });
        }, 150);
      }
    };

    const anchors = Array.from(document.querySelectorAll('a[href^="/"]'));
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', handleAnchorClick as EventListener);
    });

    return () => {
      anchors.forEach((anchor) => {
        anchor.removeEventListener('click', handleAnchorClick as EventListener);
      });
    };
  }, [pathname]);

  if (progress === 0 && !isLoading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        backgroundColor: 'transparent',
        zIndex: 100000,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          backgroundColor: '#000000',
          width: `${progress}%`,
          transition: progress === 100 ? 'width 0.15s ease-out' : 'width 0.25s ease-in-out',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
}
