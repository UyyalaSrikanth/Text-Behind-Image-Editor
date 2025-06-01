'use client';

import CanvasEditor, { CanvasEditorRef } from '@/components/CanvasEditor';
import ControlPanel from '@/components/ControlPanel';
import ImageUploader from '@/components/ImageUploader';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface TextElement {
  id: string;
  text: string;
  fontFamily: string;
  textColor: string;
  xPosition: number;
  yPosition: number;
  fontSize: number;
  isBold: boolean;
  rotation: number;
}

export default function Editor() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [imageRotation, setImageRotation] = useState(0);
  const canvasEditorRef = useRef<CanvasEditorRef>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const handleImageProcessed = (processed: string, original: string) => {
    setImageUrl(processed);
    setOriginalImageUrl(original);
    // Add default text element
    const defaultTextElement: TextElement = {
      id: '1',
      text: 'Edit',
      fontFamily: 'Impact',
      textColor: '#FFFFFF',
      xPosition: 50,
      yPosition: 50,
      fontSize: 120,
      isBold: true,
      rotation: 0,
    };
    setTextElements([defaultTextElement]);
    setSelectedTextId('1');
  };

  const updateTextElement = (updates: Partial<TextElement>) => {
    setTextElements(prev =>
      prev.map(element =>
        element.id === selectedTextId
          ? { ...element, ...updates }
          : element
      )
    );
  };
 
  const deleteSelectedText = () => {
    if (selectedTextId) {
      setTextElements(prev => prev.filter(element => element.id !== selectedTextId));
      setSelectedTextId(null);
    }
  };

  const handleImageRotationChange = (rotation: number) => {
    setImageRotation(rotation);
  };

  const addNewText = () => {
    const newId = (textElements.length + 1).toString();
    const newTextElement: TextElement = {
      id: newId,
      text: 'New Text',
      fontFamily: 'Impact',
      textColor: '#FFFFFF',
      xPosition: 50,
      yPosition: 50,
      fontSize: 120,
      isBold: true,
      rotation: 0,
    };
    setTextElements(prev => [...prev, newTextElement]);
    setSelectedTextId(newId);
  };

  const selectedText = textElements.find(element => element.id === selectedTextId);

  // Effect to update canvas dimensions based on container size and image aspect ratio
  useEffect(() => {
    const container = canvasContainerRef.current;
    const originalImg = new window.Image();

    originalImg.onload = () => {
      if (container) {
        const containerWidth = container.offsetWidth;
        const imageAspectRatio = originalImg.width / originalImg.height;

        // Calculate canvas height based on container width and image aspect ratio
        const calculatedHeight = containerWidth / imageAspectRatio;

        // Set canvas dimensions, ensuring it doesn't exceed a reasonable max height if needed
        // For responsiveness, we primarily want width to fill container and height to follow aspect ratio
        setCanvasWidth(containerWidth);
        setCanvasHeight(calculatedHeight);
      }
    };

    // Load the original image to get its dimensions for aspect ratio calculation
    if (originalImageUrl) {
      originalImg.src = originalImageUrl;
    }

    

  }, [originalImageUrl]); // Recalculate when original image changes or container is found

  const handleDownload = () => {
    setIsDownloading(true);
    canvasEditorRef.current?.downloadImage(() => {
      setIsDownloading(false);
    });
  };

  const handleCanvasWidthChange = (width: number) => {
    setCanvasWidth(width);
  };

  const handleCanvasHeightChange = (height: number) => {
    setCanvasHeight(height);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="p-4 md:p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <Link 
              href="/"
              className="text-gray-300 hover:text-primary-400 flex items-center group transition-all"
            >
             <svg
  className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth={2}
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M3 9.75L12 3l9 6.75V21a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 21V9.75z" />
  <path d="M9 22.5v-6h6v6" />
</svg>

            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Text Behind Image Editor
            </h1>
          </div>

          {!imageUrl ? (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <ImageUploader onImageProcessed={handleImageProcessed} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column - Canvas */}
              <div className="lg:col-span-2 space-y-4">
                <div 
                  ref={canvasContainerRef}
                  className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 flex justify-center items-center"
                >
                  <CanvasEditor
                    ref={canvasEditorRef}
                    imageUrl={imageUrl}
                    originalImageUrl={originalImageUrl!}
                    textElements={textElements}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                    selectedTextId={selectedTextId}
                    onTextSelect={setSelectedTextId}
                    onTextUpdate={updateTextElement}
                    imageRotation={imageRotation}
                  />
                </div>
              </div>

              {/* Right Column - Controls */}
              <div className="lg:col-span-1 space-y-4">
                {/* Text Elements List */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 space-x-0 sm:space-x-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Text Elements
                      </h3>
                      <div className="flex space-x-2 flex-wrap justify-center sm:justify-start">
                        <button
                          onClick={addNewText}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                        >
                          Add Text
                        </button>
                        {textElements.length > 0 && (
                          <button
                            onClick={deleteSelectedText}
                            className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2 overflow-x-auto pb-2">
                    {textElements.map((element) => (
                      <button
                        key={element.id}
                        onClick={() => setSelectedTextId(element.id)}
                        className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap shadow-md ${
                          element.id === selectedTextId
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        {element.text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Control Panel */}
                {selectedText && (
                  <ControlPanel
                    text={selectedText.text}
                    fontFamily={selectedText.fontFamily}
                    textColor={selectedText.textColor}
                    xPosition={selectedText.xPosition}
                    yPosition={selectedText.yPosition}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                    fontSize={selectedText.fontSize}
                    isBold={selectedText.isBold}
                    rotation={selectedText.rotation}
                    onTextChange={(text) => updateTextElement({ text })}
                    onFontFamilyChange={(fontFamily) => updateTextElement({ fontFamily })}
                    onTextColorChange={(textColor) => updateTextElement({ textColor })}
                    onXPositionChange={(xPosition) => updateTextElement({ xPosition })}
                    onYPositionChange={(yPosition) => updateTextElement({ yPosition })}
                    onFontSizeChange={(fontSize) => updateTextElement({ fontSize })}
                    onBoldChange={(isBold) => updateTextElement({ isBold })}
                    onRotationChange={(rotation) => updateTextElement({ rotation })}
                    onDownload={handleDownload}
                    imageRotation={imageRotation}
                    onImageRotationChange={handleImageRotationChange}
                    onCanvasWidthChange={handleCanvasWidthChange}
                    onCanvasHeightChange={handleCanvasHeightChange}
                  />
                )}
              </div>
            </div>
          )}
           {/* Download button placed below the grid, visible on all screen sizes but styled for mobile prominence */}
           {imageUrl && (
             <div className="mt-8 text-center">
                <button
                  onClick={handleDownload}
                  className={`w-full sm:w-auto px-8 py-3 rounded-lg text-lg font-semibold transition-all shadow-md ${isDownloading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'}`}
                  disabled={isDownloading} // Disable button while downloading
                >
                  {isDownloading ? 'Downloading Image...' : 'Download Edited Image'}
                </button>
             </div>
           )}
        </div>
      </div>
    </main>
  );
} 