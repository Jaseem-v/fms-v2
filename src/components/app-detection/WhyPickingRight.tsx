/**
 * Why Picking Right Apps Matters Section Component
 * Displays the problem description and call-to-action
 */

'use client';

import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

export function WhyPickingRight() {
  const problems = [
    "Install multiple apps that do the same job",
    "Choose apps that don't fit their store's real needs",
    "End up with a slower, bloated site that kills conversions"
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
          <h2 className="app-detection-section-title">
            Why picking the right apps matters?
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
              <span className="">The Shopify App Store has over 16,000 apps! </span> And that number keeps growing. With so many options, most store owners:
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
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-colors inline-flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Chrome Extension
          </button>
        </motion.div>
      </div>
    </section>
  );
}
