'use client';

import { removeBackground } from '@imgly/background-removal';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onImageProcessed: (processed: string, original: string) => void;
}

export default function ImageUploader({ onImageProcessed }: ImageUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log('onDrop called', acceptedFiles);
    if (acceptedFiles.length === 0) {
      console.log('No files accepted');
      return;
    }

    const file = acceptedFiles[0];
    console.log('Accepted file:', file.name, file.size, file.type);
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Please select an image under 10MB.');
      console.log('File size too large');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      console.log('Not an image file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    console.log('Starting client-side image processing...');
    try {
      // Read the file as an ArrayBuffer to get the original image Data URL
      const originalReader = new FileReader();
      originalReader.readAsDataURL(file);
      const originalImageUrl = await new Promise<string>((resolve) => {
        originalReader.onload = () => resolve(originalReader.result as string);
      });

      // Perform background removal
      const processedBlob = await removeBackground(file);
      console.log('Background removal complete', processedBlob);

      // Convert the processed Blob to a Data URL
      const processedReader = new FileReader();
      processedReader.readAsDataURL(processedBlob);
      const processedImageUrl = await new Promise<string>((resolve) => {
        processedReader.onload = () => resolve(processedReader.result as string);
      });

      onImageProcessed(processedImageUrl, originalImageUrl);
      console.log('Image processed successfully (client-side)');
    } catch (err) {
      console.error('Error processing image (client-side):', err);
      setError(err instanceof Error ? err.message : 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
      console.log('Finished client-side image processing');
    }
  }, [onImageProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isProcessing,
    onDropRejected: (rejectedFiles) => {
      const file = rejectedFiles[0];
      if (file.errors[0].code === 'file-too-large') {
        setError('File size too large. Please select an image under 10MB.');
      } else if (file.errors[0].code === 'file-invalid-type') {
        setError('Please upload a valid image file (PNG, JPG, JPEG, or GIF)');
      } else {
        setError('Error uploading file. Please try again.');
      }
    }
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Processing image...</p>
          </div>
        ) : isDragActive ? (
          <p className="text-blue-500">Drop the image here...</p>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-gray-600">
              <p className="font-medium">Drag and drop your image here</p>
              <p className="text-sm">or click to select a file</p>
            </div>
            <p className="text-xs text-gray-500">Supports: PNG, JPG, JPEG, GIF (max 10MB)</p>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
} 