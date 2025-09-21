/**
 * App Dashboard Component
 * Displays the main dashboard with header, statistics, and app grid
 */

'use client';

import { motion } from 'framer-motion';
import { ChevronDown, ExternalLink, Search, Star, Users, AlertCircle } from 'lucide-react';
import { DetectedAppWithDetails } from '@/lib/types';

interface AppDashboardProps {
  storeUrl: string;
  detectedApps: DetectedAppWithDetails[];
  onNewSearch: () => void;
}

export function AppDashboard({ storeUrl, detectedApps, onNewSearch }: AppDashboardProps) {
  const totalApps = detectedApps.length;
  const appsWithDetails = detectedApps.filter(app => app.app !== null).length;
  const appsWithoutDetails = detectedApps.filter(app => app.app === null).length;

  console.log("detectedApps", detectedApps);


  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with Light Green Background */}
      <div className=" px-6 py-8 result-header">
        <div className="max-w-7xl mx-auto">
          {/* Title */}


          {/* Input Field and Stats Row */}
          <div className="flex gap-6 items-start lg:items-center">
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
              {/* <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {appsWithDetails.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    With Full Details
                  </div>
                </div>
              </div> */}
              {/* {appsWithoutDetails > 0 && (
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {appsWithoutDetails.toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      Unknown Apps
                    </div>
                  </div>
                </div>
              )} */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {detectedApps.map((detectedApp, index) => {
                const app = detectedApp.app;
                const appName = app ? app.appName : detectedApp.detectedAppName;
                
                return (
                  <motion.div
                    key={`${appName}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <div className={`bg-white hover:shadow-md transition-shadow duration-200 border rounded-lg h-full ${
                      app ? 'border-gray-200' : 'border-orange-200 bg-orange-50'
                    }`}>
                      <div className="p-6">
                        {/* App Icon and Name */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className="flex-shrink-0">
                            {app && app.imageUrl ? (
                              <img 
                                src={app.imageUrl} 
                                alt={app.appName}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => {
                                  // Fallback to initial if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              app ? 'bg-gradient-to-br from-gray-800 to-black' : 'bg-orange-200'
                            }`} style={{ display: app && app.imageUrl ? 'none' : 'flex' }}>
                              <span className={`font-bold text-lg ${
                                app ? 'text-white' : 'text-orange-800'
                              }`}>
                                {appName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                              {app ? app.appName : detectedApp.detectedAppName}
                            </h3>
                            
                            {app && app.categories && app.categories.length > 0 && (
                              <p className="text-sm text-gray-600 line-clamp-1">
                                {app.categories[0].categoryName}
                              </p>
                            )}
                            
                            {/* {!app && (
                              <div className="flex items-center gap-1 text-orange-600 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                <span>Not in database</span>
                              </div>
                            )} */}
                          </div>
                        </div>

                        {/* App Details */}
                        {app && (
                          <div className="space-y-3">
                            {/* Rating and Reviews */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium text-gray-900">
                                  {app.rating.toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({app.reviewCount.toLocaleString()})
                                </span>
                              </div>
                              {app.reviewChange && (
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  app.reviewChange.startsWith('+') 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {app.reviewChange}
                                </span>
                              )}
                            </div>

                            {/* Categories */}
                            {app.categories && app.categories.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {app.categories.slice(0, 2).map((category, catIndex) => (
                                  <span 
                                    key={catIndex}
                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                                  >
                                    {category.categoryName}
                                  </span>
                                ))}
                                {app.categories.length > 2 && (
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                    +{app.categories.length - 2} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* App Store Link */}
                            {app.shopifyUrl && (
                              <a 
                                href={app.shopifyUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                <ExternalLink className="h-4 w-4" />
                                View on Shopify App Store
                              </a>
                            )}
                          </div>
                        )}

                        {/* Confidence Score */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Detection Confidence</span>
                            <span className="font-medium">{detectedApp.confidence}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className={`h-1.5 rounded-full ${
                                detectedApp.confidence >= 80 ? 'bg-green-500' :
                                detectedApp.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${detectedApp.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
