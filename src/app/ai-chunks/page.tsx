'use client';

import { useState, useRef, useEffect } from 'react';
import ImageUpload from '@/components/ImageUpload';
import ChunkGallery from '@/components/ChunkGallery';
import ChunkSearch from '@/components/ChunkSearch';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import aiChunkService from '@/services/aiChunkService';

interface AIChunk {
  id: string;
  imageUrl: string;
  useCases: string;
  uploadDate: string;
  fileName: string;
}

export default function AIChunksPage() {
  const { logout } = useAuth();
  const [chunks, setChunks] = useState<AIChunk[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [useCases, setUseCases] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchChunks = async () => {
    setLoading(true);
    try {
      const chunks = await aiChunkService.getAllChunks();
      setChunks(chunks);
    } catch (error) {
      console.error('Error fetching chunks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChunks();
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleAnalyzeAndSave = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    if (!useCases.trim()) {
      alert('Please enter use cases for this image');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const handleProgress = (progress: number) => {
        setUploadProgress(progress);
      };
      
      const result = await aiChunkService.uploadImage(selectedFile, useCases, handleProgress);
      console.log('Upload successful:', result);
      
      // Reset form
      setSelectedFile(null);
      setUseCases('');
      
      // Refresh the chunks list
      fetchChunks();
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
        const searchResults = await aiChunkService.searchChunks(query);
        setChunks(searchResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      fetchChunks();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchChunks();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Chunks</h1>
            <p className="text-gray-600">
              Upload images and describe their use cases for CRO analysis
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            🚪 Logout
          </button>
        </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Chunk</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <ImageUpload onUpload={handleFileSelect} />
              </div>

              {/* Use Cases Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Use Cases & Problems This Solves
                </label>
                <textarea
                  value={useCases}
                  onChange={(e) => setUseCases(e.target.value)}
                  placeholder="Describe the use cases, problems this image solves, scenarios where it can be used, etc..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none text-black"
                  disabled={uploading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be descriptive about when and how this image can be used in CRO analysis
                </p>
              </div>
            </div>

            {/* Upload Button */}
            <div className="mt-6">
              <button
                onClick={handleAnalyzeAndSave}
                disabled={!selectedFile || !useCases.trim() || uploading}
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
                  'Upload Chunk'
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
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Chunks'}
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <ChunkGallery chunks={chunks} />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 