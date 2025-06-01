'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';

interface ControlPanelProps {
  text: string;
  fontFamily: string;
  textColor: string;
  xPosition: number;
  yPosition: number;
  canvasWidth: number;
  canvasHeight: number;
  fontSize: number;
  isBold: boolean;
  rotation: number;
  onTextChange: (text: string) => void;
  onFontFamilyChange: (fontFamily: string) => void;
  onTextColorChange: (textColor: string) => void;
  onXPositionChange: (xPosition: number) => void;
  onYPositionChange: (yPosition: number) => void;
  onFontSizeChange: (fontSize: number) => void;
  onBoldChange: (isBold: boolean) => void;
  onRotationChange: (rotation: number) => void;
  onDownload: () => void;
  imageRotation: number;
  onImageRotationChange: (rotation: number) => void;
}

const FONT_OPTIONS = [
  // Basic Fonts
  { name: 'Impact', value: 'Impact' },
  { name: 'Arial', value: 'Arial' },
  { name: 'Helvetica', value: 'Helvetica' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Courier New', value: 'Courier New' },
  { name: 'Verdana', value: 'Verdana' },
  { name: 'Tahoma', value: 'Tahoma' },
  { name: 'Trebuchet MS', value: 'Trebuchet MS' },
  { name: 'Arial Black', value: 'Arial Black' },
  
  // Google Fonts - Most Reliable
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Raleway', value: 'Raleway' },
  { name: 'Ubuntu', value: 'Ubuntu' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Merriweather', value: 'Merriweather' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro' },
  
  // Cursive & Decorative - Most Reliable
  { name: 'Dancing Script', value: 'Dancing Script' },
  { name: 'Pacifico', value: 'Pacifico' },
  { name: 'Lobster', value: 'Lobster' },
  { name: 'Satisfy', value: 'Satisfy' },
  { name: 'Great Vibes', value: 'Great Vibes' },
  { name: 'Shadows Into Light', value: 'Shadows Into Light' },
  { name: 'Tangerine', value: 'Tangerine' },
  { name: 'Yellowtail', value: 'Yellowtail' }
];


function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    const later = () => {
      timeout = null;
      func.apply(context, args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  } as T;
}

export default function ControlPanel({
  text,
  fontFamily,
  textColor,
  xPosition,
  yPosition,
  canvasWidth,
  canvasHeight,
  fontSize,
  isBold,
  rotation,
  onTextChange,
  onFontFamilyChange,
  onTextColorChange,
  onXPositionChange,
  onYPositionChange,
  onFontSizeChange,
  onBoldChange,
  onRotationChange,
  onDownload,
  imageRotation,
  onImageRotationChange,
}: ControlPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, size: 0 });
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, size: fontSize };
  }, [fontSize]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaY = dragStartRef.current.y - e.clientY;
    const newSize = Math.max(10, Math.min(200, dragStartRef.current.size + deltaY));
    onFontSizeChange(newSize);
  }, [isDragging, onFontSizeChange]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleColorPickerClose = useCallback(() => setDisplayColorPicker(false), []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove as any);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove as any);
    };
  }, [isDragging, handleMouseUp, handleMouseMove]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        handleColorPickerClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleColorPickerClose]);

  const handleRotateLeft = () => onImageRotationChange((imageRotation - 90 + 360) % 360);
  const handleRotateRight = () => onImageRotationChange((imageRotation + 90) % 360);

  const debouncedOnXPositionChange = useCallback(debounce(onXPositionChange, 50), [onXPositionChange]);
  const debouncedOnYPositionChange = useCallback(debounce(onYPositionChange, 50), [onYPositionChange]);
  const debouncedOnFontSizeChange = useCallback(debounce(onFontSizeChange, 50), [onFontSizeChange]);
  const debouncedOnRotationChange = useCallback(debounce(onRotationChange, 50), [onRotationChange]);
  const debouncedOnImageRotationChange = useCallback(debounce(onImageRotationChange, 50), [onImageRotationChange]);

  useEffect(() => {
    // Force load all fonts
    const fontLoader = document.createElement('div');
    fontLoader.className = 'force-font-load';
    FONT_OPTIONS.forEach(font => {
      const span = document.createElement('span');
      span.style.fontFamily = `"${font.value}", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`;
      span.textContent = 'Font Loader';
      fontLoader.appendChild(span);
    });
    document.body.appendChild(fontLoader);

    // Cleanup
    return () => {
      document.body.removeChild(fontLoader);
    };
  }, []);

  return (
    <div className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-2xl border border-gray-700 space-y-4 backdrop-blur-sm bg-opacity-80">
      <button 
        className="sm:hidden w-full text-left font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent focus:outline-none flex items-center justify-between py-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Hide Settings' : 'Show Settings'}
        <svg 
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
        {/* Position Controls - First as requested */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Position</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">X: {xPosition}px</label>
              <input
                type="range"
                min={0}
                max={canvasWidth}
                value={xPosition}
                onChange={(e) => onXPositionChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Y: {yPosition}px</label>
              <input
                type="range"
                min={0}
                max={canvasHeight}
                value={yPosition}
                onChange={(e) => onYPositionChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Text Input - Second as requested */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Text Content</label>
          <input
            type="text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500 transition-all"
            placeholder="Enter your text"
          />
        </div>

        {/* Text Styling - Third as requested */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Text Styling</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Font Family */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Font</label>
              <select
                value={fontFamily}
                onChange={(e) => onFontFamilyChange(e.target.value)}
                className="w-full px-2 py-1.5 text-xs sm:text-sm bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {FONT_OPTIONS.map((font) => {
                  // Convert font name to class name format
                  const fontClass = font.value.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <option
                      key={font.value}
                      value={font.value}
                      className={`bg-gray-800 font-${fontClass}`}
                      style={{ 
                        fontFamily: `"${font.value}", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale'
                      }}
                    >
                      {font.name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Font Weight */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Weight</label>
              <button
                onClick={() => onBoldChange(!isBold)}
                className={`w-full px-2 py-1.5 text-xs sm:text-sm rounded-lg border transition-all ${isBold 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'}`}
              >
                {isBold ? 'Bold' : 'Normal'}
              </button>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Color</label>
              <div className="relative" ref={colorPickerRef}>
                <button
                  className="w-full h-9 rounded-lg cursor-pointer border border-gray-700 hover:border-blue-500 transition-all flex items-center justify-center"
                  style={{ backgroundColor: textColor }}
                  onClick={() => setDisplayColorPicker(!displayColorPicker)}
                  aria-label="Select text color"
                >
                  <span className="text-[10px] font-medium px-1 py-0.5 rounded bg-black bg-opacity-50 text-white">
                    {textColor.toUpperCase().replace('#', '')}
                  </span>
                </button>
                {displayColorPicker && (
                  <div className="absolute z-10 mt-1" style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}>
                    <SketchPicker
                      color={textColor}
                      onChange={(color) => onTextColorChange(color.hex)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Text Rotation */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Rotation: {Math.round(rotation)}°</label>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => debouncedOnRotationChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Other Options */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Other Settings</h2>
          
          {/* Font Size */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Font Size: {fontSize}px</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="10"
                max="300"
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div 
                className="w-8 h-8 flex items-center justify-center bg-gray-800 border border-gray-700 rounded-lg cursor-ns-resize select-none"
                onMouseDown={handleMouseDown}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Image Rotation */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Image Rotation: {Math.round(imageRotation)}°</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="360"
                value={imageRotation}
                onChange={(e) => debouncedOnImageRotationChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex space-x-1">
                <button 
                  onClick={handleRotateLeft} 
                  className="p-1.5 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
                  title="Rotate Left 90°"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
                <button 
                  onClick={handleRotateRight} 
                  className="p-1.5 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
                  title="Rotate Right 90°"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8V20m0 0l-4-4m4 4l4-4M7 4v16m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}