'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface ImageUploaderProps {
  onImageProcessed: (processed: string, original: string) => void;
}

export default function ImageUploader({ onImageProcessed }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Initialize worker
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.Worker) {
        try {
          const worker = new Worker(
            new URL('../workers/imageProcessor.ts', import.meta.url),
            { type: 'module' }
          );
          workerRef.current = worker;
          
          worker.onmessage = (e) => {
            if (e.data.type === 'PROCESS_COMPLETE') {
              onImageProcessed(e.data.processedImage, e.data.originalImage);
              setIsUploading(false);
              setUploadProgress(0);
              setError(null);
            } else if (e.data.type === 'PROGRESS_UPDATE') {
              setUploadProgress(e.data.progress);
            } else if (e.data.type === 'PROCESS_ERROR') {
              console.error('Processing error:', e.data.error);
              setError(e.data.error);
              setIsUploading(false);
              setUploadProgress(0);
            }
          };

          worker.onerror = (error) => {
            console.error('Worker error:', error);
            setError('Failed to process image. Please try again.');
            setIsUploading(false);
            setUploadProgress(0);
          };

          return () => {
            if (workerRef.current) {
              workerRef.current.terminate();
              workerRef.current = null;
            }
          };
        } catch (error) {
          console.error('Failed to initialize worker:', error);
          setError('Failed to initialize image processor. Please refresh the page.');
        }
      } else {
        setError('Your browser does not support image processing. Please try a different browser.');
      }
    }
  }, [onImageProcessed]);

  const optimizeImage = async (file: File): Promise<File> => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Use original dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Enable high-quality image rendering
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
        }

        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: file.type, // Preserve original file type
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            } else {
              reject(new Error('Failed to process image'));
            }
          },
          file.type, // Use original file type
          1.0 // Maximum quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const processImage = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image size must be less than 10MB');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      const optimizedFile = await optimizeImage(file);
      
      const reader = new FileReader();
      reader.readAsDataURL(optimizedFile);
      
      reader.onload = () => {
        const base64Image = reader.result as string;
        
        if (workerRef.current) {
          workerRef.current.postMessage({
            type: 'PROCESS_IMAGE',
            image: base64Image,
            originalImage: base64Image
          });
        } else {
          throw new Error('Worker not initialized');
        }
      };

      reader.onerror = () => {
        throw new Error('Failed to read image file');
      };
    } catch (error) {
      console.error('Error processing image:', error);
      setError(error instanceof Error ? error.message : 'Failed to process image');
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  }, [processImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  }, [processImage]);

  const handleClick = useCallback(() => {
    if (!isUploading) {
      setShowModal(true);
    }
  }, [isUploading]);

  const handleGallerySelect = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setShowModal(false);
  }, []);

  const handleCameraSelect = useCallback(() => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
    setShowModal(false);
  }, []);

  return (
    <>
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
          isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={cameraInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          capture="environment"
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center">
            <svg
              className={`w-12 h-12 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg font-medium text-gray-300">
              {isUploading ? 'Processing image...' : 'Tap to select an image'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              or drag and drop a file
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          {isUploading && (
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for choosing camera or gallery */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-80">
            <h3 className="text-xl font-semibold text-white mb-4">Choose Image Source</h3>
            <div className="space-y-4">
              <button
                onClick={handleGallerySelect}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose from Gallery
              </button>
              <button
                onClick={handleCameraSelect}
                className="w-full py-3 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Take Photo
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 