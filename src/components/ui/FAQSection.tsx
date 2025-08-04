'use client';

import React, { useState } from 'react';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How long does the audit take?",
      answer: "Most audits complete in 2-3 minutes, depending on your store size."
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
      question: "How detailed is the report?",
      answer: "You'll get specific recommendations for each page type with text explanations and screenshots from big brands for references also app recommendations to fix the issues"
    },
    {
      question: "What if my store is password protected?",
      answer: "The tool works with public stores only. Remove password protection temporarily for the audit."
    },
    {
      question: "How accurate is the audit?",
      answer: "Our tool analyzes your store using industry best practices. Since we don't have access to internal data, the report may have limitations. We recommend cross-checking insights for your specific needs."
    },
    {
      question: "Is the audit free?",
      answer: "No, because we are sure that this is a valuable resource and you can increase your sales by applying these to your website"
    },
    {
      question: "Can I get help implementing the recommendations?",
      answer: "Yes, we can help you implement the recommendations. However, please note that additional charges may apply for expert support and implementation assistance."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-16 bg-green-50 pb-0 pt-0">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="section-header__title">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="  overflow-hidden">
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
                  {openIndex == index ? <svg xmlns="http://www.w3.org/2000/svg" width="32" height="3" viewBox="0 0 32 3" fill="none">
                    <path d="M1 1.5H30.5" stroke="#007A2A" stroke-width="2" stroke-linecap="round" />
                  </svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
                      <path d="M1 16.5H30.5" stroke="#007A2A" stroke-width="2" stroke-linecap="round" />
                      <path d="M15.75 31.25L15.75 1.75" stroke="#007A2A" stroke-width="2" stroke-linecap="round" />
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