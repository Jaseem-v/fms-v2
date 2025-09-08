import Link from "next/link";
import { useEffect, useState } from "react";
import { PagewiseAnalysisResult } from "@/hooks/useHomepageAnalysis";
import { useToast } from "@/contexts/ToastContext";
import { config } from "@/config/config";

interface Report {
  [key: string]: PagewiseAnalysisResult;
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
  const { showToast } = useToast();

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

        <Link href={`/`} className={`download-button flex gap-2 ${isSampleReport ? 'hidden md:flex' : ''}`}>
          {isSampleReport ? "Get your audit" : "Unlock full audit "}
          {isSampleReport ? <svg xmlns="http://www.w3.org/2000/svg" width="27" height="28" viewBox="0 0 27 28" fill="none">
            <path d="M14.625 19.6252L20.2501 14.0001L14.625 8.375M6.74988 19.6252L12.375 14.0001L6.74988 8.375" stroke="white" stroke-width="2.25004" stroke-linecap="round" stroke-linejoin="round" />
          </svg> : "- $" + config.pricing.mainPrice}
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

          <div>

            <div className="performance-summary">
              Based on our audit, <span>{reportCompleted ? finalPerformanceScore : "🔒"}</span>% is your <span>Fix My Store score </span> (FMS score)
            </div>
            {reportUrl && (
              <div className="report-url-section">
                <div className="report-url-container">
                  <div className="report-url-input-wrapper">
                    <div className="report-url-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <path d="M10.1311 13.5039C10.5605 14.078 11.1084 14.5531 11.7376 14.8968C12.3668 15.2406 13.0626 15.445 13.7777 15.4962C14.4929 15.5474 15.2106 15.4442 15.8824 15.1937C16.5542 14.9431 17.1642 14.5509 17.6711 14.0439L20.6711 11.0439C21.5819 10.1009 22.0858 8.83785 22.0744 7.52687C22.063 6.21588 21.5372 4.96182 20.6102 4.03478C19.6831 3.10774 18.429 2.58189 17.1181 2.5705C15.8071 2.55911 14.5441 3.06308 13.6011 3.97387L11.8811 5.68387M14.1311 11.5039C13.7016 10.9297 13.1537 10.4547 12.5245 10.1109C11.8953 9.76717 11.1996 9.56276 10.4844 9.51154C9.76927 9.46032 9.05147 9.5635 8.37971 9.81409C7.70795 10.0647 7.09794 10.4568 6.59106 10.9639L3.59106 13.9639C2.68027 14.9069 2.1763 16.1699 2.18769 17.4809C2.19908 18.7919 2.72493 20.0459 3.65197 20.973C4.57901 21.9 5.83307 22.4259 7.14405 22.4372C8.45504 22.4486 9.71805 21.9447 10.6611 21.0339L12.3711 19.3239" stroke="#131313" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={`https://fixmystore.com/report/${reportUrl}`}
                      readOnly
                      className="report-url-input"
                      onClick={(e) => e.currentTarget.select()}
                    />
                                         <button
                       className="report-url-copy-btn"
                       onClick={async () => {
                         try {
                           await navigator.clipboard.writeText(`https://fixmystore.com/report/${reportUrl}`);
                           showToast('Link copied to clipboard!', 'success');
                         } catch (err) {
                           showToast('Failed to copy link', 'error');
                         }
                       }}
                       title="Copy link"
                     >
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <path d="M5.63281 15.5H4.63281C4.10238 15.5 3.59367 15.2893 3.2186 14.9142C2.84353 14.5391 2.63281 14.0304 2.63281 13.5V4.5C2.63281 3.96957 2.84353 3.46086 3.2186 3.08579C3.59367 2.71071 4.10238 2.5 4.63281 2.5H13.6328C14.1632 2.5 14.672 2.71071 15.047 3.08579C15.4221 3.46086 15.6328 3.96957 15.6328 4.5V5.5M11.6328 9.5H20.6328C21.7374 9.5 22.6328 10.3954 22.6328 11.5V20.5C22.6328 21.6046 21.7374 22.5 20.6328 22.5H11.6328C10.5282 22.5 9.63281 21.6046 9.63281 20.5V11.5C9.63281 10.3954 10.5282 9.5 11.6328 9.5Z" stroke="#5760E2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}





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