'use client';

import { useState, useEffect } from 'react';
import promptService, { Prompt, CreatePromptData, UpdatePromptData, PromptFilters, PromptStatistics } from '@/services/promptService';
import industryService, { Industry } from '@/services/industryService';
import countriesData from '@/config/countries.json';

interface PromptFormProps {
  prompt?: Prompt;
  industries: Industry[];
  onSave: (data: CreatePromptData | UpdatePromptData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

function PromptForm({ prompt, industries, onSave, onCancel, isEditing = false }: PromptFormProps) {
  const [name, setName] = useState(prompt?.name || '');
  const [description, setDescription] = useState(prompt?.description || '');
  const [content, setContent] = useState(prompt?.content || '');
  const [category, setCategory] = useState(prompt?.category || 'analysis');
  const [pageType, setPageType] = useState(prompt?.pageType || 'all');
  const [industry, setIndustry] = useState(prompt?.industry || 'all');
  const [country, setCountry] = useState(prompt?.country || 'all');
  const [priority, setPriority] = useState(prompt?.priority || 1);
  const [variables, setVariables] = useState<string[]>(prompt?.variables || []);
  const [variableInput, setVariableInput] = useState('');
  
  // Enhanced fields
  const [promptType, setPromptType] = useState(prompt?.promptType || 'analysis');
  const [analysisType, setAnalysisType] = useState(prompt?.analysisType || '');
  const [targetAudience, setTargetAudience] = useState(prompt?.targetAudience || '');
  const [complexity, setComplexity] = useState(prompt?.complexity || 'intermediate');
  const [sections, setSections] = useState(prompt?.sections || []);
  const [instructions, setInstructions] = useState<string[]>(prompt?.instructions || []);
  const [requirements, setRequirements] = useState<string[]>(prompt?.requirements || []);
  const [outputFormat, setOutputFormat] = useState(prompt?.outputFormat || '');
  const [context, setContext] = useState(prompt?.context || {
    industry: '',
    pageType: '',
    userType: '',
    conversionGoal: ''
  });

  const handleAddVariable = () => {
    const trimmedInput = variableInput.trim();
    if (trimmedInput && !variables.includes(trimmedInput)) {
      setVariables(prev => [...prev, trimmedInput]);
      setVariableInput('');
    }
  };

  const handleRemoveVariable = (index: number) => {
    setVariables(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddVariable();
    }
  };

  const handleAddSection = () => {
    const newSection = {
      title: '',
      content: '',
      order: sections.length + 1
    };
    setSections(prev => [...prev, newSection]);
  };

  const handleUpdateSection = (index: number, field: 'title' | 'content', value: string) => {
    setSections(prev => prev.map((section, i) => 
      i === index ? { ...section, [field]: value } : section
    ));
  };

  const handleRemoveSection = (index: number) => {
    setSections(prev => prev.filter((_, i) => i !== index).map((section, i) => ({ ...section, order: i + 1 })));
  };

  const handleAddInstruction = () => {
    const newInstruction = window.prompt('Enter instruction:');
    if (newInstruction && newInstruction.trim()) {
      setInstructions(prev => [...prev, newInstruction.trim()]);
    }
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddRequirement = () => {
    const newRequirement = window.prompt('Enter requirement:');
    if (newRequirement && newRequirement.trim()) {
      setRequirements(prev => [...prev, newRequirement.trim()]);
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim() || !content.trim()) {
      alert('Name and content are required fields');
      return;
    }

    if (isEditing) {
      const updateData: UpdatePromptData = {
        name: name.trim(),
        description: description.trim() || undefined,
        content: content.trim(),
        category,
        pageType,
        industry,
        country,
        priority,
        variables,
        promptType,
        analysisType: analysisType || undefined,
        targetAudience: targetAudience || undefined,
        complexity,
        sections: sections.length > 0 ? sections : undefined,
        instructions: instructions.length > 0 ? instructions : undefined,
        requirements: requirements.length > 0 ? requirements : undefined,
        outputFormat: outputFormat || undefined,
        context: Object.values(context).some(v => v) ? context : undefined
      };
      onSave(updateData);
    } else {
      const createData: CreatePromptData = {
        name: name.trim(),
        description: description.trim() || undefined,
        content: content.trim(),
        category,
        pageType,
        industry,
        country,
        priority,
        variables,
        promptType,
        analysisType: analysisType || undefined,
        targetAudience: targetAudience || undefined,
        complexity,
        sections: sections.length > 0 ? sections : undefined,
        instructions: instructions.length > 0 ? instructions : undefined,
        requirements: requirements.length > 0 ? requirements : undefined,
        outputFormat: outputFormat || undefined,
        context: Object.values(context).some(v => v) ? context : undefined
      };
      onSave(createData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prompt Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter prompt name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter prompt description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prompt Content *
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the prompt content. Use {{variable}} syntax for dynamic variables."
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black font-mono text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Use {'{{variable}}'} syntax to include dynamic variables. Example: {'{{url}}'}, {'{{industry}}'}, {'{{country}}'}
        </p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        >
          <option value="analysis">Analysis</option>
          <option value="report">Report</option>
          <option value="screenshot">Screenshot</option>
          <option value="general">General</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Prompt Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prompt Type *
        </label>
        <select
          value={promptType}
          onChange={(e) => setPromptType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        >
          <option value="analysis">Analysis</option>
          <option value="report">Report</option>
          <option value="screenshot">Screenshot</option>
          <option value="app_recommendation">App Recommendation</option>
          <option value="image_recommendation">Image Recommendation</option>
          <option value="general">General</option>
        </select>
      </div>

      {/* Analysis Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Analysis Type
        </label>
        <select
          value={analysisType}
          onChange={(e) => setAnalysisType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        >
          <option value="">Select Analysis Type</option>
          <option value="comprehensive">Comprehensive</option>
          <option value="focused">Focused</option>
          <option value="quick">Quick</option>
          <option value="detailed">Detailed</option>
        </select>
      </div>

      {/* Complexity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Complexity *
        </label>
        <select
          value={complexity}
          onChange={(e) => setComplexity(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        >
          <option value="basic">Basic</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Audience
        </label>
        <input
          type="text"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          placeholder="e.g., CRO experts, e-commerce professionals"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        />
      </div>

      {/* Page Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Page Type
        </label>
        <select
          value={pageType}
          onChange={(e) => setPageType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        >
          <option value="all">All Pages</option>
          <option value="homepage">Homepage</option>
          <option value="collection">Collection</option>
          <option value="product">Product</option>
          <option value="cart">Cart</option>
        </select>
      </div>

      {/* Industry */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Industry
        </label>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        >
          <option value="all">All Industries</option>
          {industries.map((industryOption) => (
            <option key={industryOption.id} value={industryOption.name}>
              {industryOption.name}
            </option>
          ))}
        </select>
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country
        </label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        >
          <option value="all">All Countries</option>
          {countriesData.map((countryOption) => (
            <option key={countryOption.code} value={countryOption.code}>
              {countryOption.name}
            </option>
          ))}
        </select>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priority (1-10)
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        />
        <p className="text-xs text-gray-500 mt-1">
          Higher priority prompts will be used first when multiple prompts match
        </p>
      </div>

      {/* Variables */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Variables
        </label>
        
        {/* Variables Tags */}
        {variables.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {variables.map((variable, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                {variable}
                <button
                  type="button"
                  onClick={() => handleRemoveVariable(index)}
                  className="ml-2 text-green-600 hover:text-green-800"
                  title="Remove"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Variable Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={variableInput}
            onChange={(e) => setVariableInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a variable name and press Enter to add..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          />
          <button
            type="button"
            onClick={handleAddVariable}
            disabled={!variableInput.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Add variables that can be used in the prompt content with {'{{variable}}'} syntax
        </p>
      </div>

      {/* Sections */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sections
        </label>
        {sections.map((section, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Section {index + 1}</span>
              <button
                type="button"
                onClick={() => handleRemoveSection(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              value={section.title}
              onChange={(e) => handleUpdateSection(index, 'title', e.target.value)}
              placeholder="Section title"
              className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md text-black"
            />
            <textarea
              value={section.content}
              onChange={(e) => handleUpdateSection(index, 'content', e.target.value)}
              placeholder="Section content"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSection}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Section
        </button>
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instructions
        </label>
        {instructions.map((instruction, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <span className="flex-1 px-3 py-2 bg-gray-100 rounded-md text-black">{instruction}</span>
            <button
              type="button"
              onClick={() => handleRemoveInstruction(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddInstruction}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Instruction
        </button>
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Requirements
        </label>
        {requirements.map((requirement, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <span className="flex-1 px-3 py-2 bg-gray-100 rounded-md text-black">{requirement}</span>
            <button
              type="button"
              onClick={() => handleRemoveRequirement(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddRequirement}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Requirement
        </button>
      </div>

      {/* Output Format */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Output Format
        </label>
        <textarea
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
          placeholder="e.g., JSON array with problem and solution objects"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
        />
      </div>

      {/* Context */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Context
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Industry</label>
            <input
              type="text"
              value={context.industry || ''}
              onChange={(e) => setContext(prev => ({ ...prev, industry: e.target.value }))}
              placeholder="e.g., Fashion & Apparel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Page Type</label>
            <input
              type="text"
              value={context.pageType || ''}
              onChange={(e) => setContext(prev => ({ ...prev, pageType: e.target.value }))}
              placeholder="e.g., homepage"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">User Type</label>
            <input
              type="text"
              value={context.userType || ''}
              onChange={(e) => setContext(prev => ({ ...prev, userType: e.target.value }))}
              placeholder="e.g., e-commerce visitors"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Conversion Goal</label>
            <input
              type="text"
              value={context.conversionGoal || ''}
              onChange={(e) => setContext(prev => ({ ...prev, conversionGoal: e.target.value }))}
              placeholder="e.g., increase homepage conversions"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>
        </div>
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
          disabled={!name.trim() || !content.trim()}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEditing ? 'Update Prompt' : 'Create Prompt'}
        </button>
      </div>
    </div>
  );
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [statistics, setStatistics] = useState<PromptStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [filters, setFilters] = useState<PromptFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const promptsData = await promptService.getAllPrompts(filters);
      setPrompts(promptsData);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndustries = async () => {
    try {
      const industriesData = await industryService.getAllIndustries();
      setIndustries(industriesData);
    } catch (error) {
      console.error('Error fetching industries:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await promptService.getPromptStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchPrompts();
    fetchIndustries();
    fetchStatistics();
  }, [filters]);

  const handleCreatePrompt = async (data: CreatePromptData | UpdatePromptData) => {
    try {
      await promptService.createPrompt(data as CreatePromptData);
      setShowCreateModal(false);
      fetchPrompts();
      fetchStatistics();
    } catch (error) {
      console.error('Error creating prompt:', error);
      alert('Failed to create prompt. Please try again.');
    }
  };

  const handleUpdatePrompt = async (data: CreatePromptData | UpdatePromptData) => {
    if (!editingPrompt) return;

    try {
      await promptService.updatePrompt(editingPrompt.id, data as UpdatePromptData);
      setShowEditModal(false);
      setEditingPrompt(null);
      fetchPrompts();
      fetchStatistics();
    } catch (error) {
      console.error('Error updating prompt:', error);
      alert('Failed to update prompt. Please try again.');
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    try {
      await promptService.deletePrompt(id);
      fetchPrompts();
      fetchStatistics();
    } catch (error) {
      console.error('Error deleting prompt:', error);
      alert('Failed to delete prompt. Please try again.');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await promptService.togglePromptStatus(id);
      fetchPrompts();
      fetchStatistics();
    } catch (error) {
      console.error('Error toggling prompt status:', error);
      alert('Failed to toggle prompt status. Please try again.');
    }
  };

  const handleDuplicatePrompt = async (id: string) => {
    try {
      await promptService.duplicatePrompt(id);
      fetchPrompts();
      fetchStatistics();
    } catch (error) {
      console.error('Error duplicating prompt:', error);
      alert('Failed to duplicate prompt. Please try again.');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPrompts();
      return;
    }

    setLoading(true);
    try {
      const searchResults = await promptService.searchPrompts(searchQuery);
      setPrompts(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setShowEditModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dynamic Prompts Management</h1>
          <p className="text-gray-600">
            Create and manage dynamic prompts for CRO analysis
          </p>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Total Prompts</h3>
              <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Active</h3>
              <p className="text-2xl font-bold text-green-600">{statistics.active}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Inactive</h3>
              <p className="text-2xl font-bold text-red-600">{statistics.inactive}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">Categories</h3>
              <p className="text-2xl font-bold text-blue-600">{Object.keys(statistics.byCategory).length}</p>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Category Filter */}
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">All Categories</option>
                <option value="analysis">Analysis</option>
                <option value="report">Report</option>
                <option value="screenshot">Screenshot</option>
                <option value="general">General</option>
                <option value="custom">Custom</option>
              </select>

              {/* Status Filter */}
              <select
                value={filters.isActive === undefined ? '' : filters.isActive.toString()}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  isActive: e.target.value === '' ? undefined : e.target.value === 'true' 
                }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              {/* Search */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search prompts..."
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </div>

            {/* <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Create New Prompt
            </button> */}
          </div>
        </div>

        {/* Prompts List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Prompts ({prompts.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No prompts found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {prompts.map((prompt) => (
                <div key={prompt.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{prompt.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          prompt.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {prompt.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {prompt.category}
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                          Priority: {prompt.priority}
                        </span>
                      </div>
                      
                      {prompt.description && (
                        <p className="text-gray-600 mb-2">{prompt.description}</p>
                      )}
                      
                      <div className="text-sm text-gray-500 mb-3">
                        <span>Page: {prompt.pageType || 'all'}</span>
                        <span className="mx-2">•</span>
                        <span>Industry: {prompt.industry || 'all'}</span>
                        <span className="mx-2">•</span>
                        <span>Country: {prompt.country || 'all'}</span>
                        <span className="mx-2">•</span>
                        <span>Created: {formatDate(prompt.createdAt)}</span>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap">
                          {prompt.content}
                        </p>
                      </div>

                      {prompt.variables.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500 mb-1">Variables:</p>
                          <div className="flex flex-wrap gap-1">
                            {prompt.variables.map((variable, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                {variable}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditPrompt(prompt)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {/* <button
                        onClick={() => handleDuplicatePrompt(prompt.id)}
                        className="p-2 text-green-600 hover:text-green-800"
                        title="Duplicate"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(prompt.id)}
                        className={`p-2 ${
                          prompt.isActive 
                            ? 'text-yellow-600 hover:text-yellow-800' 
                            : 'text-green-600 hover:text-green-800'
                        }`}
                        title={prompt.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button> */}
                      {/* <button
                        onClick={() => handleDeletePrompt(prompt.id)}
                        className="p-2 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Create New Prompt</h2>
            <PromptForm
              industries={industries}
              onSave={handleCreatePrompt}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Edit Prompt</h2>
            <PromptForm
              prompt={editingPrompt}
              industries={industries}
              onSave={handleUpdatePrompt}
              onCancel={() => {
                setShowEditModal(false);
                setEditingPrompt(null);
              }}
              isEditing={true}
            />
          </div>
        </div>
      )}
    </div>
  );
} 