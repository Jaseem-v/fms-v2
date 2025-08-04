import Link from "next/link";

interface AnalysisItem {
  problem: string;
  solution: string;
  summary: string;
}

interface Report {
  [key: string]: AnalysisItem[];
}

interface OverallSummaryProps {
  report: Report | null;
  analysisInProgress: { [key: string]: boolean };
  setShowModal: (show: boolean) => void;
  reportUrl?: string;
}

export default function OverallSummary({ report, analysisInProgress, setShowModal, reportUrl }: OverallSummaryProps) {
  if (!report || Object.keys(report).length === 0) return null;

  // Calculate total problems
  const totalProblems = Object.values(report).reduce((total, pageAnalysis) => {
    return total + (Array.isArray(pageAnalysis) ? pageAnalysis.length : 0);
  }, 0);

  // Calculate performance score (100 - problems * 1.5, minimum 0)
  const performanceScore = Math.max(0, Math.round(100 - (totalProblems * 1.5)));

  // Get background color based on performance score
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22C55E'; // Green for excellent
    if (score >= 60) return '#F59E0B'; // Yellow for good
    if (score >= 40) return '#F97316'; // Orange for fair
    return '#EF4444'; // Red for poor
  };

  // Get problems by page type
  const problemsByPage = {
    homepage: report.homepage ? report.homepage.length : 0,
    cart: report.cart ? report.cart.length : 0,
    product: report.product ? report.product.length : 0,
    collection: report.collection ? report.collection.length : 0,
  };

  const isHomepageComplete = report?.homepage && report?.homepage?.length > 0;
  const isCollectionComplete = report?.collection && report?.collection?.length > 0;
  const isProductComplete = report?.product && report?.product?.length > 0;
  const isCartComplete = report?.cart && report?.cart?.length > 0;


  const reportCompleted = isHomepageComplete && isCollectionComplete && isProductComplete && isCartComplete;


  return (
    <div className="overall-summary">
      {/* Performance Score Section */}
      <div className="performance-score-section flex-1">
        <div className="performance-gauge">
          <div className="gauge-circle">
            <div className="gauge-progress" style={{ background: `conic-gradient(${getScoreColor(performanceScore)} ${performanceScore}%, transparent ${performanceScore}% 360deg)` } as React.CSSProperties}></div>
            <div className="gauge-content">
              <div className="score-number">{performanceScore}</div>
              <div className="score-label">Performance Score</div>
              {/* <div className="website-name">website name.</div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="overall-summary__left flex-1 flex flex-col gap-4">

        <div className="report-loading__steps grid grid-cols-2 gap-4">
          <div className={`report-loading__step ${isHomepageComplete ? 'report-loading__step--complete' : ''}`}>
            <span className={`report-loading__step-icon `}>🏠</span>
            <span className="report-loading__step-text">Home page ({problemsByPage.homepage} )</span>

          </div>
          <div className={`report-loading__step ${isCollectionComplete ? 'report-loading__step--complete' : ''}`}>
            <span className={`report-loading__step-icon `}>📦</span>
            <span className="report-loading__step-text">Collection page ({problemsByPage.collection} )</span>
          </div>
          <div className={`report-loading__step ${isProductComplete ? 'report-loading__step--complete' : ''}`}>
            <span className={`report-loading__step-icon `}>🛍️</span>
            <span className="report-loading__step-text">Product page ({problemsByPage.product} )</span>
          </div>
          <div className={`report-loading__step ${isCartComplete ? 'report-loading__step--complete' : ''}`}>
            <span className={`report-loading__step-icon`}>🛒</span>
            <span className="report-loading__step-text">Cart page ({problemsByPage.cart} )</span>
          </div>
        </div>
        {/* Download Report Button */}
        <div className="download-section flex justify-center gap-4">
          <Link href={reportUrl || '#'} className="download-button " target="_blank">
            View Report
          </Link>
          <button className={" inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black border-2 border-gray-300 whitespace-nowrap wrap-normal" + (reportCompleted ? '' : 'disabled')} onClick={() => setShowModal(true)} disabled={!reportCompleted}>
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
} 