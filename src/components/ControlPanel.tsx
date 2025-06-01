'use client';

import { FONT_OPTIONS } from '@/constants/fonts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';

export interface ControlPanelProps {
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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

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
    fontLoader.style.position = 'absolute';
    fontLoader.style.visibility = 'hidden';
    fontLoader.style.pointerEvents = 'none';
    
    FONT_OPTIONS.forEach(font => {
      const span = document.createElement('span');
      span.style.fontFamily = `"${font.value}", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`;
      span.textContent = 'Font Loader';
      fontLoader.appendChild(span);
    });
    
    document.body.appendChild(fontLoader);

    return () => {
      document.body.removeChild(fontLoader);
    };
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-2xl border border-gray-700 space-y-4 backdrop-blur-sm bg-opacity-80">
      {/* Categories */}
      <div className="space-y-2">
        {/* Text Settings Category */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button 
            onClick={() => toggleCategory('text')}
            className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors"
      >
            <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Text Settings
            </span>
        <svg 
              className={`w-5 h-5 transition-transform ${expandedCategory === 'text' ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
          {expandedCategory === 'text' && (
            <div className="p-4 space-y-3 bg-gray-900">
              {/* Text Input */}
            <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500 transition-all"
            placeholder="Enter your text"
          />
        </div>

            {/* Font Family */}
              <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Font</label>
              <select
                value={fontFamily}
                onChange={(e) => onFontFamilyChange(e.target.value)}
                  className="w-full px-3 py-2 text-base bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    fontFamily: `"${fontFamily}", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
                    fontSize: '16px'
                  }}
                >
                  {FONT_OPTIONS.map((font) => (
                    <option
                      key={font.value}
                      value={font.value}
                      style={{ 
                        fontFamily: `"${font.value}", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
                        fontSize: '16px'
                      }}
                    >
                      {font.name}
                    </option>
                  ))}
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
                  <div className="flex items-center space-x-2">
                <button
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-700 hover:border-blue-500 transition-all flex items-center justify-center"
                  style={{ backgroundColor: textColor }}
                  onClick={() => setDisplayColorPicker(!displayColorPicker)}
                  aria-label="Select text color"
                >
                  <span className="text-[10px] font-medium px-1 py-0.5 rounded bg-black bg-opacity-50 text-white">
                    {textColor.toUpperCase().replace('#', '')}
                  </span>
                </button>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => onTextColorChange(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                {displayColorPicker && (
                    <div className="fixed z-50 mt-2 p-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700" 
                         style={{ 
                           top: '50%', 
                           left: '50%', 
                           transform: 'translate(-50%, -50%)',
                           maxWidth: '90vw',
                           maxHeight: '90vh',
                           overflow: 'auto'
                         }}>
                      <div className="mb-2">
                    <SketchPicker
                      color={textColor}
                      onChange={(color) => onTextColorChange(color.hex)}
                    />
                      </div>
                      <div className="grid grid-cols-8 gap-1">
                        {[
                          '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
                          '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
                          '#008000', '#800000', '#000080', '#808080', '#A52A2A',
                          '#FFC0CB', '#4B0082', '#00FF7F', '#FF4500', '#4169E1',
                          '#FF69B4', '#32CD32', '#BA55D3', '#FF6347', '#20B2AA',
                          '#FF1493', '#00BFFF', '#FF8C00', '#8B4513', '#2E8B57',
                          '#CD853F', '#4682B4', '#DDA0DD', '#FFD700', '#4B0082'
                        ].map((color, index) => (
                          <button
                            key={`${color}-${index}`}
                            className="w-6 h-6 rounded border border-gray-700 hover:border-blue-500 transition-all"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              onTextColorChange(color);
                              setDisplayColorPicker(false);
                            }}
                            title={color}
                          />
                        ))}
                      </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          )}
            </div>

        {/* Adjust Category */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleCategory('adjust')}
            className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Adjust
            </span>
            <svg 
              className={`w-5 h-5 transition-transform ${expandedCategory === 'adjust' ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedCategory === 'adjust' && (
            <div className="p-4 space-y-3 bg-gray-900">
              {/* Text Size */}
        <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Text Size</h3>
          <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Size: {fontSize}px</label>
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
          </div>

              {/* Text Position */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Text Position</h3>
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
            </div>
          )}
        </div>

        {/* Rotation Category */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleCategory('rotation')}
            className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Rotation
            </span>
            <svg 
              className={`w-5 h-5 transition-transform ${expandedCategory === 'rotation' ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedCategory === 'rotation' && (
            <div className="p-4 space-y-4 bg-gray-900">
              {/* Text Rotation */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Text Rotation</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onRotationChange((rotation - 45 + 360) % 360)}
                    className="p-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
                    title="Rotate Left 45°"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <span className="text-sm text-gray-300">{Math.round(rotation)}°</span>
                  <button
                    onClick={() => onRotationChange((rotation + 45) % 360)}
                    className="p-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
                    title="Rotate Right 45°"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Image Rotation */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Image Rotation</label>
                <div className="flex items-center space-x-2">
                <button 
                    onClick={() => onImageRotationChange((imageRotation - 90 + 360) % 360)}
                    className="p-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
                  title="Rotate Left 90°"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                  <span className="text-sm text-gray-300">{Math.round(imageRotation)}°</span>
                <button 
                    onClick={() => onImageRotationChange((imageRotation + 90) % 360)}
                    className="p-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-all border border-gray-700"
                  title="Rotate Right 90°"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}