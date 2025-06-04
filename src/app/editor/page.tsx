'use client';

import CanvasEditor, { CanvasEditorRef } from '@/components/CanvasEditor';
import ControlPanel from '@/components/ControlPanel';
import ImageUploader from '@/components/ImageUploader';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

interface TextElement {
  id: string;
  text: string;
  fontFamily: string;
  textColor: string;
  xPosition: number;
  yPosition: number;
  fontSize: number;
  isBold: boolean;
  rotation: number;
}

// List of available fonts
const AVAILABLE_FONTS = [
  'Arial',
  'Verdana',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Palatino',
  'Garamond',
  'Impact',
  'Comic Sans MS',
  'Trebuchet MS',
  'Arial Black',
  'Lucida Sans Unicode',
  'Lucida Console',
  'Courier',
  'Monaco'
];

// Demo images array with metadata
const demoImages = [
  { 
    id: 1, 
    src: '/img1.png', 
    alt: 'Example 1', 
    width: 500, 
    height: 600,
    priority: true,
    loading: 'eager' as const
  },
  { 
    id: 2, 
    src: '/img2.png', 
    alt: 'Example 2', 
    width: 500, 
    height: 600,
    priority: true,
    loading: 'eager' as const
  },
  { 
    id: 3, 
    src: '/img3.png', 
    alt: 'Example 3', 
    width: 500, 
    height: 600,
    priority: false,
    loading: 'lazy' as const
  },
  { 
    id: 4, 
    src: '/img4.png', 
    alt: 'Example 4', 
    width: 500, 
    height: 600,
    priority: false,
    loading: 'lazy' as const
  },
  { 
    id: 5, 
    src: '/img5.png', 
    alt: 'Example 5', 
    width: 500, 
    height: 600,
    priority: false,
    loading: 'lazy' as const
  },
  { 
    id: 6, 
    src: '/img6.png', 
    alt: 'Example 6', 
    width: 500, 
    height: 600,
    priority: false,
    loading: 'lazy' as const
  },
  { 
    id: 7, 
    src: '/img7.png', 
    alt: 'Example 7', 
    width: 500, 
    height: 600,
    priority: false,
    loading: 'lazy' as const
  },
];

export default function Editor() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [imageRotation, setImageRotation] = useState(0);
  const canvasEditorRef = useRef<CanvasEditorRef>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const visibilityChangeRef = useRef<boolean>(true);
  
  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      visibilityChangeRef.current = document.visibilityState === 'visible';
      if (visibilityChangeRef.current && isProcessing) {
        // Resume processing if it was interrupted
        continueProcessing();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isProcessing]);

  // Simulate processing with progress
  const simulateProcessing = useCallback((onComplete: () => void) => {
    let progress = 0;
    const interval = setInterval(() => {
      if (!visibilityChangeRef.current) {
        clearInterval(interval);
        return;
      }

      progress += 5;
      setProcessingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        onComplete();
      }
    }, 100);
  }, []);

  const continueProcessing = useCallback(() => {
    if (isProcessing && processingProgress < 100) {
      simulateProcessing(() => {
        setIsProcessing(false);
        setProcessingProgress(0);
      });
    }
  }, [isProcessing, processingProgress, simulateProcessing]);

  const handleImageProcessed = useCallback((processed: string, original: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Start processing simulation
    simulateProcessing(() => {
      setImageUrl(processed);
      setOriginalImageUrl(original);
      const defaultTextElement: TextElement = {
        id: '1',
        text: 'Edit',
        fontFamily: 'Impact',
        textColor: '#FFFFFF',
        xPosition: 50,
        yPosition: 50,
        fontSize: 120,
        isBold: true,
        rotation: 0,
      };
      setTextElements([defaultTextElement]);
      setSelectedTextId('1');
      setIsProcessing(false);
    });
  }, [simulateProcessing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  // Add image preloading for priority images
  useEffect(() => {
    const preloadImages = () => {
      demoImages
        .filter(img => img.priority)
        .forEach(img => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = img.src;
          document.head.appendChild(link);
        });
    };
    preloadImages();
  }, []);

  // Effect to rotate demo images while processing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => {
        setCurrentDemoIndex((prev) => (prev + 1) % demoImages.length);
      }, 2000); // Change image every 2 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing]);

  const updateTextElement = (updates: Partial<TextElement>) => {
    setTextElements(prev =>
      prev.map(element =>
        element.id === selectedTextId
          ? { ...element, ...updates }
          : element
      )
    );
  };

  const deleteSelectedText = () => {
    if (selectedTextId) {
      setTextElements(prev => prev.filter(element => element.id !== selectedTextId));
      setSelectedTextId(null);
    }
  };

  const handleImageRotationChange = (rotation: number) => {
    setImageRotation(rotation);
  };

  const addNewText = () => {
    const newId = (textElements.length + 1).toString();
    const newTextElement: TextElement = {
      id: newId,
      text: 'New Text',
      fontFamily: 'Impact',
      textColor: '#FFFFFF',
      xPosition: 50,
      yPosition: 50,
      fontSize: 120,
      isBold: true,
      rotation: 0,
    };
    setTextElements(prev => [...prev, newTextElement]);
    setSelectedTextId(newId);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    canvasEditorRef.current?.downloadImage(() => {
      setIsDownloading(false);
      // Show prompt after successful download
      if (window.confirm('Would you like to share your image on Instagram?')) {
        window.open('https://www.instagram.com/create/story', '_blank');
      }
    });
  };

  // Effect to update canvas dimensions with maximum height constraint
  useEffect(() => {
    const updateCanvasDimensions = () => {
      const container = canvasContainerRef.current;
      const originalImg = new window.Image();

      originalImg.onload = () => {
        if (container) {
          const containerWidth = container.offsetWidth;
          const imageAspectRatio = originalImg.width / originalImg.height;
          
          let calculatedHeight = containerWidth / imageAspectRatio;
          const maxHeight = Math.min(window.innerHeight * 0.8, calculatedHeight);
          
          if (calculatedHeight > maxHeight) {
            calculatedHeight = maxHeight;
            setCanvasWidth(maxHeight * imageAspectRatio);
          } else {
            setCanvasWidth(containerWidth);
          }
          
          setCanvasHeight(calculatedHeight);
        }
      };

      if (originalImageUrl) {
        originalImg.src = originalImageUrl;
      }
    };

    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    return () => window.removeEventListener('resize', updateCanvasDimensions);
  }, [originalImageUrl]);

  const selectedText = textElements.find(element => element.id === selectedTextId);

  return (
    <main className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 min-h-screen">
      <div className="max-w-[1600px] mx-auto p-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <Link 
            href="/"
            className="text-gray-300 hover:text-primary-400 flex items-center group transition-all"
          >
            <svg
              className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9.75L12 3l9 6.75V21a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 21V9.75z" />
              <path d="M9 22.5v-6h6v6" />
            </svg>
            <span className="hidden sm:inline"></span>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Text Behind Image Editor
          </h1>
        </div>

        {!imageUrl ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <ImageUploader onImageProcessed={handleImageProcessed} />
            {isProcessing && (
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
                <p className="text-center mt-2 text-gray-300">
                  Processing image... {processingProgress}%
                </p>
              </div>
            )}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Example Results</h3>
              <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                {demoImages.map((img) => (
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
                      quality={90}
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
                        '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#f3f4f6"/></svg>'
                      ).toString('base64')}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Canvas */}
            <div className="lg:col-span-2">
              <div 
                ref={canvasContainerRef}
                className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-auto relative"
                style={{ 
                  maxHeight: '80vh',
                  height: canvasHeight,
                  overflow: 'hidden'
                }}
              >
                <CanvasEditor
                  ref={canvasEditorRef}
                  imageUrl={imageUrl}
                  originalImageUrl={originalImageUrl!}
                  textElements={textElements}
                  canvasWidth={canvasWidth}
                  canvasHeight={canvasHeight}
                  selectedTextId={selectedTextId}
                  onTextSelect={setSelectedTextId}
                  onTextUpdate={updateTextElement}
                  imageRotation={imageRotation}
                  availableFonts={AVAILABLE_FONTS}
                />
              </div>
            </div>

            {/* Right Column - Controls */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 sticky top-4 max-h-[80vh] overflow-y-auto">
                {/* Text Elements List */}
                <div className="mb-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 space-x-0 sm:space-x-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Text Elements
                      </h3>
                      <div className="flex space-x-2 flex-wrap justify-center sm:justify-start">
                        <button
                          onClick={addNewText}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                          disabled={isProcessing}
                        >
                          Add Text
                        </button>
                        {textElements.length > 0 && (
                          <button
                            onClick={deleteSelectedText}
                            className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md"
                            disabled={isProcessing}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2 overflow-x-auto pb-2">
                    {textElements.map((element) => (
                      <button
                        key={element.id}
                        onClick={() => setSelectedTextId(element.id)}
                        className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap shadow-md ${
                          element.id === selectedTextId
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                        disabled={isProcessing}
                      >
                        {element.text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Control Panel */}
                {selectedText && (
                  <ControlPanel
                    text={selectedText.text}
                    fontFamily={selectedText.fontFamily}
                    textColor={selectedText.textColor}
                    xPosition={selectedText.xPosition}
                    yPosition={selectedText.yPosition}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                    fontSize={selectedText.fontSize}
                    isBold={selectedText.isBold}
                    rotation={selectedText.rotation}
                    onTextChange={(text) => updateTextElement({ text })}
                    onFontFamilyChange={(fontFamily) => updateTextElement({ fontFamily })}
                    onTextColorChange={(textColor) => updateTextElement({ textColor })}
                    onXPositionChange={(xPosition) => updateTextElement({ xPosition })}
                    onYPositionChange={(yPosition) => updateTextElement({ yPosition })}
                    onFontSizeChange={(fontSize) => updateTextElement({ fontSize })}
                    onBoldChange={(isBold) => updateTextElement({ isBold })}
                    onRotationChange={(rotation) => updateTextElement({ rotation })}
                    onDownload={handleDownload}
                    imageRotation={imageRotation}
                    onImageRotationChange={handleImageRotationChange}
                    mainRef={mainRef}
                    availableFonts={AVAILABLE_FONTS}
                    disabled={isProcessing}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Download button */}
        {imageUrl && !isProcessing && (
          <div className="text-center mt-8 space-y-6">
            <button
              onClick={handleDownload}
              className={`w-full sm:w-auto px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-md ${isDownloading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'}`}
              disabled={isDownloading}
            >
              {isDownloading ? 'Downloading Image...' : 'Download Edited Image'}
            </button>

            {/* Social Sharing Links */}
            <div className="flex flex-col items-center space-y-4">
              <p className="text-gray-400 text-sm">Share your creation:</p>
              <div className="flex space-x-6">
                <a
                  href={`https://twitter.com/intent/tweet?text=Check out my edited image!&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  title="Share on Twitter"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title="Share on Facebook"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=Check out my edited image!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-700 transition-colors"
                  title="Share on LinkedIn"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent('Check out my edited image! ' + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500 transition-colors"
                  title="Share on WhatsApp"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/create/story"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                  title="Share on Instagram - You'll need to manually upload your image"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}