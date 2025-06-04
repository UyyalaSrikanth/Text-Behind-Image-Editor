/// <reference lib="webworker" />

declare const self: Worker;

import { removeBackground } from '@imgly/background-removal';

// Handle messages from the main thread
self.onmessage = async (e) => {
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
            self.postMessage({
              type: 'PROGRESS_UPDATE',
              progress: Math.round((current / total) * 100)
            });
          }
        },
        // Optimize for mobile devices
        model: 'medium', // Use medium model for better performance
        output: {
          format: 'image/jpeg',
          quality: 0.8
        }
      });

      // Convert processed blob to base64 with compression
      const reader = new FileReader();
      reader.readAsDataURL(processedBlob);
      
      reader.onload = () => {
        // Send both processed and original images back to main thread
        self.postMessage({
          type: 'PROCESS_COMPLETE',
          processedImage: reader.result,
          originalImage: originalImage
        });
      };
    } catch (error) {
      // Send error back to main thread
      self.postMessage({
        type: 'PROCESS_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
}; 