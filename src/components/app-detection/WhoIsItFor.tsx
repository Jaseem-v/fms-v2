/**
 * Who Is It For Section Component
 * Displays the 4 target audience groups
 */

'use client';

import { motion } from 'framer-motion';
import { Store, Code, Truck, BarChart3 } from 'lucide-react';

export function WhoIsItFor() {
  const audiences = [
    {
      icon: Store,
      title: "Shopify Merchants",
      description: "Research competitors tech stacks and improve your own store or replicate winning strategies."
    },
    {
      icon: Code,
      title: "Developers",
      description: "Quickly extract app, theme and product data for client projects."
    },
    {
      icon: Truck,
      title: "Drop shippers",
      description: "Find winning products and reveal apps and theme behind successful drop shipping stores."
    },
    {
      icon: BarChart3,
      title: "Market Researchers",
      description: "Discover the hottest trending themes, apps, and products in the market."
    }
  ];

  return (
    <section className="py-16 ">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="app-detection-section-title">
            Who is it for?
          </h2>
        </motion.div>

        <div className="flex flex-col  gap-8 ">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={"flex items-center gap-4 " + (index % 2 === 0 ? "flex-row-reverse" : "flex-row")}
            >
              {/* Icon */}
              <div className=" bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 audiance__icon">
                {/* <audience.icon className="h-6 w-6 text-green-600" /> */}

                <img src={`/icons/${index + 7}.svg`} alt="" />
              </div>

              {/* Content */}
              <div className=' who-is-it-for__item'>
                <h3 className="sub-item__title">
                  {audience.title}
                </h3>
                <p className="sub-item__description">
                  {audience.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
