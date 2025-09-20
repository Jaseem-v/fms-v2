/**
 * Detection Results Component
 * Displays detected Shopify apps with confidence scores and details
 */

'use client';

import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle, AlertCircle, Info, Star, Tag } from 'lucide-react';
import { DetectedApp, DetectionResult } from '@/lib/types';

interface DetectionResultsProps {
  result: DetectionResult;
  onNewSearch: () => void;
}

export function DetectionResults({ result, onNewSearch }: DetectionResultsProps) {
  const { storeUrl, detectedApps, theme, scanDate } = result;

  // Debug logging to help identify data structure issues
  console.log('DetectionResults - result:', result);
  console.log('DetectionResults - detectedApps:', detectedApps);
  if (detectedApps && detectedApps.length > 0) {
    console.log('DetectionResults - first app:', detectedApps[0]);
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Detection Complete
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Found {detectedApps.length} app{detectedApps.length !== 1 ? 's' : ''} on{' '}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {storeUrl.replace('https://', '').replace('http://', '')}
          </span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Scanned on {formatDate(scanDate)}
        </p>
      </div>

      {/* Theme Information */}
      {theme && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Theme Information
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">{theme.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Version {theme.version}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  Theme ID: {theme.id}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {detectedApps.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Detected Apps ({detectedApps.length})
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            {detectedApps.map((app, index) => (
              <motion.div
                key={`${app.detectedAppName}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{app.detectedAppName}</h3>
                        {app.app?.categories && app.app.categories.length > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 mb-2">
                            {app.app.categories[0].categoryName}
                          </span>
                        )}
                        {app.app?.appName && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {app.app.appName}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getConfidenceColor(app.confidence)}`}
                        >
                          {app.confidence}% {getConfidenceLabel(app.confidence)}
                        </span>
                        {app.app?.appUrl && (
                          <a
                            href={app.app.appUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Evidence section removed as it's not available in DetectedAppWithDetails */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-blue-800 dark:text-blue-200">
                <p className="font-medium">No detectable apps found. This could mean:</p>
                <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                  <li>The apps are backend-only (server-side processing)</li>
                  <li>The store uses custom implementations</li>
                  <li>The detection needs more time to analyze</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="flex justify-center gap-4 pt-6"
      >
        <button
          onClick={onNewSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Scan Another Store
        </button>
        <button
          onClick={() => window.open(storeUrl, '_blank')}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-semibold flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Visit Store
        </button>
      </motion.div>
    </motion.div>
  );
}
