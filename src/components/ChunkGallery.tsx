'use client';

import { useState } from 'react';

interface AIChunk {
  id: string;
  imageUrl: string;
  useCases: string;
  uploadDate: string;
  fileName: string;
}

interface ChunkGalleryProps {
  chunks: AIChunk[];
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('/api', '');

export default function ChunkGallery({ chunks }: ChunkGalleryProps) {
  const [selectedChunk, setSelectedChunk] = useState<AIChunk | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Show 12 items per page (3 rows of 4 on xl screens)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate pagination
  const totalPages = Math.ceil(chunks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentChunks = chunks.slice(startIndex, endIndex);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedChunk(null); // Close modal when changing pages
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (chunks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No chunks found</h3>
        <p className="text-gray-500">Upload some images to get started with AI chunks.</p>
      </div>
    );
  }

  return (
    <>
      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, chunks.length)} of {chunks.length} chunks
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentChunks.map((chunk) => (
          <div
            key={chunk.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedChunk(chunk)}
          >
            {/* Image Preview */}
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              <img
                src={`${backendUrl}${chunk.imageUrl}`}
                alt="AI Chunk"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCAxMDBDNjAgODguOTU0MyA2OC45NTQzIDgwIDgwIDgwQzkxLjA0NTcgODAgMTAwIDg4Ljk1NDMgMTAwIDEwMEMxMDAgMTExLjA0NiA5MS4wNDU3IDEyMCA4MCAxMjBDNjguOTU0MyAxMjAgNjAgMTExLjA0NiA2MCAxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik04MCAxNDBDNjguOTU0MyAxNDAgNjAgMTMxLjA0NiA2MCAxMjBMMTAwIDEyMEMxMDAgMTMxLjA0NiA5MS4wNDU3IDE0MCA4MCAxNDBaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                }}
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sm text-gray-900 font-medium mb-2 line-clamp-2">
                {chunk.useCases.length > 100 
                  ? `${chunk.useCases.substring(0, 100)}...` 
                  : chunk.useCases
                }
              </p>
              
              {/* Upload Date */}
              <p className="text-xs text-gray-500">
                {formatDate(chunk.uploadDate)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <div className="flex items-center space-x-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : page === '...'
                    ? 'text-gray-400 cursor-default'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}

      {/* Modal for detailed view */}
      {selectedChunk && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Chunk Details</h3>
                <button
                  onClick={() => setSelectedChunk(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Image */}
              <div className="mb-4">
                <img
                  src={`${backendUrl}${selectedChunk.imageUrl}`}
                  alt="AI Chunk"
                  className="w-full rounded-lg"
                />
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Use Cases</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedChunk.useCases}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Upload Date</h4>
                  <p className="text-sm text-gray-700">{formatDate(selectedChunk.uploadDate)}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">File Name</h4>
                  <p className="text-sm text-gray-700 font-mono">{selectedChunk.fileName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 