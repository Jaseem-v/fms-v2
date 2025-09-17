/**
 * Loading Spinner Component
 * Displays animated loading state during app detection
 */

'use client';

import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
}

export function LoadingSpinner({
  message = "Detecting apps...",
  subMessage = "This may take a few moments"
}: LoadingSpinnerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center space-y-6 py-12"
    >
      {/* Animated Search Icon */}
      {/* <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <Search className="h-16 w-16 text-blue-500 opacity-20" />
        </motion.div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="h-16 w-16 text-blue-500" />
        </motion.div>
      </div> */}

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <motion.h3
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xl font-semibold text-gray-900 dark:text-white"
        >
          {message}
        </motion.h3>
        <p className="text-gray-600 dark:text-gray-400">
          {subMessage}
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-green-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* AI Processing Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="text-center"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Analyzing Your Store
        </p>
      </motion.div>
    </motion.div>
  );
}
