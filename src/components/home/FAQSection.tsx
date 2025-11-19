'use client';

import React, { useState } from 'react';

const FAQSection: React.FC<{ isSplitPage?: boolean, type?: 'home' | 'collection' | 'product' | 'cart' | 'app-detection' }> = ({ isSplitPage, type }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const getFAQsByType = (pageType?: string) => {
    switch (pageType) {
      case 'home':
        return [
          {
            question: "1. What does FixMyStore audit in my Shopify store?",
            answer: "FixMyStore uses AI to scan your entire store for CRO issues, SEO gaps, mobile UX problems, page speed blockers, and app performance risks. You get a complete view of everything stopping visitors from converting."
          },
          {
            question: "2. How does the ChatGPT & AI SEO audit help my store rank in AI models?",
            answer: "Our AI evaluates your store the same way large language models like ChatGPT interpret content. It checks structure, clarity, metadata, product descriptions, and semantic signals — helping your store appear more often in AI search results and product recommendations."
          },
          {
            question: "3.  Will the audit affect my theme, code, or store performance?",
            answer: "No. FixMyStore doesn’t touch your theme, code, or apps. The entire audit is external and AI-driven, so your store stays safe, unaffected, and exactly the way it is."
          },
          {
            question: "4. How accurate are the AI suggestions, and what if I need help implementing them?",
            answer: "The recommendations are generated using AI trained on high-converting Shopify stores. Every issue is clearly explained and prioritized. If a fix needs deeper technical work, our expert team can assist with implementation."
          },
          {
            question: "5. Can FixMyStore identify issues caused by apps, scripts, and slow performance?",
            answer: "Yes. Our system detects heavy apps, unused scripts, large assets, and performance bottlenecks. You’ll know exactly what’s slowing your store down — and how to fix it."
          },

        ];

      case 'collection':
        return [
          {
            question: "Why is a collection page audit important?",
            answer: "Collection pages guide users to products. A poorly structured one confuses visitors and kills conversions."
          },
          {
            question: "How long does the audit take?",
            answer: "Most audits complete in 2-3 minutes, depending on your store size."
          },
          {
            question: "What areas do you review?",
            answer: "Filters, sorting, product arrangement, image quality, and mobile responsiveness."
          },
          {
            question: "Will you suggest tools to improve filters and navigation?",
            answer: "Yes, we recommend apps for smart filters, personalization, and better browsing."
          },
          {
            question: "Do I need to install anything?",
            answer: "No installation required. Just enter your store URL and we'll do the rest."
          },
          {
            question: "Do you offer refund?",
            answer: "Yes, if you don't find our report + resources not valuable, you can request for refund. No questions asked."
          },
          {
            question: "How accurate is the audit?",
            answer: "Our tool analyzes your store using industry best practices. Since we don't have access to internal data, the report may have limitations. We recommend cross-checking insights for your specific needs."
          },
          {
            question: "Is the audit free?",
            answer: "No, because we are sure that this is a valuable resource and you can increase your sales by applying these to your website."
          },
          {
            question: "Can I get help implementing the recommendations?",
            answer: "Yes, we can help you implement the recommendations. However, please note that additional charges may apply for expert support and implementation assistance."
          }
        ];

      case 'product':
        return [
          {
            question: "Why should I audit my product pages?",
            answer: "A product page is where the buying decision happens. Small issues can cause huge revenue loss."
          },
          {
            question: "How long does the audit take?",
            answer: "Most audits complete in 2-3 minutes, depending on your store size."
          },
          {
            question: "What do you analyze?",
            answer: "We review product descriptions, images, reviews, CTAs, trust badges, and layout."
          },
          {
            question: "Do I need to install anything?",
            answer: "No installation required. Just enter your store URL and we'll do the rest."
          },
          {
            question: "Do you offer refund?",
            answer: "Yes, if you don't find our report + resources not valuable, you can request for refund. No questions asked."
          },
          {
            question: "How accurate is the audit?",
            answer: "Our tool analyzes your store using industry best practices. Since we don't have access to internal data, the report may have limitations. We recommend cross-checking insights for your specific needs."
          },
          {
            question: "Is the audit free?",
            answer: "No, because we are sure that this is a valuable resource and you can increase your sales by applying these to your website."
          },
          {
            question: "Can I get help implementing the recommendations?",
            answer: "Yes, we can help you implement the recommendations. However, please note that additional charges may apply for expert support and implementation assistance."
          }
        ];

      case 'cart':
        return [
          {
            question: "Why is cart page optimization important?",
            answer: "Most users drop off at the cart. A clear, trust-building cart can save thousands in lost revenue."
          },
          {
            question: "How long does the audit take?",
            answer: "Most audits complete in 2-3 minutes, depending on your store size."
          },
          {
            question: "What do you review in the cart page audit?",
            answer: "Shipping visibility, discounts, urgency cues, upsells, and overall layout."
          },
          {
            question: "Will I get best practice references?",
            answer: "Yes, we provide screenshots from high-performing Shopify carts."
          },
          {
            question: "Do I need to install anything?",
            answer: "No installation required. Just enter your store URL and we'll do the rest."
          },
          {
            question: "Do you offer refund?",
            answer: "Yes, if you don't find our report + resources not valuable, you can request for refund. No questions asked."
          },
          {
            question: "How accurate is the audit?",
            answer: "Our tool analyzes your store using industry best practices. Since we don't have access to internal data, the report may have limitations. We recommend cross-checking insights for your specific needs."
          },
          {
            question: "Is the audit free?",
            answer: "No, because we are sure that this is a valuable resource and you can increase your sales by applying these to your website."
          },
          {
            question: "Can I get help implementing the recommendations?",
            answer: "Yes, we can help you implement the recommendations. However, please note that additional charges may apply for expert support and implementation assistance."
          }
        ];

      case 'app-detection':
        return [
          {
            question: "Do I need to give my Shopify login details?",
            answer: "No. You only need to enter your store URL. We scan publicly available data, no passwords or logins required."
          },
          {
            question: "Will this affect my store or apps in any way?",
            answer: "Not at all. Our tool is 100% read-only. It doesn't install, change, or delete anything from your store."
          },
          {
            question: "How accurate is the analysis?",
            answer: "We identify all apps currently active on your store and compare them against performance benchmarks and best alternatives."
          },
          {
            question: "How long does the audit take?",
            answer: "Less than 30 seconds. You'll get results almost instantly after entering your store URL."
          }
        ];

      default:
        return [
          {
            question: "1. What does FixMyStore audit in my Shopify store?",
            answer: "FixMyStore uses AI to scan your entire store for CRO issues, SEO gaps, mobile UX problems, page speed blockers, and app performance risks. You get a complete view of everything stopping visitors from converting."
          },
          {
            question: "2. How does the ChatGPT & AI SEO audit help my store rank in AI models?",
            answer: "Our AI evaluates your store the same way large language models like ChatGPT interpret content. It checks structure, clarity, metadata, product descriptions, and semantic signals — helping your store appear more often in AI search results and product recommendations."
          },
          {
            question: "3.  Will the audit affect my theme, code, or store performance?",
            answer: "No. FixMyStore doesn’t touch your theme, code, or apps. The entire audit is external and AI-driven, so your store stays safe, unaffected, and exactly the way it is."
          },
          {
            question: "4. How accurate are the AI suggestions, and what if I need help implementing them?",
            answer: "The recommendations are generated using AI trained on high-converting Shopify stores. Every issue is clearly explained and prioritized. If a fix needs deeper technical work, our expert team can assist with implementation."
          },
          {
            question: "5. Can FixMyStore identify issues caused by apps, scripts, and slow performance?",
            answer: "Yes. Our system detects heavy apps, unused scripts, large assets, and performance bottlenecks. You’ll know exactly what’s slowing your store down — and how to fix it."
          },

        ];
    }
  };

  const faqs = getFAQsByType(type);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-16  px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-4">
          <h2 className="section-header__title">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="overflow-hidden">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => toggleFAQ(index)}
                className="faq-item"
              >
                <h3 className="faq-item__title">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? <svg xmlns="http://www.w3.org/2000/svg" width="32" height="3" viewBox="0 0 32 3" fill="none">
                    <path d="M1 1.5H30.5" stroke="#007A2A" strokeWidth="2" strokeLinecap="round" />
                  </svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
                      <path d="M1 16.5H30.5" stroke="#007A2A" strokeWidth="2" strokeLinecap="round" />
                      <path d="M15.75 31.25L15.75 1.75" stroke="#007A2A" strokeWidth="2" strokeLinecap="round" />
                    </svg>}
                </div>
              </button>

              {openIndex === index && (
                <div className="">
                  <p className="faq-item__description">
                    {faq.answer}
                  </p>
                </div>
              )}

              {index < faqs.length - 1 && (
                <div className="border-b border-gray-200 mx-8"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 