/**
 * How It Works Section Component
 * Displays the 3-step process for using the app detection tool
 */

'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Enter Your Store URL",
      description: "We scan all apps currently installed on your store."
    },
    {
      number: 2,
      title: "Get a Smart Report",
      description: "See which apps are slowing you down and which ones can be replaced."
    },
    {
      number: 3,
      title: "Optimize Your Store",
      description: "Follow our recommendations to improve site speed and conversions instantly."
    }
  ];

  return (
    <section className="py-16 pt-0">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="app-detection-section-title">
            How it works?
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-start gap-8 lg:gap-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center max-w-sm"
              >
                {/* Step Number Circle */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#328900' }}>
                  <span className="text-white font-bold text-xl">
                    {step.number}
                  </span>
                </div>

                {/* Step Content */}
                <h3 className="sub-item__title text-center">
                  {step.title}
                </h3>
                <p className="sub-item__description text-center">
                  {step.description}
                </p>
              </motion.div>

              {/* Arrow (except for last step) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block mx-4 mt-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="202" height="2" viewBox="0 0 202 2" fill="none">
                    <path d="M1 1H201" stroke="black" stroke-linecap="round" stroke-dasharray="8 8" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
