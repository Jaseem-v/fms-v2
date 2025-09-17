/**
 * App Dashboard Component
 * Displays the main dashboard with header, statistics, and app grid
 */

'use client';

import { motion } from 'framer-motion';
import { ChevronDown, ExternalLink, Search } from 'lucide-react';
import { DetectedApp } from '@/lib/types';

interface AppDashboardProps {
  storeUrl: string;
  detectedApps: DetectedApp[];
  onNewSearch: () => void;
}

export function AppDashboard({ storeUrl, detectedApps, onNewSearch }: AppDashboardProps) {
  const totalApps = detectedApps.length;

  console.log("detectedApps", detectedApps);


  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with Light Green Background */}
      <div className=" px-6 py-8 result-header">
        <div className="max-w-7xl mx-auto">
          {/* Title */}


          {/* Input Field and Stats Row */}
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            {/* Store URL Input */}

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6 main-title">
                Here's your Shopify App list
              </h1>

              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={storeUrl.replace('https://', '').replace('http://', '')}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium"
                  />
                </div>
              </div>

            </div>
            {/* Statistics Cards */}
            <div className="flex gap-4">
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {totalApps.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Total Apps Found
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Total apps found
            </h2>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {totalApps} Result{totalApps !== 1 ? 's' : ''} found
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Apps Grid */}
          {detectedApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {detectedApps.map((app, index) => (
                <motion.div
                  key={`${app.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="bg-white hover:shadow-md transition-shadow duration-200 border border-gray-200 rounded-lg py-3 h-full">
                    <div className="p-6">
                      {/* App Icon */}
                      <div className="flex items-center gap-2 mb-4">

                        <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center ">
                          <span className="text-white font-bold text-lg">
                            {app.name.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 mb-0">
                          {/* App Name */}
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {app.name}
                          </h3>

                          {app.category && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {app.category}
                            </p>
                          )}
                        </div>
                      </div>


                      {
                        app.appStoreLink && (
                          <a href={app.appStoreLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            {
                              app.appStoreLink.split('/').pop()
                            }
                          </a>
                        )
                      }

                      {/* App Description */}


                      {/* Built for Shopify Badge */}
                      {/* <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                          <span className="text-white text-xs font-bold">S</span>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">
                          Built for Shopify
                        </span>
                      </div> */}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No apps found
              </h3>
              <p className="text-gray-600 mb-6">
                No Shopify apps were detected on this store.
              </p>
              <button
                onClick={onNewSearch}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Scan Another Store
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
