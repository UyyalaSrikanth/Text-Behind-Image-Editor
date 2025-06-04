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
  const workerRef = useRef<Worker | null>(null);

  // Initialize worker
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only create worker if Web Workers are supported
      if (window.Worker) {
        try {
          // Create worker
          const worker = new Worker(
            new URL('../workers/imageProcessor.ts', import.meta.url),
            { type: 'module' }
          );
          workerRef.current = worker;
          
          // Set up message handler
          worker.onmessage = (e) => {
            if (e.data.type === 'PROCESS_COMPLETE') {
              onImageProcessed(e.data.processedImage, e.data.originalImage);
              setIsUploading(false);
              setUploadProgress(0);
            } else if (e.data.type === 'PROGRESS_UPDATE') {
              setUploadProgress(e.data.progress);
            } else if (e.data.type === 'PROCESS_ERROR') {
              console.error('Processing error:', e.data.error);
              setIsUploading(false);
              setUploadProgress(0);
            }
          };

          // Handle worker errors
          worker.onerror = (error) => {
            console.error('Worker error:', error);
            setIsUploading(false);
            setUploadProgress(0);
          };

          // Cleanup worker on unmount
          return () => {
            if (workerRef.current) {
              workerRef.current.terminate();
              workerRef.current = null;
            }
          };
        } catch (error) {
          console.error('Failed to initialize worker:', error);
        }
      }
    }
  }, [onImageProcessed]);

  const optimizeImage = async (file: File): Promise<File> => {
    // Create a canvas to resize the image
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        const maxDimension = 1600; // Increased max dimension for better quality

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create new file from blob
              const optimizedFile = new File([blob], file.name, {
                type: 'image/png', // Use PNG for better quality
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            } else {
              reject(new Error('Failed to optimize image'));
            }
          },
          'image/png', // Use PNG format
          1.0 // Maximum quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      // Load image from file
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

      // Optimize image before processing
      const optimizedFile = await optimizeImage(file);
      
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(optimizedFile);
      
      reader.onload = () => {
        const base64Image = reader.result as string;
        
        // Send image to worker for processing
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
        console.error('Error reading file');
        setIsUploading(false);
        setUploadProgress(0);
      };
    } catch (error) {
      console.error('Error processing image:', error);
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

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
        isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
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
            {isUploading ? 'Processing image...' : 'Drag and drop your image here'}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            or click to select a file
          </p>
        </div>

        {isUploading && (
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`px-4 py-2 rounded-lg transition-all ${
            isUploading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isUploading ? 'Processing...' : 'Select Image'}
        </button>
      </div>
    </div>
  );
} 