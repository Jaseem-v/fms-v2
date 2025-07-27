'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import appReferenceService, { AppReference, ScrapedAppData } from '@/services/appReferenceService';

export default function AppReferencePage() {
  const [appReferences, setAppReferences] = useState<AppReference[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<ScrapedAppData | null>(null);
  const [previewApp, setPreviewApp] = useState<AppReference | null>(null);
  const [formData, setFormData] = useState({
    appUrl: '',
    useCases: [] as string[],
    page: 'homepage'
  });
  const [useCaseInput, setUseCaseInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchAppReferences();
  }, []);

  const fetchAppReferences = async () => {
    setLoading(true);
    try {
      const data = await appReferenceService.getAllAppReferences();
      setAppReferences(data);
    } catch (error) {
      console.error('Error fetching app references:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddApp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.useCases.length === 0) {
      alert('Please add at least one use case');
      return;
    }
    
    setLoading(true);

    try {
      const newApp = await appReferenceService.addAppReference(formData.appUrl, formData.useCases, formData.page);
      setAppReferences(prev => [...prev, newApp]);
      setShowAddModal(false);
      setFormData({ appUrl: '', useCases: [], page: 'homepage' });
      setUseCaseInput('');
    } catch (error) {
      console.error('Error adding app reference:', error);
      alert('Failed to add app reference');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUseCase = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && useCaseInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        useCases: [...prev.useCases, useCaseInput.trim()]
      }));
      setUseCaseInput('');
    }
  };

  const handleRemoveUseCase = (index: number) => {
    setFormData(prev => ({
      ...prev,
      useCases: prev.useCases.filter((_, i) => i !== index)
    }));
  };

  const handlePreviewScrape = async () => {
    if (!previewUrl) return;

    setLoading(true);
    try {
      const data = await appReferenceService.scrapeAppData(previewUrl);
      setPreviewData(data);
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error scraping app data:', error);
      alert('Failed to scrape app data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApp = async (id: string) => {
    if (!confirm('Are you sure you want to delete this app reference?')) return;

    try {
      const success = await appReferenceService.deleteAppReference(id);
      if (success) {
        setAppReferences(prev => prev.filter(app => app.id !== id));
      }
    } catch (error) {
      console.error('Error deleting app reference:', error);
      alert('Failed to delete app reference');
    }
  };

  const filteredApps = appReferences.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(appReferences.map(app => app.category)))];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">App References</h1>
          <p className="mt-2 text-gray-600">Manage Shopify app references for analysis suggestions</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <input
              type="text"
              placeholder="Search apps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add App Reference
          </button>
        </div>

        {/* Preview Scrape */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-black">Preview Scrape</h3>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Enter Shopify app URL to preview... "
              value={previewUrl}
              onChange={(e) => setPreviewUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
            <button
              onClick={handlePreviewScrape}
              disabled={loading || !previewUrl}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Scraping...' : 'Preview'}
            </button>
          </div>
        </div>

        {/* App References List */}
        {loading && appReferences.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading app references...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No app references found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {app.iconUrl && (
                        <img
                          src={app.iconUrl}
                          alt={app.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {app.category}
                          </span>
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full capitalize">
                            {app.page}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setPreviewApp(app);
                          setShowPreviewModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Preview"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteApp(app.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {app.description}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Use Cases:</h4>
                    <div className="flex flex-wrap gap-1">
                      {app.useCases.map((useCase, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <a
                      href={app.shopifyAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View on Shopify
                    </a>
                    <span className="text-xs text-gray-500">
                      {new Date(app.scrapedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add App Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Add App Reference</h2>
            <form onSubmit={handleAddApp}>
              <div className="mb-4">
                <label className="block text-sm font-medium  mb-2 text-black">
                  Shopify App URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.appUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, appUrl: e.target.value }))}
                  placeholder="https://apps.shopify.com/app-name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-black">
                  Use Cases
                </label>
                <input
                  type="text"
                  value={useCaseInput}
                  onChange={(e) => setUseCaseInput(e.target.value)}
                  onKeyDown={handleAddUseCase}
                  placeholder="Type a use case and press Enter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                />
                {formData.useCases.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.useCases.map((useCase, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {useCase}
                        <button
                          type="button"
                          onClick={() => handleRemoveUseCase(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-black">
                  Page Type
                </label>
                <select
                  value={formData.page}
                  onChange={(e) => setFormData(prev => ({ ...prev, page: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="homepage">Homepage</option>
                  <option value="collection">Collection</option>
                  <option value="product">Product</option>
                  <option value="cart">Cart</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add App'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (previewData || previewApp) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-black">
              {previewApp ? 'App Reference Details' : 'Scraped App Data'}
            </h2>
            
            {previewApp ? (
              // Full app reference details
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  {previewApp.iconUrl && (
                    <img
                      src={previewApp.iconUrl}
                      alt={previewApp.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-black mb-2">{previewApp.name}</h3>
                    <div className="flex gap-2">
                      <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                        {previewApp.category}
                      </span>
                      <span className="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full capitalize">
                        {previewApp.page}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{previewApp.description}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Page Type</h4>
                  <p className="text-gray-600 text-sm capitalize">{previewApp.page}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Use Cases</h4>
                  <div className="flex flex-wrap gap-2">
                    {previewApp.useCases.map((useCase, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Shopify App URL</h4>
                    <a
                      href={previewApp.shopifyAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {previewApp.shopifyAppUrl}
                    </a>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Scraped At</h4>
                    <p className="text-gray-600 text-sm">
                      {new Date(previewApp.scrapedAt).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">App ID</h4>
                    <p className="text-gray-600 text-sm font-mono">{previewApp.id}</p>
                  </div>
                </div>
              </div>
            ) : previewData ? (
              // Scraped app data (for preview scrape)
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {previewData.iconUrl && (
                    <img
                      src={previewData.iconUrl}
                      alt={previewData.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-black">{previewData.name}</h3>
                </div>
                <p className="text-gray-600 text-sm">{previewData.description}</p>
              </div>
            ) : null}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setPreviewApp(null);
                  setPreviewData(null);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 