/**
 * Why Optimize Apps Section Component
 * Displays the 3 key benefits of app optimization
 */

'use client';

import { motion } from 'framer-motion';
import { Zap, Target, TrendingUp } from 'lucide-react';

export function WhyOptimize() {
  const benefits = [
    {
      icon: Zap,
      title: "Faster Store",
      description: "Fewer apps mean quicker page loads.",
      color: "text-red-500"
    },
    {
      icon: Target,
      title: "Better Experience",
      description: "Right apps = smoother shopping flow.",
      color: "text-green-500"
    },
    {
      icon: TrendingUp,
      title: "Higher Sales",
      description: "Optimization boosts conversions.",
      color: "text-purple-500"
    }
  ];

  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="app-detection-section-title">
            Why optimize Apps?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm p-8 text-center hover:shadow-md transition-shadow duration-300"
            >
              {/* Icon */}
              <div className={`w-16 h-16 mx-auto mb-6 rounded-ful flex items-center justify-center`}>
                <img src={`/icons/${index + 4}.svg`} alt="" />
              </div>

              {/* Content */}
              <h3 className="sub-item__title text-center">
                {benefit.title}
              </h3>
              <p className="sub-item__description text-center">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
