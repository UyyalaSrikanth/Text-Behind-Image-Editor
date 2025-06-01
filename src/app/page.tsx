'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

// Define image dimensions and loading strategy
const showcaseImages = [
  { 
    id: 1, 
    src: '/img1.png', 
    alt: 'Image 1', 
    width: 500, 
    height: 600,
    priority: true,
    loading: 'eager' as const
  },
  { 
    id: 2, 
    src: '/img2.png', 
    alt: 'Image 2', 
    width: 500, 
    height: 600,
    priority: true,
    loading: 'eager' as const
  },
  { 
    id: 3, 
    src: '/img3.png', 
    alt: 'Image 3', 
    width: 500, 
    height: 600,
    priority: true,
    loading: 'eager' as const
  },
  { 
    id: 4, 
    src: '/img4.png', 
    alt: 'Image 4', 
    width: 500, 
    height: 600,
    priority: false,
    loading: 'lazy' as const
  },
  { 
    id: 5, 
    src: '/img5.png', 
    alt: 'Image 5', 
    width: 500, 
    height: 600,
    priority: false,
    loading: 'lazy' as const
  },
  { 
    id: 6, 
    src: '/img6.png', 
    alt: 'Image 6', 
    width: 500, 
    height: 600,
    priority: false,
    loading: 'lazy' as const
  },
  { 
    id: 7, 
    src: '/img7.png', 
    alt: 'Image 7', 
    width: 500, 
    height: 600,
    priority: false,
    loading: 'lazy' as const
  },
];

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the showcase images to prevent unnecessary re-renders
  const memoizedShowcaseImages = useMemo(() => showcaseImages, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Handle image loading
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <main className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} py-10 px-4 transition-colors`}>
      {/* Toggle Switch */}
      <div className="flex justify-end mb-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:border-white peer-focus:outline-none relative" />
        </label>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Create Stunning Text Behind Image Effects
            </h1>
            <p className="text-xl text-gray-400 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your photos with our easy-to-use editor. Add text behind your subjects and create eye-catching designs in seconds.
            </p>
            <Link
              href="/editor"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Creating Now
            </Link>

            {/* Caption and Mini Photos */}
            <p className="mt-6 text-lg text-blue-500 font-semibold">
              Stop posting Insta stories with boring captions! Upload captions like this.
            </p>

            <div className="mt-8 flex justify-center gap-8">
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-36 rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src="/before.jpg" 
                    alt="Wrong caption" 
                    fill 
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 96px, 96px"
                    onLoad={handleImageLoad}
                    quality={90}
                  />
                </div>
                <span className="mt-2 text-red-500 font-bold text-2xl select-none">❌</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-24 h-36 rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src="/after.png" 
                    alt="Right caption" 
                    fill 
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 96px, 96px"
                    onLoad={handleImageLoad}
                    quality={90}
                  />
                </div>
                <span className="mt-2 text-green-500 font-bold text-2xl select-none">✅</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {memoizedShowcaseImages.map((img) => (
          <div
            key={img.id}
            className="relative w-full break-inside-avoid cursor-pointer transition-transform duration-300 hover:scale-105 hover:rotate-1"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              className="w-full h-auto rounded-lg shadow-lg"
              loading={img.loading}
              priority={img.priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={handleImageLoad}
              quality={90}
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
                '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#f3f4f6"/></svg>'
              ).toString('base64')}`}
            />
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </main>
  );
}
