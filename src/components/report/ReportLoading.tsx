import { Report } from '@/hooks/useAnalysis';
import React from 'react'

interface ReportLoadingProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
  report?: Report;
}

export default function ReportLoading({ 
  message = "Analyzing your store...", 
  showProgress = true,
  progress = 0,
  report
}: ReportLoadingProps) {
  return (
    <div className="report-loading">
      {/* Main Loading Container */}
      <div className="report-loading__container">
        {/* Loading Message */}
        <div className="report-loading__content">
          <p className="report-loading__message">{message}</p>
          
          {/* Progress Bar */}
          {showProgress && (
            <div className="report-loading__progress">
              <div className="report-loading__progress-bar">
                <div 
                  className="report-loading__progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="report-loading__progress-text">{Math.round(progress)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Background Gradient */}
      <div className="report-loading__gradient"></div>
    </div>
  )
}
