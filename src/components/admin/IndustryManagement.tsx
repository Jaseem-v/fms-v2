'use client';

import { useState, useEffect } from 'react';
import industryService, { Industry, CreateIndustryRequest, UpdateIndustryRequest } from '@/services/industryService';

interface IndustryFormProps {
  industry?: Industry;
  onSubmit: (data: CreateIndustryRequest | UpdateIndustryRequest) => void;
  onCancel: () => void;
  isEditing: boolean;
}

function IndustryForm({ industry, onSubmit, onCancel, isEditing }: IndustryFormProps) {
  const [name, setName] = useState(industry?.name || '');
  const [description, setDescription] = useState(industry?.description || '');
  const [isActive, setIsActive] = useState(industry?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Industry name is required');
      return;
    }

    const formData = {
      name: name.trim(),
      description: description.trim() || undefined
    };

    if (isEditing) {
      (formData as UpdateIndustryRequest).isActive = isActive;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? 'Edit Industry' : 'Add New Industry'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter industry name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter industry description"
              rows={3}
            />
          </div>

          {isEditing && (
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function IndustryManagement() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  const fetchIndustries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await industryService.getAllIndustries(showInactive);
      setIndustries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch industries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, [showInactive]);

  const handleCreateIndustry = async (data: CreateIndustryRequest) => {
    try {
      await industryService.createIndustry(data);
      setShowForm(false);
      fetchIndustries();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create industry');
    }
  };

  const handleUpdateIndustry = async (data: UpdateIndustryRequest) => {
    if (!editingIndustry) return;
    
    try {
      await industryService.updateIndustry(editingIndustry.id, data);
      setShowForm(false);
      setEditingIndustry(null);
      fetchIndustries();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update industry');
    }
  };

  const handleDeleteIndustry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this industry?')) return;
    
    try {
      await industryService.deleteIndustry(id);
      fetchIndustries();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete industry');
    }
  };

  const handleEdit = (industry: Industry) => {
    setEditingIndustry(industry);
    setShowForm(true);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchIndustries();
      return;
    }

    try {
      setLoading(true);
      const results = await industryService.searchIndustries(searchQuery);
      setIndustries(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search industries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CreateIndustryRequest | UpdateIndustryRequest) => {
    if (editingIndustry) {
      await handleUpdateIndustry(data as UpdateIndustryRequest);
    } else {
      await handleCreateIndustry(data as CreateIndustryRequest);
    }
  };

  const filteredIndustries = industries.filter(industry => 
    industry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (industry.description && industry.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading && industries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Industry Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Add New Industry
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search industries..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Search
        </button>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">Show Inactive</span>
        </label>
      </div>

      {/* Industries List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredIndustries.map((industry) => (
              <tr key={industry.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {industry.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {industry.description || 'No description'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    industry.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {industry.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(industry.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(industry)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteIndustry(industry.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredIndustries.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No industries found
          </div>
        )}
      </div>

      {/* Industry Form Modal */}
      {showForm && (
        <IndustryForm
          industry={editingIndustry || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingIndustry(null);
          }}
          isEditing={!!editingIndustry}
        />
      )}
    </div>
  );
}