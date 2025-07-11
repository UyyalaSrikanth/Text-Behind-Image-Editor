'use client';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
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
  opacity: number;
  is3D: boolean;
  depth: number;
  perspective: number;
  shadowColor: string;
  shadowEnabled: boolean;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  onTextChange: (text: string) => void;
  onFontFamilyChange: (fontFamily: string) => void;
  onTextColorChange: (textColor: string) => void;
  onXPositionChange: (xPosition: number) => void;
  onYPositionChange: (yPosition: number) => void;
  onFontSizeChange: (fontSize: number) => void;
  onBoldChange: (isBold: boolean) => void;
  onRotationChange: (rotation: number) => void;
  onOpacityChange: (opacity: number) => void;
  on3DChange: (is3D: boolean) => void;
  onDepthChange: (depth: number) => void;
  onPerspectiveChange: (perspective: number) => void;
  onShadowColorChange: (shadowColor: string) => void;
  onShadowEnabledChange: (enabled: boolean) => void;
  onShadowBlurChange: (blur: number) => void;
  onShadowOffsetXChange: (offset: number) => void;
  onShadowOffsetYChange: (offset: number) => void;
  onDownload: () => void;
  imageRotation: number;
  onImageRotationChange: (rotation: number) => void;
  mainRef: RefObject<HTMLElement | null>;
  availableFonts: string[];
  disabled?: boolean;
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
  text = '',
  fontFamily = 'Arial',
  textColor = '#000000',
  xPosition = 50,
  yPosition = 50,
  canvasWidth = 800,
  canvasHeight = 600,
  fontSize = 100,
  isBold = false,
  rotation = 0,
  opacity = 1,
  is3D = false,
  depth = 10,
  perspective = 45,
  shadowColor = '#000000',
  shadowEnabled = false,
  shadowBlur = 5,
  shadowOffsetX = 0,
  shadowOffsetY = 0,
  onTextChange,
  onFontFamilyChange,
  onTextColorChange,
  onXPositionChange,
  onYPositionChange,
  onFontSizeChange,
  onBoldChange,
  onRotationChange,
  onOpacityChange,
  on3DChange,
  onDepthChange,
  onPerspectiveChange,
  onShadowColorChange,
  onShadowEnabledChange,
  onShadowBlurChange,
  onShadowOffsetXChange,
  onShadowOffsetYChange,
  onDownload,
  imageRotation = 0,
  onImageRotationChange,
  mainRef,
  availableFonts = [],
  disabled = false
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
    const loadFont = (fontFamily: string) => {
      // For system fonts like Comic Sans MS, we don't need to load them from Google Fonts
      const systemFonts = [
        'Arial',
        'Helvetica',
        'Times New Roman',
        'Courier New',
        'Georgia',
        'Verdana',
        'Tahoma',
        'Trebuchet MS',
        'Impact',
        'Comic Sans MS'
      ];

      if (systemFonts.includes(fontFamily)) {
        // System font, no need to load
        if (mainRef.current) {
          const event = new Event('fontloaded');
          mainRef.current.dispatchEvent(event);
        }
        return;
      }

      // For Google Fonts
      if (document.fonts.check(`1em "${fontFamily}"`)) {
        return;
      }

      const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;700&display=swap`;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontUrl;
      link.crossOrigin = 'anonymous';

      const handleLoad = () => {
        if (mainRef.current) {
          const event = new Event('fontloaded');
          mainRef.current.dispatchEvent(event);
        }
      };

      const handleError = (error: ErrorEvent) => {
        console.error(`Failed to load font ${fontFamily}:`, error);
        onFontFamilyChange('Arial');
      };

      link.addEventListener('load', handleLoad);
      link.addEventListener('error', handleError);
      document.head.appendChild(link);

      return () => {
        link.removeEventListener('load', handleLoad);
        link.removeEventListener('error', handleError);
        document.head.removeChild(link);
      };
    };

    if (fontFamily) {
      loadFont(fontFamily);
    }
  }, [fontFamily, onFontFamilyChange, mainRef]);

  useEffect(() => {
    const preloadFonts = () => {
      const systemFonts = [
        'Arial',
        'Helvetica',
        'Times New Roman',
        'Courier New',
        'Georgia',
        'Verdana',
        'Tahoma',
        'Trebuchet MS',
        'Impact',
        'Comic Sans MS'
      ];

      // Only preload Google Fonts
      availableFonts.forEach(font => {
        if (!systemFonts.includes(font)) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;700&display=swap`;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      });
    };

    preloadFonts();
  }, [availableFonts]);

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
                    fontFamily: fontFamily,
                    fontSize: '16px'
                  }}
                >
                  {availableFonts.map((font) => (
                    <option
                      key={font}
                      value={font}
                      style={{ 
                        fontFamily: font,
                        fontSize: '16px',
                        padding: '8px'
                      }}
                    >
                      {font}
                    </option>
                  ))}
                </select>
                <div className="mt-2 text-sm text-gray-400">
                  Preview: <span style={{ fontFamily: fontFamily, fontSize: '16px' }}>{fontFamily}</span>
                </div>
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

              {/* Text Opacity */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Text Opacity</h3>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                    Opacity: {Math.round((opacity || 0) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.max(0, Math.min(100, (opacity || 0) * 100))}
                    onChange={(e) => onOpacityChange(Math.max(0, Math.min(1, Number(e.target.value) / 100)))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
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

              {/* 3D Text Controls */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">3D Text</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-300">Enable 3D</span>
                  <button
                    onClick={() => on3DChange(!is3D)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      is3D 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {is3D ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                {is3D && (
                  <>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                        Depth: {depth || 0}px
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={Math.max(1, Math.min(50, depth || 0))}
                        onChange={(e) => onDepthChange(Math.max(1, Math.min(50, Number(e.target.value))))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                        Perspective: {perspective || 0}°
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="90"
                        value={Math.max(0, Math.min(90, perspective || 0))}
                        onChange={(e) => onPerspectiveChange(Math.max(0, Math.min(90, Number(e.target.value))))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Shadow Controls */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-300">Text Shadow</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-300">Enable Shadow</span>
                  <button
                    onClick={() => onShadowEnabledChange(!shadowEnabled)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      shadowEnabled 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {shadowEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                {shadowEnabled && (
                  <>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Shadow Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={shadowColor}
                          onChange={(e) => onShadowColorChange(e.target.value)}
                          className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-700 hover:border-blue-500 transition-all"
                        />
                        <input
                          type="text"
                          value={shadowColor}
                          onChange={(e) => onShadowColorChange(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Blur: {shadowBlur || 0}px</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={Math.max(0, Math.min(50, shadowBlur || 0))}
                        onChange={(e) => onShadowBlurChange(Math.max(0, Math.min(50, Number(e.target.value))))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Offset X: {shadowOffsetX || 0}px</label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={Math.max(-50, Math.min(50, shadowOffsetX || 0))}
                        onChange={(e) => onShadowOffsetXChange(Math.max(-50, Math.min(50, Number(e.target.value))))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Offset Y: {shadowOffsetY || 0}px</label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={Math.max(-50, Math.min(50, shadowOffsetY || 0))}
                        onChange={(e) => onShadowOffsetYChange(Math.max(-50, Math.min(50, Number(e.target.value))))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  </>
                )}
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