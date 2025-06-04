'use client';

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface TextElement {
  id: string;
  text: string;
  fontFamily: string;
  textColor: string;
  xPosition: number; // Percentage 0-100 relative to image draw area
  yPosition: number; // Percentage 0-100 relative to image draw area
  fontSize: number; // Base font size (e.g., pixels relative to some reference)
  isBold: boolean;
  rotation: number; // Degrees
}

interface CanvasEditorProps {
  imageUrl: string;
  originalImageUrl: string;
  textElements: TextElement[];
  canvasWidth: number;
  canvasHeight: number;
  selectedTextId: string | null;
  onTextSelect: (id: string | null) => void;
  onTextUpdate: (updates: Partial<TextElement>) => void;
  imageRotation: number; // Degrees
  availableFonts: string[];
}

export interface CanvasEditorRef {
  downloadImage: (onComplete?: () => void) => void;
}

const CanvasEditor = forwardRef<CanvasEditorRef, CanvasEditorProps>(({
  imageUrl,
  originalImageUrl,
  textElements,
  canvasWidth,
  canvasHeight,
  selectedTextId,
  onTextSelect,
  onTextUpdate,
  imageRotation,
  availableFonts,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [processedImage, setProcessedImage] = useState<HTMLImageElement | null>(null);

  // Refs for interactive manipulation (update frequently, don't cause re-renders)
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const selectedElementRef = useRef<{ id: string; startX: number; startY: number } | null>(null);
  const currentTextElementsRef = useRef<TextElement[]>(textElements); // Keep a ref for drawing
  const currentImageRotationRef = useRef(imageRotation); // Keep a ref for drawing

  // Drawing logic
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const originalImg = originalImage;
    const processedImg = processedImage;
    // Get the latest text elements and rotation from refs for drawing
    const currentTextElements = currentTextElementsRef.current;
    const currentImageRotation = currentImageRotationRef.current;

    if (!canvas || !originalImg || !processedImg) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Calculate image dimensions while maintaining aspect ratio
    const imgRatio = originalImg.width / originalImg.height;
    const canvasRatio = canvasWidth / canvasHeight;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imgRatio > canvasRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Save context state
    ctx.save();

    // Apply image rotation
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate((currentImageRotation * Math.PI) / 180);
    ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

    // Draw original image
    ctx.drawImage(originalImg, offsetX, offsetY, drawWidth, drawHeight);

    // Draw text elements
    currentTextElements.forEach((element) => {
      const isSelected = element.id === selectedTextId;
      
      // Save context state for text
      ctx.save();
      
      // Set text properties
      // Scale font size based on the ratio of the element.fontSize (0-300) to a reference value (e.g., 100 or 200) relative to the image draw height
      // Let's assume element.fontSize 100 corresponds to a reasonable base size relative to the image height
      const baseFontSizeReference = 100; // A reference value for element.fontSize
      const scaledFontSize = (element.fontSize / baseFontSizeReference) * drawHeight * 0.2; // Adjusted scaling factor (0.2 is a guess, might need tweaking)

      ctx.font = `${element.isBold ? 'bold' : 'normal'} ${scaledFontSize}px ${element.fontFamily}, sans-serif`;
      ctx.fillStyle = element.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Calculate text position (percentages relative to image draw area)
      const x = offsetX + (element.xPosition / 100) * drawWidth;
      const y = offsetY + (element.yPosition / 100) * drawHeight;

      // Apply text rotation
      ctx.translate(x, y);
      ctx.rotate((element.rotation * Math.PI) / 180);
      
      // Draw text
      ctx.fillText(element.text, 0, 0);

      // Draw selection indicator if selected
      if (isSelected) {
        const metrics = ctx.measureText(element.text);
        // Adjust rectangle to be around the text
        const rectX = -metrics.width / 2;
        const rectY = -scaledFontSize / 2;
        const rectWidth = metrics.width;
        const rectHeight = scaledFontSize;

        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
      }

      // Restore context state
      ctx.restore();
    });

    // Draw processed image (cutout)
    ctx.drawImage(processedImg, offsetX, offsetY, drawWidth, drawHeight);

    // Restore context state
    ctx.restore();
  }, [originalImage, processedImage, selectedTextId, canvasWidth, canvasHeight]);

  // Update the ref whenever the textElements prop changes and request redraw
  useEffect(() => {
    currentTextElementsRef.current = textElements;
    requestAnimationFrame(drawCanvas);
  }, [textElements, drawCanvas]);

  // Update the ref whenever the imageRotation prop changes and request redraw
  useEffect(() => {
    currentImageRotationRef.current = imageRotation;
    requestAnimationFrame(drawCanvas);
  }, [imageRotation, drawCanvas]);

  // Load images
  useEffect(() => {
    const loadImage = (url: string, setImage: (img: HTMLImageElement | null) => void) => {
      if (!url) {
        setImage(null);
        return;
      }
      const img = new window.Image();
      img.onload = () => setImage(img);
      img.onerror = () => {
        console.error('Failed to load image:', url);
        setImage(null);
      };
      img.src = url;
    };

    loadImage(originalImageUrl, setOriginalImage);
    loadImage(imageUrl, setProcessedImage);
  }, [originalImageUrl, imageUrl]);

  // Initial draw and redraw on relevant state changes (except dragging)
  // This useEffect is now less critical for frequent updates, mainly for initial load or major changes
  useEffect(() => {
    drawCanvas();
    // Dependencies ensure initial draw and redraw on major changes like image load
  }, [originalImage, processedImage, canvasWidth, canvasHeight, drawCanvas]);

  // Expose download function through ref
  useImperativeHandle(ref, () => ({
    downloadImage: (onComplete?: () => void) => {
      const canvas = canvasRef.current;
      if (!canvas || !originalImage || !processedImage) {
        onComplete?.(); // Call onComplete even if download fails early
        return;
      }

      const tempCanvas = document.createElement('canvas');
      // Reduce scale below original image size for smaller file size (<10MB target)
      const scale = 0.5; // Adjusted scale factor to be less than 1.0
      
      // Set the temporary canvas dimensions based on the *original* image size, scaled down
      tempCanvas.width = originalImage.width * scale;
      tempCanvas.height = originalImage.height * scale;

      const ctx = tempCanvas.getContext('2d', { alpha: true });
      if (!ctx) {
         onComplete?.(); // Call onComplete if context is not available
         return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Redraw all elements onto the temporary canvas at the adjusted scale
      ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      ctx.save();

      // Draw original image - scale and position as needed for the temp canvas
      const tempCanvasAspectRatio = tempCanvas.width / tempCanvas.height;
      const imageAspectRatio = originalImage.width / originalImage.height;

      let drawWidth = tempCanvas.width;
      let drawHeight = tempCanvas.height;
      let xOffset = 0;
      let yOffset = 0;

      if (imageAspectRatio > tempCanvasAspectRatio) {
        drawHeight = tempCanvas.width / imageAspectRatio;
        yOffset = (tempCanvas.height - drawHeight) / 2;
      } else {
        drawWidth = tempCanvas.height * imageAspectRatio;
        xOffset = (tempCanvas.width - drawWidth) / 2;
      }
      
      // Apply image rotation to the drawing context for the temporary canvas
      const centerX = xOffset + drawWidth / 2;
      const centerY = yOffset + drawHeight / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate(imageRotation * Math.PI / 180);
      ctx.translate(-centerX, -centerY);

      ctx.drawImage(originalImage, xOffset, yOffset, drawWidth, drawHeight);

      // Draw text elements (intended order - behind cutout)
      textElements.forEach(element => {
        ctx.save();

        // Calculate text position relative to the scaled image on the temporary canvas
        const textRelativeX = (element.xPosition / 100) * drawWidth;
        const textRelativeY = (element.yPosition / 100) * drawHeight;

        // The actual drawing position on the temporary canvas
        const finalX = xOffset + textRelativeX;
        const finalY = yOffset + textRelativeY;

        ctx.translate(finalX, finalY);
        ctx.rotate(element.rotation * Math.PI / 180);

        // Scale font size using the same logic as the editor canvas drawing
        const baseFontSizeReference = 100; // Must match the value used in drawCanvas
        const scaledFontSize = (element.fontSize / baseFontSizeReference) * drawHeight * 0.2; // Must use the same scaling factor

        const font = `${element.isBold ? 'bold ' : ''}${scaledFontSize}px ${element.fontFamily}, sans-serif`;
        ctx.font = font;

        ctx.fillStyle = element.textColor;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(element.text, 0, 0);

        ctx.restore();
      });

      // Draw processed image (cutout) on top
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(imageRotation * Math.PI / 180);
      ctx.translate(-centerX, -centerY);
      ctx.drawImage(processedImage, xOffset, yOffset, drawWidth, drawHeight);
      ctx.restore();

      ctx.restore(); // Restore context after drawing all elements

      tempCanvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.download = 'text-behind-image.png';
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href); // Clean up
        }
        onComplete?.(); // Call onComplete after blob is processed and download triggered
      }, 'image/png', 0.8); // Keeping quality at 0.8
    },
  }));

  // Add this utility function before the component
  const constrainTextPosition = (
    xPercent: number,
    yPercent: number,
    element: TextElement,
    drawWidth: number,
    drawHeight: number,
    ctx: CanvasRenderingContext2D
  ) => {
    // Calculate text dimensions
    const baseFontSizeReference = 100;
    const scaledFontSize = (element.fontSize / baseFontSizeReference) * drawHeight * 0.2;
    ctx.font = `${element.isBold ? 'bold' : 'normal'} ${scaledFontSize}px ${element.fontFamily}, sans-serif`;
    const metrics = ctx.measureText(element.text);

    // Calculate text bounds considering rotation
    const halfTextWidth = metrics.width / 2;
    const halfTextHeight = scaledFontSize / 2;
    const cos = Math.cos(element.rotation * Math.PI / 180);
    const sin = Math.sin(element.rotation * Math.PI / 180);

    // Calculate rotated text dimensions
    const rotatedWidth = Math.abs(halfTextWidth * cos) + Math.abs(halfTextHeight * sin);
    const rotatedHeight = Math.abs(halfTextWidth * sin) + Math.abs(halfTextHeight * cos);

    // Calculate bounds in percentage
    const minX = (rotatedWidth / drawWidth) * 50;
    const maxX = 100 - minX;
    const minY = (rotatedHeight / drawHeight) * 50;
    const maxY = 100 - minY;

    // Clamp positions
    return {
      xPosition: Math.max(minX, Math.min(maxX, xPercent)),
      yPosition: Math.max(minY, Math.min(maxY, yPercent))
    };
  };

  // Mouse down handler - initiate drag or selection
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const currentTextElements = currentTextElementsRef.current;
    if (!canvas || !originalImage || !processedImage) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate image draw area on the canvas
    const imgRatio = originalImage.width / originalImage.height;
    const canvasRatio = canvas.width / canvas.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imgRatio > canvasRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    // Check if clicked on any text element (iterating in reverse to select top-most if overlapping)
    let clickedElement: TextElement | undefined = undefined;
    for (let i = currentTextElements.length - 1; i >= 0; i--) {
        const element = currentTextElements[i];
        const ctx = canvas.getContext('2d');
        if (!ctx) continue; // Skip if no context

        // Temporarily set font for accurate measurement
         const baseFontSizeReference = 100; // Must match drawCanvas
         const scaledFontSize = (element.fontSize / baseFontSizeReference) * drawHeight * 0.2; // Must match drawCanvas
         const font = `${element.isBold ? 'bold' : 'normal'} ${scaledFontSize}px ${element.fontFamily}, sans-serif`;
         ctx.font = font;

        const metrics = ctx.measureText(element.text);

        // Calculate text position on canvas (center of the text)
        const elementCenterX = offsetX + (element.xPosition / 100) * drawWidth;
        const elementCenterY = offsetY + (element.yPosition / 100) * drawHeight;

        // Calculate the bounding box considering rotation
        const halfTextWidth = metrics.width / 2;
        const halfTextHeight = scaledFontSize / 2; // Approximate height

        // Points of the unrotated bounding box relative to the center
        const points = [
            { x: -halfTextWidth, y: -halfTextHeight },
            { x: halfTextWidth, y: -halfTextHeight },
            { x: halfTextWidth, y: halfTextHeight },
            { x: -halfTextWidth, y: halfTextHeight },
        ];

        // Apply rotation to points
        const cos = Math.cos(element.rotation * Math.PI / 180);
        const sin = Math.sin(element.rotation * Math.PI / 180);

        const rotatedPoints = points.map(p => ({
            x: p.x * cos - p.y * sin,
            y: p.x * sin + p.y * cos,
        }));

        // Translate rotated points to their absolute position on the canvas
        const absolutePoints = rotatedPoints.map(p => ({
            x: p.x + elementCenterX,
            y: p.y + elementCenterY,
        }));

        // Let's use the transform approach for better accuracy with rotation:
        // 1. Translate click point so text center is the origin
        const translatedX = x - elementCenterX;
        const translatedY = y - elementCenterY;

        // 2. Rotate click point back by the element's rotation (inverse rotation)
        const inverseCos = Math.cos(-element.rotation * Math.PI / 180);
        const inverseSin = Math.sin(-element.rotation * Math.PI / 180);

        const unrotatedClickX = translatedX * inverseCos - translatedY * inverseSin;
        const unrotatedClickY = translatedX * inverseSin + translatedY * inverseCos;

        // 3. Check if the unrotated click point is within the unrotated bounding box
        if (unrotatedClickX >= -halfTextWidth && unrotatedClickX <= halfTextWidth &&
            unrotatedClickY >= -halfTextHeight && unrotatedClickY <= halfTextHeight) {
            clickedElement = element;
            break; // Found the top-most clicked element
        }
    }

    if (clickedElement) {
      // Store initial drag info in refs
      selectedElementRef.current = { id: clickedElement.id, startX: x, startY: y };
      isDraggingRef.current = true;
      dragStartRef.current = { x, y };
      onTextSelect(clickedElement.id); // Select the clicked element

      // Prevent default to avoid browser drag behavior
      e.preventDefault();
    } else {
      // If click is not on a text element, deselect text
      // onTextSelect(null);
    }
  };

  // Update the handleMouseMove function
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !selectedElementRef.current || !originalImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - dragStartRef.current.x;
    const dy = y - dragStartRef.current.y;

    // Calculate image draw area
    const imgRatio = originalImage.width / originalImage.height;
    const canvasRatio = canvas.width / canvas.height;
    
    let drawWidth, drawHeight;
    
    if (imgRatio > canvasRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
    }

    const offsetX = (canvas.width - drawWidth) / 2;
    const offsetY = (canvas.height - drawHeight) / 2;

    // Find the element being dragged
    const elementToUpdateIndex = currentTextElementsRef.current.findIndex(el => el.id === selectedElementRef.current?.id);
    if (elementToUpdateIndex === -1) return;

    const currentElement = currentTextElementsRef.current[elementToUpdateIndex];
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get current position
    const currentPixelX = offsetX + (currentElement.xPosition / 100) * drawWidth;
    const currentPixelY = offsetY + (currentElement.yPosition / 100) * drawHeight;

    // Calculate new position
    const newPixelX = currentPixelX + dx;
    const newPixelY = currentPixelY + dy;

    // Convert to percentages
    const newXPercent = ((newPixelX - offsetX) / drawWidth) * 100;
    const newYPercent = ((newPixelY - offsetY) / drawHeight) * 100;

    // Constrain position
    const constrainedPosition = constrainTextPosition(
      newXPercent,
      newYPercent,
      currentElement,
      drawWidth,
      drawHeight,
      ctx
    );

    // Update element position
    const updatedElements = [...currentTextElementsRef.current];
    const elementToUpdate = { ...updatedElements[elementToUpdateIndex] };
    elementToUpdate.xPosition = constrainedPosition.xPosition;
    elementToUpdate.yPosition = constrainedPosition.yPosition;
    updatedElements[elementToUpdateIndex] = elementToUpdate;

    // Update ref and redraw
    currentTextElementsRef.current = updatedElements;
    requestAnimationFrame(drawCanvas);

    // Update drag start for next move
    dragStartRef.current = { x, y };
  }, [originalImage, drawCanvas]);

  // Add this effect to handle X/Y axis updates
  useEffect(() => {
    if (!canvasRef.current || !originalImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate image draw area
    const imgRatio = originalImage.width / originalImage.height;
    const canvasRatio = canvas.width / canvas.height;
    
    let drawWidth, drawHeight;
    
    if (imgRatio > canvasRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
    }

    // Update text positions with constraints
    const updatedElements = textElements.map(element => {
      const constrainedPosition = constrainTextPosition(
        element.xPosition,
        element.yPosition,
        element,
        drawWidth,
        drawHeight,
        ctx
      );

      return {
        ...element,
        xPosition: constrainedPosition.xPosition,
        yPosition: constrainedPosition.yPosition
      };
    });

    // Only update if positions actually changed
    if (JSON.stringify(updatedElements) !== JSON.stringify(textElements)) {
      currentTextElementsRef.current = updatedElements;
      requestAnimationFrame(drawCanvas);
    }
  }, [textElements, originalImage, drawCanvas]);

  
  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current && selectedElementRef.current) {
      // Find the final position from the ref and update the state
      const finalElement = currentTextElementsRef.current.find(el => el.id === selectedElementRef.current?.id);
      if (finalElement) {
        // Call the prop function to update the parent state with the final position
        onTextUpdate({ 
          xPosition: finalElement.xPosition,
          yPosition: finalElement.yPosition,
        });
      }
    }

    // Reset refs
    isDraggingRef.current = false;
    selectedElementRef.current = null;
  }, [onTextUpdate]); // Added onTextUpdate to dependencies

 
   useEffect(() => {
     // Mouse listeners
     window.addEventListener('mousemove', handleMouseMove as any); // Cast to any due to differing event types
     window.addEventListener('mouseup', handleMouseUp as any); // Cast to any due to differing event types

   
     // Clean up listeners
     return () => {
       // Mouse listeners cleanup
       window.removeEventListener('mousemove', handleMouseMove as any);
       window.removeEventListener('mouseup', handleMouseUp as any);

       
     };
     // Include all handlers as dependencies
   }, [handleMouseMove, handleMouseUp]); // Removed touch handlers from dependencies

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="border border-gray-700 rounded-lg"
        onMouseDown={handleMouseDown}
   
      />
    </div>
  );
});

CanvasEditor.displayName = 'CanvasEditor';

export default CanvasEditor; 