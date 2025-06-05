'use client';

import CanvasEditor, { CanvasEditorRef } from '@/components/CanvasEditor';
import ControlPanel from '@/components/ControlPanel';
import ImageUploader from '@/components/ImageUploader';
import ShareModal from '@/components/ShareModal';
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
  opacity: number;
  is3D: boolean;
  depth: number;
  perspective: number;
  shadowColor: string;
  shadowEnabled: boolean;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

// List of available fonts
const availableFonts = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Impact',
  'Comic Sans MS',
  'Dancing Script',    // Elegant cursive font
  'Pacifico',         // Fun, casual script
  'Lobster',          // Bold, playful display font
  'Playfair Display', // Classic serif with decorative elements
  'Great Vibes'       // Elegant calligraphy style
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
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const canvasEditorRef = useRef<CanvasEditorRef>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const visibilityChangeRef = useRef<boolean>(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState('');
  
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
        opacity: 1,
        is3D: false,
        depth: 10,
        perspective: 45,
        shadowColor: '#000000',
        shadowEnabled: false,
        shadowBlur: 5,
        shadowOffsetX: 0,
        shadowOffsetY: 0
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
      opacity: 1,
      is3D: false,
      depth: 10,
      perspective: 45,
      shadowColor: '#000000',
      shadowEnabled: false,
      shadowBlur: 5,
      shadowOffsetX: 0,
      shadowOffsetY: 0
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const imageUrl = await uploadImage(file);
      setImageUrl(imageUrl);
      
      // Reset all states when new image is uploaded
      setTextElements([]);
      setSelectedTextId(null);
      setImageRotation(0);
      setImageScale(1);
      setImagePosition({ x: 0, y: 0 });
      
      // Reset the file input
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        throw new Error('Canvas not found');
      }

      // Create a new canvas for the final image
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height;
      const ctx = finalCanvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Draw the edited image from the editor canvas
      ctx.drawImage(canvas, 0, 0);

      // Add watermark text
      ctx.font = '16px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('To do more images like this visit aiditkaro.vercel.app', 20, finalCanvas.height - 20);

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        finalCanvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      // Create a File object
      const file = new File([blob], 'textbehindimage.png', { type: 'image/png' });

      // Check if Web Share API is available
      if (navigator.share) {
        try {
          await navigator.share({
            files: [file],
            title: 'TextBehindImage Creation',
            text: 'Check out this amazing image I created! ✨'
          });
          return;
        } catch (err) {
          console.error('Error sharing:', err);
          // Fallback to opening modal if sharing fails
          setShareImageUrl(URL.createObjectURL(blob));
          setIsShareModalOpen(true);
        }
      } else {
        // Fallback for browsers that don't support Web Share API
        setShareImageUrl(URL.createObjectURL(blob));
        setIsShareModalOpen(true);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share. Please try again.');
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

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
                  availableFonts={availableFonts}
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
                    opacity={selectedText.opacity}
                    is3D={selectedText.is3D}
                    depth={selectedText.depth}
                    perspective={selectedText.perspective}
                    shadowColor={selectedText.shadowColor}
                    shadowEnabled={selectedText.shadowEnabled}
                    shadowBlur={selectedText.shadowBlur}
                    shadowOffsetX={selectedText.shadowOffsetX}
                    shadowOffsetY={selectedText.shadowOffsetY}
                    onTextChange={(text) => updateTextElement({ text })}
                    onFontFamilyChange={(fontFamily) => updateTextElement({ fontFamily })}
                    onTextColorChange={(textColor) => updateTextElement({ textColor })}
                    onXPositionChange={(xPosition) => updateTextElement({ xPosition })}
                    onYPositionChange={(yPosition) => updateTextElement({ yPosition })}
                    onFontSizeChange={(fontSize) => updateTextElement({ fontSize })}
                    onBoldChange={(isBold) => updateTextElement({ isBold })}
                    onRotationChange={(rotation) => updateTextElement({ rotation })}
                    onOpacityChange={(opacity) => updateTextElement({ opacity })}
                    on3DChange={(is3D) => updateTextElement({ is3D })}
                    onDepthChange={(depth) => updateTextElement({ depth })}
                    onPerspectiveChange={(perspective) => updateTextElement({ perspective })}
                    onShadowColorChange={(shadowColor) => updateTextElement({ shadowColor })}
                    onShadowEnabledChange={(shadowEnabled) => updateTextElement({ shadowEnabled })}
                    onShadowBlurChange={(shadowBlur) => updateTextElement({ shadowBlur })}
                    onShadowOffsetXChange={(shadowOffsetX) => updateTextElement({ shadowOffsetX })}
                    onShadowOffsetYChange={(shadowOffsetY) => updateTextElement({ shadowOffsetY })}
                    onDownload={handleDownload}
                    imageRotation={imageRotation}
                    onImageRotationChange={handleImageRotationChange}
                    mainRef={mainRef}
                    availableFonts={availableFonts}
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
          </div>
        )}

        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={handleShare}
            disabled={isProcessing || !imageUrl}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Share
          </button>
        </div>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          if (shareImageUrl) {
            URL.revokeObjectURL(shareImageUrl);
          }
        }}
        imageUrl={shareImageUrl}
      />
    </main>
  );
}