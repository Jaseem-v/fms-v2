'use client';

import { useState, useEffect } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';
import ImageGallery from '@/components/admin/ImageGallery';
import ChunkSearch from '@/components/admin/ChunkSearch';
import imageReferenceService from '@/services/imageReferenceService';

interface ImageReference {
  id: string;
  imageUrl: string;
  useCases: string[];
  uploadDate: string;
  fileName: string;
}

export default function ImageReferencesPage() {
  const [images, setImages] = useState<ImageReference[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [useCases, setUseCases] = useState<string[]>([]);
  const [useCaseInput, setUseCaseInput] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resetUpload, setResetUpload] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const images = await imageReferenceService.getAllImages();
      setImages(images);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Reset the resetUpload flag after ImageUpload component has been reset
  useEffect(() => {
    if (resetUpload) {
      // Reset the flag after a short delay to ensure the ImageUpload component has processed the reset
      const timer = setTimeout(() => {
        setResetUpload(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [resetUpload]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleAnalyzeAndSave = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    if (useCases.length === 0) {
      alert('Please enter at least one use case for this image');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const handleProgress = (progress: number) => {
        setUploadProgress(progress);
      };
      
      const result = await imageReferenceService.uploadImage(selectedFile, useCases, handleProgress);
      console.log('Upload successful:', result);
      
      // Reset form
      setSelectedFile(null);
      setUseCases([]);
      setUseCaseInput('');
      setResetUpload(true); // Trigger reset of ImageUpload component
      
      // Refresh the images list
      fetchImages();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setLoading(true);
      try {
        const searchResults = await imageReferenceService.searchImages(query);
        setImages(searchResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      fetchImages();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchImages();
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const success = await imageReferenceService.deleteImage(imageId);
      if (success) {
        // Remove the image from the local state
        setImages(prevImages => prevImages.filter(image => image.id !== imageId));
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error; // Re-throw to be handled by the component
    }
  };

  const handleAddUseCase = () => {
    const trimmedInput = useCaseInput.trim();
    if (trimmedInput && !useCases.includes(trimmedInput)) {
      setUseCases(prev => [...prev, trimmedInput]);
      setUseCaseInput('');
    }
  };

  const handleRemoveUseCase = (index: number) => {
    setUseCases(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUseCase();
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Image References</h1>
          <p className="text-gray-600">
            Upload images and describe their use cases for CRO analysis
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Image Reference</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <ImageUpload onUpload={handleFileSelect} reset={resetUpload} />
            </div>

            {/* Use Cases Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Use Cases & Problems This Solves
              </label>
              
              {/* Use Cases Tags */}
              {useCases.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {useCases.map((useCase, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {useCase}
                      <button
                        type="button"
                        onClick={() => handleRemoveUseCase(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        disabled={uploading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              {/* Input Field */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={useCaseInput}
                  onChange={(e) => setUseCaseInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a use case and press Enter to add..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  disabled={uploading}
                />
                <button
                  type="button"
                  onClick={handleAddUseCase}
                  disabled={!useCaseInput.trim() || uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Type use cases and press Enter or click Add. Each use case will be stored as a separate item.
              </p>
            </div>
          </div>

          {/* Upload Button */}
          <div className="mt-6">
            <button
              onClick={handleAnalyzeAndSave}
              disabled={!selectedFile || useCases.length === 0 || uploading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading... {uploadProgress}%
                </>
              ) : (
                'Upload Image Reference'
              )}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <ChunkSearch onSearch={handleSearch} onClear={handleClearSearch} />
        </div>

        {/* Gallery Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Image References'}
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <ImageGallery chunks={images} onDeleteChunk={handleDeleteImage} />
          )}
        </div>
      </div>
    </div>
  );
} 