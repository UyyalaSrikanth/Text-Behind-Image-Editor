'use client';

import { useEffect } from 'react';

interface FontLoaderProps {
  fontUrl: string;
}

export default function FontLoader({ fontUrl }: FontLoaderProps) {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [fontUrl]);

  return null;
} 