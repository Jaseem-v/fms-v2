/**
 * Why Picking Right Apps Matters Section Component
 * Displays the problem description and call-to-action
 */

'use client';

import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

export function WhyPickingRight() {
  const problems = [
    "Discover which apps successful brands trust to power their growth.",
    "Avoid wasting resources on apps that don’t fit your store’s needs.",
    "Create a lean, conversion-boosting app stack without the guesswork."
  ];

  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="app-detection-section-title max-w-lg mx-auto ">
          Why look for Apps used in other Shopify stores?
          </h2>
        </motion.div>

        {/* Main Content Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="why-picking__container"
        >
          <div className="w-full flex justify-center">

            <p className="why-picking__title">
              <span className="">The Shopify App Store has over 16,000 apps! </span> Choosing the right ones can make or break your store. 
              Our tool helps you:
            </p>
          </div>
          {/* Problem Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 why-picking__problems">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4"
              >
                {/* <div className="w-full h-px bg-gray-200 mb-4"></div> */}
                <p className="why-picking__description">
                  {problem}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-700 mb-6">
            Our tool helps you cut through the noise
          </p>
          <button
            className="download-button"
          >
            {/* <Download className="h-5 w-5 mr-2" /> */}
            Download Chrome Extension
          </button>
        </motion.div>
      </div>
    </section>
  );
}
