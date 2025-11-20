/**
 * How It Works Section Component
 * Displays the 3-step process for using the app detection tool
 */

'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { JSX } from 'react';

export function HowItWorks({steps}: {steps: {
  number: number;
  title: string;
  description: string;
  icon: JSX.Element;
}[]}) {
 
  return (
    <section className="py-16 how-it-works">
      <div className="max-w-5xl mx-auto px-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 items-center content-center justify-center">
          {steps.map((step, index) => (
          
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col max-w-sm how-it-works__item mx-auto"
              >
                {/* Step Number Circle */}
               {step.icon}

                {/* Step Content */}
                <h3 className="sub-item__title mt-4">
                  {step.title}
                </h3>
                <p className="sub-item__description">
                  {step.description}
                </p>

                <div className='how-it-works__step-number'>
                  {step.number}
                </div>
              </motion.div>

         
          ))}
        </div>
      </div>
    </section>
  );
}
