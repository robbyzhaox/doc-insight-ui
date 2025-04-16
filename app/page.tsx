"use client";

import FileUpload from "@/components/FileUpload";
import TemplateSelector from "@/components/TemplateSelector";
import ExtractionResult from "@/components/ExtractionResult";
import TextHighlighter from "@/components/TextHighlighter";
import ErrorDialog from "@/components/ErrorDialog";
import { useExtraction } from "@/hooks/useExtraction";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

export default function Home() {
  const { state, handleFileSelect, handleTemplateSelect, handleExtract, clearError } =
    useExtraction();
    
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [ocrData, setOcrData] = useState<any>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  useEffect(() => {
    if (state.error) {
      setShowErrorDialog(true);
    }
  }, [state.error]);

  const handleCloseErrorDialog = useCallback(() => {
    setShowErrorDialog(false);
    // 清除错误状态
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (state.file) {
      if (imageObjectUrl) {
        URL.revokeObjectURL(imageObjectUrl);
      }
      const newObjectUrl = URL.createObjectURL(state.file);
      setImageObjectUrl(newObjectUrl);
    }
    
    return () => {
      if (imageObjectUrl) {
        URL.revokeObjectURL(imageObjectUrl);
      }
    };
  }, [state.file]);
  
  useEffect(() => {
    if (state.result && state.result.data) {
      const data = state.result.data;
      if (data && typeof data === 'object' && 'text_items' in data) {
        setOcrData(data);
      } else {
        setOcrData(null);
      }
    } else {
      setOcrData(null);
    }
  }, [state.result]);
  
  // Get image dimensions when a file is selected
  const measureImageSize = useCallback(() => {
    if (!state.file) return;

    try {
      const objectUrl = URL.createObjectURL(state.file);
      const img = new globalThis.Image();
      
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
        URL.revokeObjectURL(objectUrl);
      };
      
      img.onerror = () => {
        console.warn('Could not load image for measurement');
        setImageSize({ width: 1024, height: 768 });
        URL.revokeObjectURL(objectUrl);
      };
      
      img.src = objectUrl;
      return () => {
        img.onload = null;
        img.onerror = null;
        URL.revokeObjectURL(objectUrl);
      };
    } catch (err) {
      console.warn('Error creating object URL', err);
      setImageSize({ width: 1024, height: 768 });
    }
  }, [state.file]);
  
  useEffect(() => {
    const cleanup = measureImageSize();
    return cleanup;
  }, [measureImageSize]);
  
  useEffect(() => {
    if (state.isLoading) {
      const cleanup = measureImageSize();
      return cleanup;
    }
  }, [state.isLoading, measureImageSize]);

  return (
    <div className="h-screen p-4 flex flex-col">
      <div className="flex-1 flex overflow-hidden bg-gray-50">
        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Header */}
          <header className="flex-none m-1 bg-white border-b border-gray-200">
            <div className="px-6 py-4">
              <h1 className="text-lg font-medium">
                Smart Information Extraction
              </h1>
            </div>
          </header>

          <div className="flex-1 m-1 flex flex-col min-h-0">
            <div className="flex-1 bg-white rounded-lg shadow-sm p-4 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                {state.file && imageObjectUrl ? (
                  <div ref={imageContainerRef} className="relative w-full h-full">
                    <Image
                      src={imageObjectUrl}
                      alt="Document Preview"
                      fill
                      className="object-contain"
                      unoptimized
                      priority
                      sizes="100vw"
                      onLoad={(e) => {
                        const cleanup = measureImageSize();
                        if (cleanup) cleanup();
                        
                        setTimeout(() => {
                          const event = new Event('resize');
                          window.dispatchEvent(event);
                        }, 100);
                      }}
                    />
                    {ocrData && ocrData.text_items && (
                      <TextHighlighter 
                        key={`highlight-${ocrData.text_items.length}-${ocrData.original_width || 0}-${ocrData.original_height || 0}`}
                        textItems={ocrData.text_items}
                        imageContainerRef={imageContainerRef}
                      />
                    )}
                    <div className="absolute top-6 right-6 flex space-x-2">
                      <button className="p-2 bg-white rounded-full shadow-md">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </button>
                      <button className="p-2 bg-white rounded-full shadow-md">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 text-[#3b82f6] mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      Drag and drop an image here or click to upload
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Supports PNG, JPG, JPEG formats
                    </p>
                  </div>
                )}
                <FileUpload onFileSelect={handleFileSelect} />
              </div>
            </div>
          </div>

          <div className="m-1 flex justify-end items-end space-x-4 ml-auto flex-none">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="px-8 py-2 border border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 transition-colors cursor-pointer min-w-[120px] text-center">
                Choose File
              </div>
            </div>
            <TemplateSelector
              onSelect={handleTemplateSelect}
              selectedTemplate={state.template}
            />
            <button
              onClick={() => {
                handleExtract();
              }}
              disabled={state.isLoading || !state.file || !state.template}
              className={`
                px-8 py-2 rounded-lg font-medium transition-colors flex-none whitespace-nowrap
                ${
                  state.isLoading || !state.file || !state.template
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }
              `}
            >
              {state.isLoading ? "Processing..." : "Extract"}
            </button>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-5/12 flex-none m-1 border-l border-gray-200 bg-white overflow-y-auto h-full">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Extraction Result
              </h3>
              {state.result && (
                <ExtractionResult result={state.result} error={state.error} />
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Error Dialog */}
      {showErrorDialog && (
        <ErrorDialog
          error={state.error?.message || null}
          onClose={handleCloseErrorDialog}
        />
      )}
    </div>
  );
}
