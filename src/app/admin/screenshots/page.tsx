'use client';

import React, { useState, useEffect } from 'react';
import { TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import screenshotService, { Screenshot } from '@/services/screenshotService';

export default function ScreenshotsPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  useEffect(() => {
    loadScreenshots();
  }, []);

  const loadScreenshots = async () => {
    try {
      setLoading(true);
      const response = await screenshotService.listScreenshots();
      setScreenshots(response.screenshots);
    } catch (error) {
      console.error('Error loading screenshots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm('Are you sure you want to delete this screenshot?')) {
      return;
    }

    try {
      setDeleting(filename);
      await screenshotService.deleteScreenshot(filename);
      setScreenshots(screenshots.filter(s => s.filename !== filename));
    } catch (error) {
      console.error('Error deleting screenshot:', error);
      alert('Failed to delete screenshot');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm(`Are you sure you want to delete all ${screenshots.length} screenshots? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingAll(true);
      await screenshotService.deleteAllScreenshots();
      setScreenshots([]);
    } catch (error) {
      console.error('Error deleting all screenshots:', error);
      alert('Failed to delete all screenshots');
    } finally {
      setDeletingAll(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Screenshots</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {screenshots.length} screenshot{screenshots.length !== 1 ? 's' : ''}
          </div>
          {screenshots.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={deletingAll}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <TrashIcon className="h-4 w-4" />
              <span>{deletingAll ? 'Deleting...' : 'Delete All'}</span>
            </button>
          )}
        </div>
      </div>

      {screenshots.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No screenshots found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {screenshots.map((screenshot) => (
            <div
              key={screenshot.filename}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="aspect-video bg-gray-100 relative group">
                <img
                  src={screenshotService.getScreenshotUrl(screenshot.filename)}
                  alt={screenshot.filename}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() => setSelectedImage(screenshot.filename)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    <button
                      onClick={() => setSelectedImage(screenshot.filename)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                    >
                      <EyeIcon className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDelete(screenshot.filename)}
                      disabled={deleting === screenshot.filename}
                      className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 disabled:opacity-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {screenshot.filename}
                </h3>
                <div className="mt-2 text-xs text-gray-500 space-y-1">
                  <p>Size: {formatFileSize(screenshot.size)}</p>
                  <p>Modified: {formatDate(screenshot.modifiedAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={screenshotService.getScreenshotUrl(selectedImage)}
              alt={selectedImage}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
} 