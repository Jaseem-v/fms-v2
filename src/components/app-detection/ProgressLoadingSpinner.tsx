/**
 * Progress Loading Spinner Component
 * Displays animated loading state with real-time progress updates during app detection
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  message?: string;
  appsFound?: number;
}

interface ProgressLoadingSpinnerProps {
  message?: string;
  subMessage?: string;
  progress?: {
    type: string;
    step?: string;
    message?: string;
    appsFound?: number;
  };
}

const initialSteps: ProgressStep[] = [
  { id: 'validating', label: 'Analyzing Store', status: 'pending' },
  { id: 'extracting', label: 'Scanning & Detecting Apps', status: 'pending' },
  { id: 'searching', label: 'Getting Details', status: 'pending' },
  { id: 'finalizing', label: 'Finalizing Results', status: 'pending' }
];

export function ProgressLoadingSpinner({
  message = "Finding your apps...",
  subMessage = "This will only take a moment",
  progress
}: ProgressLoadingSpinnerProps) {
  const [steps, setSteps] = useState<ProgressStep[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [appsFound, setAppsFound] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (progress) {
      if (progress.type === 'progress' && progress.step) {
        setCurrentStep(progress.step);
        
        setSteps(prevSteps => 
          prevSteps.map(step => {
            if (step.id === progress.step) {
              return { ...step, status: 'active', message: progress.message };
            } else if (prevSteps.findIndex(s => s.id === step.id) < prevSteps.findIndex(s => s.id === progress.step)) {
              return { ...step, status: 'completed' };
            }
            return step;
          })
        );

        if (progress.appsFound !== undefined) {
          setAppsFound(progress.appsFound);
        }
      } else if (progress.type === 'complete') {
        setIsComplete(true);
        setSteps(prevSteps => 
          prevSteps.map(step => ({ ...step, status: 'completed' }))
        );
      } else if (progress.type === 'error') {
        setSteps(prevSteps => 
          prevSteps.map(step => 
            step.id === currentStep ? { ...step, status: 'error' } : step
          )
        );
      }
    }
  }, [progress, currentStep]);

  const getStepIcon = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'active':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Search className="w-5 h-5 text-blue-500" />
          </motion.div>
        );
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStepColor = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-600';
      case 'active':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center space-y-8 px-12 fixed top-0 left-0 w-full h-full bg-white z-50"
    >
      {/* Main Icon */}
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

      {/* Progress Steps */}
      <div className="w-full max-w-md space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
          {isComplete ? 'Detection Complete!' : message}
        </h3>
        
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
              step.status === 'active' ? 'bg-blue-50 border border-blue-200' : 
              step.status === 'completed' ? 'bg-green-50 border border-green-200' :
              step.status === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-gray-50 border border-gray-200'
            }`}
          >
            {getStepIcon(step)}
            <div className="flex-1">
              <div className={`font-medium ${getStepColor(step)}`}>
                {step.label}
              </div>
              {step.message && (
                <div className="text-sm text-gray-600 mt-1">
                  {step.message}
                </div>
              )}
            </div>
            {step.status === 'active' && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-blue-500 rounded-full"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Apps Found Counter */}
      {appsFound > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-100 border border-green-200 rounded-lg px-6 py-4"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <CheckCircle className="w-6 h-6 text-green-600" />
            </motion.div>
            <div>
              <div className="text-green-800 font-bold text-lg">
                {appsFound} app{appsFound !== 1 ? 's' : ''} found!
              </div>
              <div className="text-green-600 text-sm">
                {appsFound === 1 ? 'Great start!' : 'Keep going...'}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Dots */}
      {/* {!isComplete && (
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
      )} */}

      {/* Sub Message */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="text-center"
      >
        <p className="text-sm text-gray-500">
          {isComplete ? 'Processing complete!' : subMessage}
        </p>
      </motion.div> */}
    </motion.div>
  );
}
