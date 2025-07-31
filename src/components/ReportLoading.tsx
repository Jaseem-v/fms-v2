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
  const isHomepageComplete = report?.homepage && report?.homepage?.length > 0;
  const isCollectionComplete = report?.collection && report?.collection?.length > 0;
  const isProductComplete = report?.product && report?.product?.length > 0;
  const isCartComplete = report?.cart && report?.cart?.length > 0;

  

  return (
    <div className="report-loading">
      {/* Main Loading Container */}
      <div className="report-loading__container">
        {/* Animated Logo/Icon */}
        {/* <div className="report-loading__icon">
          <div className="report-loading__icon-inner">
            <span className="report-loading__icon-text">🔍</span>
          </div>
        </div> */}

        {/* Loading Message */}
        <div className="report-loading__content">
          {/* <h2 className="report-loading__title">Shopify CRO Analysis</h2> */}
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

          {/* Animated Steps */}
     

          {/* Loading Dots */}
          {/* <div className="report-loading__dots">
            <div className="report-loading__dot"></div>
            <div className="report-loading__dot"></div>
            <div className="report-loading__dot"></div>
          </div> */}
        </div>
      </div>

      {/* Background Gradient */}
      <div className="report-loading__gradient"></div>
    </div>
  )
}
