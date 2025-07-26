'use client';

import React, { useState } from 'react';

const AboutSections: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "I'm extremely satisfied with the CRO service. The recommendations were concise, actionable, and precise to what my brand required. Already paying off for my website experience, I'm convinced that it has long-lasting benefits for the future of RevealX Clothing. Highly recommend! Definitely worth investing for your brand's future.",
      time: "3:07 PM"
    },
    {
      text: "The analysis was incredibly detailed and helped us identify key conversion bottlenecks. Our sales increased by 40% within the first month!",
      time: "2:15 PM"
    },
    {
      text: "Best investment we made for our store. The actionable insights and app recommendations saved us months of trial and error.",
      time: "1:30 PM"
    }
  ];

  const targetAudience = [
    {
      icon: "🛍️",
      title: "Dropshipping Store Owners",
      description: "Just launched? Get actionable feedback"
    },
    {
      icon: "🛒",
      title: "New Shopify Store Owners",
      description: "Just launched? Get actionable feedback"
    },
    {
      icon: "📈",
      title: "Revenue-Generating Store Owners",
      description: "Just launched? Get actionable feedback"
    },
    {
      icon: "🔍",
      title: "CRO Agencies",
      description: "Just launched? Get actionable feedback"
    },
    {
      icon: "👥",
      title: "Shopify Agencies",
      description: "Just launched? Get actionable feedback"
    },
    {
      icon: "🎯",
      title: "Ecom store coaches",
      description: "Just launched? Get actionable feedback"
    }
  ];

  const riskFreeFeatures = [
    {
      icon: "💰",
      title: "One-time Payment",
      description: "You will get full CRO report + resources as soon as you complete the payment"
    },
    {
      icon: "🔄",
      title: "7 Day Refund Policy",
      description: "If you don't find it valuable, you can request refund, no questions asked."
    },
    {
      icon: "💝",
      title: "24*7 Support",
      description: "We are here to assist you if you need any help or clear doubts"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-green-50">
      {/* Who we are? Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-serif text-gray-900 mb-8">
              Who we are?
            </h2>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We are the team behind ConversionAB where we help Shopify stores improve sales by increasing conversion rate and improving offers.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                We also own Final Apps where we build Shopify apps to ease up the store management.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">30K+</div>
                  <div className="text-gray-700">stores used</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">20+</div>
                  <div className="text-gray-700">stores optimized</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                AZ
              </div>
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                U
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-serif text-gray-900 mb-8">
              Testimonials
            </h2>
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-center">
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 transition-colors"
              >
                ‹
              </button>
              
              <div className="max-w-4xl mx-auto relative">
                <div className="text-6xl text-orange-500 absolute -top-8 left-4">"</div>
                <div className="bg-gray-100 rounded-2xl p-8 mx-8">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {testimonials[currentTestimonial].text}
                  </p>
                  <div className="text-right text-sm text-gray-500">
                    {testimonials[currentTestimonial].time}
                  </div>
                </div>
                <div className="text-6xl text-orange-500 absolute -bottom-8 right-4">"</div>
              </div>
              
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 transition-colors"
              >
                ›
              </button>
            </div>
            
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who is this for? Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-serif text-gray-900 mb-8">
              Who is this for?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {targetAudience.map((item, index) => (
              <div key={index} className="bg-green-100 border border-green-200 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-700">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk-Free Purchase Section */}
      <section className="py-16 ">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-serif text-gray-900 mb-8">
              Risk-Free Purchase
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {riskFreeFeatures.map((item, index) => (
              <div key={index} className="bg-green-100 border border-green-200 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-700">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSections; 