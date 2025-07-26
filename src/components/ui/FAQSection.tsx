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
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-serif text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <span className={`text-2xl font-bold transition-transform ${
                    openIndex === index ? 'text-green-600' : 'text-green-500'
                  }`}>
                    {openIndex === index ? '−' : '+'}
                  </span>
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <p className="text-gray-700 leading-relaxed">
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