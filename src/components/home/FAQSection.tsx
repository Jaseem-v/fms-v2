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
      answer: "Every page type is broken down with precise recommendations, detailed explanations, real-world brand examples, and app suggestions for resolving the issues."
    },
    {
      question: "What if my store is password protected?",
      answer: "The tool works with public stores only. Remove password protection temporarily for the audit."
    },
    {
      question: "How accurate is the audit?",
      answer: "Our audits are crafted using proven CRO frameworks and industry best practices, the same principles used by top-performing eCommerce brands. While the analysis doesn’t include internal store data, every recommendation is designed to be practical and easy to validate against the store’s unique goals."
    },
    {
      question: "Is the audit free?",
      answer: "No, our audits are a paid service as they deliver high-value, actionable insights based on proven CRO strategies. Applying these recommendations can directly improve store conversions and increase sales, making it a worthwhile investment."
    },
    {
      question: "Can I get help implementing the recommendations?",
      answer: "Absolutely. Our CRO experts can handle the implementation for you, ensuring every change is done right. Implementation is available as an add-on service, with pricing based on the level of support required."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-16 bg-green-50 pb-0">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-4">
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