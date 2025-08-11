import React, { useState, useEffect } from 'react';

const conversionQuotes = [
  {
    quote: "The average ecommerce conversion rate is 2.86%, but top performers achieve 5.31%",
    source: "Statista 2024",
    category: "stats"
  },
  {
    quote: "75% of consumers judge a company's credibility based on their website design",
    source: "Stanford Web Credibility Research",
    category: "design"
  },
  {
    quote: "Adding product videos can increase conversion rates by up to 80%",
    source: "Animoto",
    category: "content"
  },
  {
    quote: "Mobile users are 5x more likely to abandon a task if the site isn't optimized",
    source: "Google",
    category: "mobile"
  },
  {
    quote: "Sites that load in 2 seconds have an average bounce rate of 9%, while sites that load in 5 seconds have a bounce rate of 38%",
    source: "Google PageSpeed Insights",
    category: "performance"
  },
  {
    quote: "Personalized product recommendations can increase conversion rates by 70%",
    source: "Barilliance",
    category: "personalization"
  },
  {
    quote: "Adding trust badges can increase conversion rates by up to 15%",
    source: "Baymard Institute",
    category: "trust"
  },
  {
    quote: "The first 5 seconds of page-load time have the highest impact on conversion rates",
    source: "Portent",
    category: "performance"
  },
  {
    quote: "Sites with customer reviews see 18% more sales than those without",
    source: "Spiegel Research Center",
    category: "social-proof"
  },
  {
    quote: "A/B testing can increase conversion rates by an average of 49%",
    source: "ConversionXL",
    category: "optimization"
  }
];

export default function ConversionQuotes() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => 
        prevIndex === conversionQuotes.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentQuote = conversionQuotes[currentQuoteIndex];

  return (
    <div className="conversion-quotes">
      <div className="conversion-quotes__container">
        {/* <div className="conversion-quotes__icon">💡</div> */}
        <div className="conversion-quotes__content">
          <p className="conversion-quotes__quote">"{currentQuote.quote}"</p>
          <p className="conversion-quotes__source">— {currentQuote.source}</p>
        </div>
        {/* <div className="conversion-quotes__dots">
          {conversionQuotes.map((_, index) => (
            <div
              key={index}
              className={`conversion-quotes__dot ${
                index === currentQuoteIndex ? 'conversion-quotes__dot--active' : ''
              }`}
            />
          ))}
        </div> */}
      </div>
    </div>
  );
} 