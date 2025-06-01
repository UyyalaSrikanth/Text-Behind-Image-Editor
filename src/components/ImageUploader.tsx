'use client';

import { removeBackground } from '@imgly/background-removal';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onImageProcessed: (processed: string, original: string) => void;
}

export default function ImageUploader({ onImageProcessed }: ImageUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const processingRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // App is going to background
        if (processingRef.current && abortControllerRef.current) {
          abortControllerRef.current.abort();
          processingRef.current = false;
          setIsProcessing(false);
          setProgress(0);
        }
      } else {
        // App is coming back to foreground
        setError('Processing was interrupted. Please try uploading again.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const processImage = useCallback(async (file: File) => {
    try {
      processingRef.current = true;
      setIsProcessing(true);
      setProgress(0);
      setError(null);

      // Create new AbortController for this process
      abortControllerRef.current = new AbortController();

      // Convert file to base64
      const reader = new FileReader();
      const originalBase64 = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      // Process image with background removal
      const processedBlob = await removeBackground(file, {
        progress: (key, current, total) => {
          if (key === 'compute:inference') {
            setProgress(Math.round((current / total) * 100));
          }
        }
      });

      // Convert processed blob to base64
      const processedBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(processedBlob);
      });

      processingRef.current = false;
      onImageProcessed(processedBase64, originalBase64);
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'name' in err && (err as any).name === 'AbortError') {
        setError('Processing was interrupted. Please try again.');
      } else {
        console.error('Error processing image:', err);
        setError('Error processing image. Please try again.');
      }
      processingRef.current = false;
    } finally {
      setIsProcessing(false);
      setProgress(0);
      abortControllerRef.current = null;
    }
  }, [onImageProcessed]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size should be less than 10MB');
        return;
      }
      await processImage(file);
    }
  }, [processImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div className="text-lg font-medium">
            {isProcessing ? (
              <div className="space-y-2">
                <p>Processing image...</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">{progress}%</p>
              </div>
            ) : isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <p>Drag & drop an image here, or click to select</p>
            )}
          </div>
          {!isProcessing && (
            <p className="text-sm text-gray-500">
              Supports PNG, JPG, JPEG, WEBP (max 10MB)
            </p>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
} 