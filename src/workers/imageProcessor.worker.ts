/// <reference lib="webworker" />

// @ts-ignore
const ctx: Worker = self;

import { removeBackground } from '@imgly/background-removal';

// Handle messages from the main thread
ctx.onmessage = async (e) => {
  if (e.data.type === 'PROCESS_IMAGE') {
    try {
      const { image, originalImage } = e.data;
      
      // Validate input
      if (!image) {
        throw new Error('No image provided');
      }

      // Convert base64 to blob
      const response = await fetch(image);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const blob = await response.blob();
      
      // Validate blob
      if (!blob || blob.size === 0) {
        throw new Error('Invalid image data');
      }

      // Check if image is too large (max 10MB)
      if (blob.size > 10 * 1024 * 1024) {
        throw new Error('Image size must be less than 10MB');
      }

      // Process image with background removal
      const processedBlob = await removeBackground(blob, {
        progress: (key, current, total) => {
          if (key === 'compute:inference') {
            // Send progress updates back to main thread
            ctx.postMessage({
              type: 'PROGRESS_UPDATE',
              progress: Math.round((current / total) * 100)
            });
          }
        },
        // Use isnet model for better performance
        model: 'isnet', // Default model that provides good balance of speed and quality
        output: {
          format: 'image/png', // Use PNG to preserve transparency
          quality: 1.0 // Use maximum quality for better results
        }
      });

      // Validate processed blob
      if (!processedBlob || processedBlob.size === 0) {
        throw new Error('Failed to process image');
      }

      // Convert processed blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(processedBlob);
      
      reader.onload = () => {
        if (!reader.result) {
          throw new Error('Failed to convert processed image');
        }
        // Send both processed and original images back to main thread
        ctx.postMessage({
          type: 'PROCESS_COMPLETE',
          processedImage: reader.result,
          originalImage: originalImage
        });
      };

      reader.onerror = () => {
        throw new Error('Failed to read processed image');
      };
    } catch (error) {
      // Send error back to main thread
      ctx.postMessage({
        type: 'PROCESS_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
}; 