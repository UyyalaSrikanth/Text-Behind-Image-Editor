'use client';

import { useEffect, useState } from 'react';

interface FontLoaderProps {
  fontUrl: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export default function FontLoader({ fontUrl, onLoad, onError }: FontLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if font is already loaded
    if (document.fonts.check(`1em "${fontUrl.split('family=')[1]?.split(':')[0]}"`)) {
      setIsLoaded(true);
      onLoad?.();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;

    const handleLoad = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    const handleError = (error: ErrorEvent) => {
      console.error('Failed to load font:', error);
      onError?.(new Error('Failed to load font'));
    };

    link.addEventListener('load', handleLoad);
    link.addEventListener('error', handleError);

    document.head.appendChild(link);

    return () => {
      link.removeEventListener('load', handleLoad);
      link.removeEventListener('error', handleError);
      document.head.removeChild(link);
    };
  }, [fontUrl, onLoad, onError]);

  return null;
} 