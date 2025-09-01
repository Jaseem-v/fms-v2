import Link from "next/link";
import { useEffect, useState } from "react";
import { HomepageAnalysisResult } from "@/hooks/useHomepageAnalysis";

interface Report {
  [key: string]: HomepageAnalysisResult;
}

interface OverallSummaryProps {
  report: Report | null;
  analysisInProgress: { [key: string]: boolean };
  setShowModal: (show: boolean) => void;
  reportUrl?: string | null;
  noViewReport?: boolean;
  performanceScore?: number;
  websiteUrl?: string | null;
  isSampleReport?: boolean;
}

export default function OverallSummary({ report, analysisInProgress, setShowModal, reportUrl, noViewReport, performanceScore, websiteUrl, isSampleReport }: OverallSummaryProps) {
  const [svgSize, setSvgSize] = useState({ width: 250, height: 250, viewBox: "0 0 250 250" });
  // const [performanceScore, setPerformanceScore] = useState(performanceScore || 0);
  const [coordinates, setCoordinates] = useState({
    centerX: 125,
    centerY: 125.5,
    outerRadius: 125,
    innerRadius: 100,
    arcWidth: 25
  });

  console.log("coordinates reports", report);


  useEffect(() => {
    const updateSvgSize = () => {
      if (window.innerWidth <= 480) {
        setSvgSize({ width: 150, height: 151, viewBox: "0 0 150 151" });
        setCoordinates({
          centerX: 75,
          centerY: 75.5,
          outerRadius: 75,
          innerRadius: 60,
          arcWidth: 15
        });
      } else if (window.innerWidth <= 768) {
        setSvgSize({ width: 200, height: 201, viewBox: "0 0 200 201" });
        setCoordinates({
          centerX: 100,
          centerY: 100.5,
          outerRadius: 100,
          innerRadius: 80,
          arcWidth: 20
        });
      } else if (window.innerWidth <= 1200) {
        setSvgSize({ width: 250, height: 251, viewBox: "0 0 250 251" });
        setCoordinates({
          centerX: 125,
          centerY: 125.5,
          outerRadius: 125,
          innerRadius: 100,
          arcWidth: 25
        });
      }
    };

    updateSvgSize();
    window.addEventListener('resize', updateSvgSize);
    return () => window.removeEventListener('resize', updateSvgSize);
  }, []);

  if (!report || Object.keys(report).length === 0) return null;

  // Calculate total problems
  const totalProblems = Object.values(report).reduce((total, pageAnalysis) => {
    return total + (pageAnalysis?.checklistAnalysis?.length || 0);
  }, 0);

  // Calculate performance score (100 - problems * 1.5, minimum 0)

  const finalPerformanceScore = performanceScore || Math.max(0, Math.round(100 - (totalProblems)));

  // Get background color based on performance score
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22C55E'; // Green for excellent
    if (score >= 60) return '#F59E0B'; // Yellow for good
    if (score >= 40) return '#F97316'; // Orange for fair
    return '#EF4444'; // Red for poor
  };

  // Function to create dynamic arc path based on performance score
  const createArcPath = (score: number) => {
    const { centerX, centerY, outerRadius, arcWidth } = coordinates;

    // Position the arc to perfectly overlay the gray ring
    const arcRadius = outerRadius - (arcWidth / 2); // Position at outer edge of gray ring

    // Start from top (12 o'clock position)
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (score / 100) * 2 * Math.PI;

    // Create a simple arc path for stroke-based rendering
    if (score === 0) {
      return ""; // No arc for 0 score
    } else {
      // Create a simple arc path that will be rendered with stroke
      const startX = centerX + arcRadius * Math.cos(startAngle);
      const startY = centerY + arcRadius * Math.sin(startAngle);
      const endX = centerX + arcRadius * Math.cos(endAngle);
      const endY = centerY + arcRadius * Math.sin(endAngle);

      const largeArcFlag = score > 50 ? 1 : 0;

      return `M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
    }
  };

  // Get problems by page type
  const problemsByPage = {
    homepage: report.homepage?.checklistAnalysis?.length || 0,
    cart: report.cart?.checklistAnalysis?.length || 0,
    product: report.product?.checklistAnalysis?.length || 0,
    collection: report.collection?.checklistAnalysis?.length || 0,
  };

  const isHomepageComplete = report?.homepage?.checklistAnalysis?.length > 0;
  const isCollectionComplete = report?.collection?.checklistAnalysis?.length > 0;
  const isProductComplete = report?.product?.checklistAnalysis?.length > 0;
  const isCartComplete = report?.cart?.checklistAnalysis?.length > 0;

  const reportCompleted = isHomepageComplete && isCollectionComplete && isProductComplete && isCartComplete;

  return (
    <div className="overall-summary__container">
      <div className="overall-summary__container-header">
        <div className="flex flex-col gap-1">
          <h1 className="overall-summary__title">FixMyStore Analysis </h1>
          <p className="overall-summary__site">{websiteUrl ?? "hiutdenim.co.uk"}</p>
        </div>

        <Link href={`/payment?url=${websiteUrl ?? ""}`} className={`download-button flex gap-2 ${isSampleReport ? 'hidden md:flex' : ''}`}>
          {isSampleReport ? "Get your audit" : "Unlock full audit "}
          {isSampleReport ? <svg xmlns="http://www.w3.org/2000/svg" width="27" height="28" viewBox="0 0 27 28" fill="none">
            <path d="M14.625 19.6252L20.2501 14.0001L14.625 8.375M6.74988 19.6252L12.375 14.0001L6.74988 8.375" stroke="white" stroke-width="2.25004" stroke-linecap="round" stroke-linejoin="round" />
          </svg> : "- $149"}
        </Link>
      </div>
      <div className="overall-summary">
        {/* Performance Score Section */}
        <div className="performance-score-section  flex flex-col gap-8 items-center">
          <div className="performance-gauge">
            <div className="gauge-circle">
              <svg
                width={svgSize.width}
                height={svgSize.height}
                viewBox={svgSize.viewBox}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Gray background circle */}
                <circle
                  cx={coordinates.centerX}
                  cy={coordinates.centerY}
                  r={coordinates.outerRadius}
                  fill="#F4F4F4"
                />

                {/* White circle overlay - made larger and more prominent */}
                <circle
                  cx={coordinates.centerX}
                  cy={coordinates.centerY}
                  r={coordinates.innerRadius}
                  fill="white"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />

                {/* Performance arc */}
                <path
                  d={createArcPath(finalPerformanceScore)}
                  fill="none"
                  stroke={getScoreColor(finalPerformanceScore)}
                  strokeWidth={coordinates.arcWidth}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="gauge-content">
              <div className="score-number">{reportCompleted ? finalPerformanceScore : "🔒"}/100</div>
              <div className="flex items-center gap-2">
                <h2 className="score-label ">FMS <span>score</span> </h2>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={svgSize.width <= 200 ? 20 : 27}
                  height={svgSize.height <= 200 ? 20 : 27}
                  viewBox="0 0 27 27"
                  fill="none"
                >
                  <path d="M13.7637 1.68311C20.336 1.68334 25.6641 7.01207 25.6641 13.5845C25.6638 20.1567 20.3359 25.4846 13.7637 25.4849C7.19127 25.4849 1.86254 20.1568 1.8623 13.5845C1.8623 7.01192 7.19112 1.68311 13.7637 1.68311ZM13.7637 12.5396C13.187 12.5396 12.7188 13.0078 12.7188 13.5845V18.7622C12.7189 19.3388 13.187 19.8062 13.7637 19.8062C14.3401 19.8059 14.8075 19.3387 14.8076 18.7622V13.5845C14.8076 13.0079 14.3402 12.5398 13.7637 12.5396ZM13.7637 7.36182C13.1871 7.36182 12.7189 7.8292 12.7188 8.40576C12.7188 8.98247 13.187 9.45068 13.7637 9.45068H13.7764C14.353 9.45058 14.8203 8.9824 14.8203 8.40576C14.8201 7.82927 14.3529 7.36192 13.7764 7.36182H13.7637Z" fill="#C5C5C5" stroke="white" stroke-width="2.08844" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>

              {/* <div className="website-name">website name.</div> */}
            </div>
          </div>


        </div>

        <div className="overall-summary__left flex-1 flex flex-col gap-8 justify-between">


          <div className="flex flex-col gap-4">
            <h3 className="overall-summary__hint">{totalProblems} Opportunities to Increase Sales!</h3>
            <div className="overall-summary__steps grid grid-cols-2 gap-4">
              <div className={`overall-summary__step ${isHomepageComplete ? 'overall-summary__step--complete' : ''}`}>
                <span className={`overall-summary__step-count `}>{problemsByPage.homepage ? problemsByPage.homepage : "🔒"}</span>
                <p className="overall-summary__step-text">Home <span>page</span></p>

              </div>
              <div className={`overall-summary__step ${isCollectionComplete ? 'overall-summary__step--complete' : ''}`}>
                <span className={`overall-summary__step-count `}>{problemsByPage.collection ? problemsByPage.collection : "🔒"}</span>
                <p className="overall-summary__step-text">Collection <span>page</span></p>
              </div>
              <div className={`overall-summary__step ${isProductComplete ? 'overall-summary__step--complete' : ''}`}>
                <span className={`overall-summary__step-count `}>{problemsByPage.product ? problemsByPage.product : "🔒"}</span>
                <p className="overall-summary__step-text">Product <span>page</span></p>
              </div>
              <div className={`overall-summary__step ${isCartComplete ? 'overall-summary__step--complete' : ''}`}>
                <span className={`overall-summary__step-count`}>{problemsByPage.cart ? problemsByPage.cart : "🔒"}</span>
                <p className="overall-summary__step-text">Cart <span>page</span></p>
              </div>
            </div>

          </div>

          <div className="performance-summary">
            Based on our audit, <span>{reportCompleted ? finalPerformanceScore : "🔒"}</span>% is your <span>Fix My Store score </span> (FMS score)
          </div>

          {/* Download Report Button */}
          {/* <div className="download-section flex justify-center gap-4">
          {!noViewReport && (
            <Link href={reportUrl || '#'} className="download-button view" target="_blank">
              View Report
            </Link>
          )}
          <button className={"download-button view" + (reportCompleted ? '' : 'disabled')} onClick={() => setShowModal(true)} disabled={!reportCompleted}>
            Download Report
          </button>
        </div> */}

        </div>
      </div>
    </div>

  );
} 