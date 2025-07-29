'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  reset?: boolean; // Add reset prop
}

export default function ImageUpload({ onUpload, reset = false }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      onUpload(file);
    }
  }, [onUpload]);

  // Cleanup preview URL when component unmounts or file changes
  const clearPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
  }, [previewUrl]);

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Reset state when reset prop changes to true
  useEffect(() => {
    if (reset) {
      clearPreview();
    }
  }, [reset, clearPreview]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    
    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) {
        handleFileSelect(file);
      }
    }
  }, [handleFileSelect]);

  const getStatusIcon = () => {
    if (selectedFile) {
      return (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    
    return (
      <svg
        className="w-6 h-6 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    );
  };

  const getStatusText = () => {
    if (selectedFile) {
      return `Selected: ${selectedFile.name}`;
    }
    return 'Upload an image';
  };

  return (
    <div>
      {/* Image Preview - Show when image is selected */}
      {previewUrl && (
        <div className="relative">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900">Image Preview</h3>
              <button
                type="button"
                onClick={() => {
                  clearPreview();
                  setSelectedFile(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Remove image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto max-h-64 mx-auto rounded-lg shadow-sm object-contain"
                onLoad={() => {
                  // Image loaded successfully
                }}
                onError={() => {
                  console.error('Failed to load image preview');
                }}
              />
            </div>
            {selectedFile && (
              <div className="mt-2 text-xs text-gray-500 text-center">
                <p>File: {selectedFile.name}</p>
                <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                <p>Type: {selectedFile.type}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Area - Only show when no image is selected */}
      {!previewUrl && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              {getStatusIcon()}
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-900">
                Upload an image
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Drag and drop, click to browse, or paste from clipboard
              </p>
            </div>
            
            <button
              type="button"
              onClick={handleClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Choose File
            </button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>Supported formats: JPG, PNG, GIF, WebP</p>
            <p>Max file size: 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
} 