'use client';

import { useState, useEffect } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';
import ImageGallery from '@/components/admin/ImageGallery';
import ChunkSearch from '@/components/admin/ChunkSearch';
import imageReferenceService from '@/services/imageReferenceService';
import industryService, { Industry } from '@/services/industryService';
import countriesData from '@/config/countries.json';

interface EditImageFormProps {
  image: ImageReference;
  industries: Industry[];
  onSave: (updates: { useCases: string[]; page: string; industry: string; country: string; url?: string }) => void;
  onCancel: () => void;
}

function EditImageForm({ image, industries, onSave, onCancel }: EditImageFormProps) {
  const [useCases, setUseCases] = useState<string[]>(image.useCases);
  const [page, setPage] = useState<string>(image.page);
  const [industry, setIndustry] = useState<string>(image.industry);
  const [country, setCountry] = useState<string>(image.country);
  const [url, setUrl] = useState<string>(image.url || '');
  const [useCaseInput, setUseCaseInput] = useState<string>('');

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

  const handleSave = () => {
    if (useCases.length === 0) {
      alert('Please enter at least one use case');
      return;
    }
    onSave({ useCases, page, industry, country, url: url.trim() || undefined });
  };

  return (
    <div className="space-y-4">
      {/* Use Cases */}
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
          />
          <button
            type="button"
            onClick={handleAddUseCase}
            disabled={!useCaseInput.trim()}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {/* Page Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Page Type
        </label>
        <select
          value={page}
          onChange={(e) => setPage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        >
          <option value="homepage">Homepage</option>
          <option value="collection">Collection</option>
          <option value="product">Product</option>
          <option value="cart">Cart</option>
        </select>
      </div>

      {/* Industry Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Industry
        </label>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        >
          {industries.map((industryOption) => (
            <option key={industryOption.id} value={industryOption.name}>
              {industryOption.name}
            </option>
          ))}
        </select>
      </div>

      {/* Country Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country
        </label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        >
          {countriesData.map((countryOption) => (
            <option key={countryOption.code} value={countryOption.code}>
              {countryOption.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Select the country this image reference is applicable for
        </p>
      </div>

      {/* URL Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reference URL (Optional)
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        />
        <p className="text-xs text-gray-500 mt-1">
          Add the URL of the reference site where this image is from
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={useCases.length === 0}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

interface ImageReference {
  id: string;
  imageUrl: string;
  useCases: string[];
  uploadDate: string;
  fileName: string;
  page: string;
  industry: string;
  country: string;
  url?: string; // Added url field
}

export default function ImageReferencesPage() {
  const [images, setImages] = useState<ImageReference[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [useCases, setUseCases] = useState<string[]>([]);
  const [useCaseInput, setUseCaseInput] = useState<string>('');
  const [selectedPage, setSelectedPage] = useState<string>('homepage');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('IN');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resetUpload, setResetUpload] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageReference | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  const fetchIndustries = async () => {
    try {
      const industriesData = await industryService.getAllIndustries();
      setIndustries(industriesData);
      // Set default industry if available
      if (industriesData.length > 0 && !selectedIndustry) {
        setSelectedIndustry(industriesData[0].name);
      }
    } catch (error) {
      console.error('Error fetching industries:', error);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchIndustries();
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

      const result = await imageReferenceService.uploadImage(selectedFile, useCases, selectedPage, selectedIndustry, selectedCountry, url.trim() || undefined, handleProgress);
      console.log('Upload successful:', result);

      // Reset form
      setSelectedFile(null);
      setUseCases([]);
      setUseCaseInput('');
      setSelectedPage('homepage');
      setSelectedIndustry(industries.length > 0 ? industries[0].name : '');
      setSelectedCountry('IN');
      setUrl('');
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

  const handleEditImage = (image: ImageReference) => {
    setEditingImage(image);
    setShowEditModal(true);
  };

  const handleUpdateImage = async (updates: { useCases: string[]; page: string; industry: string; country: string; url?: string }) => {
    if (!editingImage) return;

    try {
      const updatedImage = await imageReferenceService.updateImage(editingImage.id, updates);

      // Update the image in the local state
      setImages(prevImages =>
        prevImages.map(image =>
          image.id === editingImage.id ? updatedImage : image
        )
      );

      setShowEditModal(false);
      setEditingImage(null);
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Failed to update image. Please try again.');
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
      <div className="max-w-7xl mx-auto ">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Image References</h1>
          <p className="text-gray-600">
            Upload images and describe their use cases for CRO analysis
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Image Reference</h2>

          <div className="grid grid-cols-1 gap-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <ImageUpload onUpload={handleFileSelect} reset={resetUpload} />
            </div>

            {/* Use Cases Input */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

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
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Type use cases and press Enter or click Add. Each use case will be stored as a separate item.
                </p>
              </div>

              {/* Page Selection */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Type
                </label>
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="homepage">Homepage</option>
                  <option value="collection">Collection</option>
                  <option value="product">Product</option>
                  <option value="cart">Cart</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select the page type where this image reference applies.
                </p>
              </div>

              {/* Industry Selection */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  {industries.map((industry) => (
                    <option key={industry.id} value={industry.name}>
                      {industry.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select the industry this image reference belongs to.
                </p>
              </div>

              {/* Country Selection */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  {countriesData.map((countryOption) => (
                    <option key={countryOption.code} value={countryOption.code}>
                      {countryOption.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select the country this image reference is applicable for
                </p>
              </div>

              {/* URL Field */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference URL (Optional)
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add the URL of the reference site where this image is from
                </p>
              </div>
            </div>


          </div>


        </div>

        {/* Upload Button */}
        <div className="my-6">
          <button
            onClick={handleAnalyzeAndSave}
            disabled={!selectedFile || useCases.length === 0 || uploading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          <ImageGallery
            chunks={images}
            onDeleteChunk={handleDeleteImage}
            onEditChunk={handleEditImage}
          />
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Edit Image Reference</h2>

            <EditImageForm
              image={editingImage}
              industries={industries}
              onSave={handleUpdateImage}
              onCancel={() => {
                setShowEditModal(false);
                setEditingImage(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
    // </div >
  );
} 