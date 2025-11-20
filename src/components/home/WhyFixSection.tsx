'use client';

import React, { useState } from 'react';

interface ChatMessage {
  id: number;
  name: string;
  avatar: string;
  message: string;
  timestamp: string;
  label?: 'low-performance' | 'worried-owners' | 'unsure-fix';
}

const chatMessages: ChatMessage[] = [
  {
    id: 1,
    name: 'Devon Carter',
    avatar: '/user/6.png',
    message: "Mobile users keep dropping off halfway through checkout. What's going on? 😩",
    timestamp: '10:42 AM',
    label: 'low-performance'
  },
  {
    id: 2,
    name: 'Sarah John',
    avatar: '/user/8.png',
    message: "Why are my product pages getting views but no one's checking out? 🤔",
    timestamp: '10:42 AM',
    label: 'low-performance'
  },
  {
    id: 3,
    name: 'Emma Sebastien',
    avatar: '/user/7.png',
    message: 'Our store takes forever to load lately, customers are complaining. 😠⏳',
    timestamp: '10:42 AM',
    label: 'low-performance'
  },
  {
    id: 4,
    name: 'Emily Parker',
    avatar: '/user/12.png',
    message: "I think we have too many Shopify apps, but I don't know which ones to remove. 😅",
    timestamp: '10:42 AM',
    label: 'worried-owners'
  },
  {
    id: 5,
    name: 'Liam Alen',
    avatar: '/user/9.png',
    message: 'We keep spending on ads, but conversions are flat. 😔',
    timestamp: '10:42 AM',
    label: 'worried-owners'
  },
  {
    id: 6,
    name: 'Lucius Marcus Reed',
    avatar: '/user/10.png',
    message: "SEO looks fine to me, but we're nowhere on Google results 🤨",
    timestamp: '10:42 AM',
    label: 'unsure-fix'
  },
  {
    id: 7,
    name: 'Stephy Mariya Noah',
    avatar: '/user/12.png',
    message: 'Our store takes forever to load lately, customers are complaining. 😠⏳',
    timestamp: '10:42 AM',
    label: 'unsure-fix'
  }
];

const WhyFixSection = () => {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');

  return (
    <section className="why-fix-section">
      <div className="why-fix-section__container">

        <div className="text-center mb-4 flex flex-col gap-4 why-fix-section__header">
          <h2 className="section-header__title">
            Why <span className="why-fix-section__title-highlight">FIX</span> FixMyStore.com?
          </h2>
        </div>

        <div className="why-fix-section__content">
          {/* Labels on the left */}
          <div className="why-fix-section__labels why-fix-section__labels--left">
            <div className="why-fix-section__label" data-label="low-performance">
              <span>Low performance</span>
            </div>
            <div className="why-fix-section__label" data-label="worried-owners">
              <span>Worried store owners</span>
            </div>
          </div>

          {/* Chat Interface Card */}
          <div className="why-fix-section__chat-card">
            {/* Tabs */}
            <div className="why-fix-section__tabs">
              <button
                className={`why-fix-section__tab ${activeTab === 'before' ? 'why-fix-section__tab--active' : ''}`}
                onClick={() => setActiveTab('before')}
              >
                Before
                <span className="why-fix-section__tab-domain">FixMyStore.com</span>
              </button>
              <button
                className={`why-fix-section__tab ${activeTab === 'after' ? 'why-fix-section__tab--active' : ''}`}
                onClick={() => setActiveTab('after')}
              >
                After
                <span className="why-fix-section__tab-domain">FixMyStore.com</span>
                <span className="why-fix-section__tab-badge">9+</span>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="why-fix-section__messages">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="why-fix-section__message" data-label={msg.label}>
                  <div className="why-fix-section__message-avatar"><img src={msg.avatar} alt={msg.name} /></div>
                  <div className="why-fix-section__message-content">
                    <div className="why-fix-section__message-header">
                      <span className="why-fix-section__message-name">{msg.name}</span>
                      <span className="why-fix-section__message-time">{msg.timestamp}</span>
                    </div>
                    <p className="why-fix-section__message-text">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Labels on the right */}
          <div className="why-fix-section__labels why-fix-section__labels--right">
            <div className="why-fix-section__label" data-label="unsure-fix">
              <span>Unsure what to fix!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyFixSection;

