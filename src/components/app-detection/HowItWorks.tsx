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
      description: "Simply paste the store URL you want to find issues with."
    },
    {
      number: 2,
      title: "Get a Smart Report",
      description: "Finalize which sections are to be fixed."
    },
    {
      number: 3,
      title: "Optimize Your Store",
      description: "Get proper recommendations based on the areas you selected."
    }
  ];

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

        <div className="flex flex-col lg:flex-row justify-center gap-16 items-center">
          {steps.map((step, index) => (
          
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col max-w-sm how-it-works__item"
              >
                {/* Step Number Circle */}
               <img src={`/app-detection-steps/${step.number}.svg`} alt=""  className='how-it-works__icon'/>

                {/* Step Content */}
                <h3 className="sub-item__title mt-4">
                  {step.title}
                </h3>
                <p className="sub-item__description">
                  {step.description}
                </p>
              </motion.div>

         
          ))}
        </div>
      </div>
    </section>
  );
}
