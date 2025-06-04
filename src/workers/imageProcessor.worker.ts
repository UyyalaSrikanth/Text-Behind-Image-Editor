/// <reference lib="webworker" />

// @ts-ignore
const ctx: Worker = self;

import { removeBackground } from '@imgly/background-removal';

// Handle messages from the main thread
ctx.onmessage = async (e) => {
  if (e.data.type === 'PROCESS_IMAGE') {
    try {
      const { image, originalImage } = e.data;
      
      // Convert base64 to blob
      const response = await fetch(image);
      const blob = await response.blob();
      
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

      // Convert processed blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(processedBlob);
      
      reader.onload = () => {
        // Send both processed and original images back to main thread
        ctx.postMessage({
          type: 'PROCESS_COMPLETE',
          processedImage: reader.result,
          originalImage: originalImage
        });
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