interface AnalysisItem {
  problem: string;
  solution: string;
}

interface Report {
  [key: string]: AnalysisItem[];
}

interface OverallSummaryProps {
  report: Report | null;
  analysisInProgress: {[key: string]: boolean};
  setShowModal: (show: boolean) => void;
}

export default function OverallSummary({ report, analysisInProgress, setShowModal }: OverallSummaryProps) {
  if (!report || Object.keys(report).length === 0) return null;

  // Calculate total problems
  const totalProblems = Object.values(report).reduce((total, pageAnalysis) => {
    return total + (Array.isArray(pageAnalysis) ? pageAnalysis.length : 0);
  }, 0);

  // Calculate performance score (100 - problems * 1.5, minimum 0)
  const performanceScore = Math.max(0, Math.round(100 - (totalProblems * 1.5)));

  // Get problems by page type
  const problemsByPage = {
    homepage: report.homepage ? report.homepage.length : 0,
    cart: report.cart ? report.cart.length : 0,
    product: report.product ? report.product.length : 0,
    collection: report.collection ? report.collection.length : 0,
  };

  return (
    <div className="overall-summary">
      {/* Performance Score Section */}
      <div className="performance-score-section">
        <div className="performance-gauge">
          <div className="gauge-circle">
            <div className="gauge-progress" style={{ background: `conic-gradient(#E65A2B ${performanceScore}%, transparent ${performanceScore}% 360deg)` } as React.CSSProperties}></div>
            <div className="gauge-content">
              <div className="score-number">{performanceScore}</div>
              <div className="score-label">Performance Score</div>
              <div className="website-name">website name.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Problems Summary Section */}
      <div className="problems-summary-section">
        <div className="problems-card">
          <div className="problems-header">
            <div className="warning-icon">⚠️</div>
            <div className="problems-count">{totalProblems} Problems</div>
          </div>
          <div className="problems-breakdown">
            <div className="problems-column">
              <div className="problem-item">
                <div className="page-icon">🏠</div>
                <div className="page-info">
                  <span className="page-name">Home Page</span>
                  <span className="page-count">: {problemsByPage.homepage}</span>
                </div>
              </div>
              <div className="problem-item">
                <div className="page-icon">🛒</div>
                <div className="page-info">
                  <span className="page-name">Cart Page</span>
                  <span className="page-count">: {problemsByPage.cart}</span>
                </div>
              </div>
            </div>
            <div className="problems-column right">
              <div className="problem-item">
                <div className="page-icon">🛍️</div>
                <div className="page-info">
                  <span className="page-name">Product Page</span>
                  <span className="page-count">: {problemsByPage.product}</span>
                </div>
              </div>
              <div className="problem-item">
                <div className="page-icon">📦</div>
                <div className="page-info">
                  <span className="page-name">Collection Page</span>
                  <span className="page-count">: {problemsByPage.collection}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Report Button */}
      <div className="download-section">
        <button className="download-button" onClick={() => setShowModal(true)}>
          Download Report
        </button>
      </div>
    </div>
  );
} 