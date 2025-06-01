'use client';

import { useEffect } from 'react';

export default function FontLoader() {
  useEffect(() => {
    // Create a hidden div to force font loading
    const fontLoader = document.createElement('div');
    fontLoader.className = 'font-loader';
    fontLoader.style.position = 'absolute';
    fontLoader.style.visibility = 'hidden';
    fontLoader.style.pointerEvents = 'none';
    
    // Add text with all fonts to force loading
    const fonts = [
      'Impact', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New',
      'Verdana', 'Tahoma', 'Trebuchet MS', 'Arial Black', 'Dancing Script',
      'Pacifico', 'Lobster', 'Satisfy', 'Great Vibes', 'Shadows Into Light',
      'Tangerine', 'Yellowtail', 'Alex Brush', 'Allura', 'Berkshire Swash',
      'Calligraffitti', 'Caveat', 'Clicker Script', 'Homemade Apple', 'Italianno',
      'Kaushan Script', 'La Belle Aurore', 'Marck Script', 'MonteCarlo',
      'Mr De Haviland', 'Parisienne', 'Petit Formal Script', 'Qwigley',
      'Redressed', 'Rock Salt', 'Sacramento', 'Shadows Into Light Two', 'Zeyada'
    ];

    fonts.forEach(font => {
      const span = document.createElement('span');
      span.style.fontFamily = `"${font}", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`;
      span.textContent = 'Font Loader';
      fontLoader.appendChild(span);
    });

    document.body.appendChild(fontLoader);

    // Cleanup
    return () => {
      document.body.removeChild(fontLoader);
    };
  }, []);

  return null;
} 