import { useState, useEffect, useCallback, useRef } from 'react';
import analysisService from '../services/analysisService';
import shopifyValidationService from '../services/shopifyValidationService';

interface UserInfo {
  name: string;
  email: string;
  mobile: string;
}

export interface AnalysisItem {
  problem: string;
  solution: string;
  screenshotUrl?: string;
  relevantImages?: {
    id: string;
    imageUrl: string;
    useCases: string[];
    uploadDate: string;
    fileName: string;
    createdAt: string;
    updatedAt: string;
  }[];
  relevantAppReferences?: {
    id: string;
    name: string;
    iconUrl: string;
    description: string;
    useCases: string[];
    shopifyAppUrl: string;
    category: string;
    scrapedAt: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface Report {
  [key: string]: AnalysisItem[];
}

interface StatusMessage {
  description: string;
  step: number;

}

const initialReport: Report = {
  "homepage": [
    {
      "problem": "The main headline 'For the Love of Allah Sitteer' is not immediately clear about the product offering.",
      "solution": "Clarify the value proposition by including a brief description of the product or service offered, such as 'Premium Prayer Dresses & Gifts for Every Occasion'.",
      "relevantImages": [
        {
          "id": "6880b06ba94cce5342bdb989",
          "imageUrl": "/uploads/image_1753248601703.png",
          "useCases": [
            "Clear headline and subheadline structure for product clarity",
            "Product-focused hero images that connect to offerings",
            "Prominent call-to-action buttons with contrasting colors",
            "Hero section optimization for conversion"
          ],
          "uploadDate": "2025-07-23T05:30:01.705Z",
          "fileName": "image_1753248601703.png",
          "createdAt": "2025-07-23T09:50:35.524Z",
          "updatedAt": "2025-07-23T09:50:35.524Z"
        }
      ],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/homepage-1753354648054.png"
    },
    {
      "problem": "The call-to-action 'SHOP NOW' in the hero section blends into the background due to its muted color.",
      "solution": "Enhance the button's visibility by using a contrasting color, such as a bold green or blue, to make it stand out against the background.",
      "relevantImages": [
        {
          "id": "6880b06ba94cce5342bdb989",
          "imageUrl": "/uploads/image_1753248601703.png",
          "useCases": [
            "Clear headline and subheadline structure for product clarity",
            "Product-focused hero images that connect to offerings",
            "Prominent call-to-action buttons with contrasting colors",
            "Hero section optimization for conversion"
          ],
          "uploadDate": "2025-07-23T05:30:01.705Z",
          "fileName": "image_1753248601703.png",
          "createdAt": "2025-07-23T09:50:35.524Z",
          "updatedAt": "2025-07-23T09:50:35.524Z"
        }
      ],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/homepage-1753354648054.png"
    },
    {
      "problem": "The navigation menu is concise but lacks a direct link to featured categories or best sellers.",
      "solution": "Add quick links to popular categories like 'Prayer Dresses' or 'Gifting Options' directly in the navigation menu to improve accessibility.",
      "relevantImages": [
        {
          "id": "6880b06ba94cce5342bdb98d",
          "imageUrl": "/uploads/image_1753259580990.png",
          "useCases": [
            "best sellers section",
            "featured section",
            "products listing",
            "product cards grid"
          ],
          "uploadDate": "2025-07-23T08:33:00.992Z",
          "fileName": "image_1753259580990.png",
          "createdAt": "2025-07-23T09:50:35.611Z",
          "updatedAt": "2025-07-23T09:50:35.611Z"
        }
      ],
      "relevantAppReferences": [
        {
          "id": "6880b06ba94cce5342bdb97d",
          "name": "Buddha Mega Menu & Navigation",
          "iconUrl": "https://cdn.shopify.com/app-store/listing_images/1f2048e3e855cf4cfd55ccfc3eabbb3c/icon/CIeL15G2yfICEAE=.png",
          "description": "Beautiful drop down menu in minutes. \nNavigate easily through Products, Collections & Pages\n      \n      \n        This is not any drop down menu app. \nYou can easily create an advanced mega menu in minutes. \nAlso, we made the menus look really good using the latest design trends. This menu will improve the look of your store. \nYour customers can add to cart their favourite products & navigate through your categories straight from the menu. \n\n\n\n      \n      \n         This is not any drop down menu app. You can easily create an advanced mega menu in minutes. Also,  ...\n        more\n      \n      \n        \n          4 submenu designs: Tree, Simple, Tabbed, Contact\n        \n        \n          Simple menu items or lists linked to any product, collection, page of your store\n        \n        \n          Image on Collections, Products, Blogs, Pages, Custom, Banner\n        \n        \n          Countdown timer, labels, badges, icons, videos to showcase your promotions \n        \n        \n          Multi-language: translate the menu in any language of your shop with 1 click",
          "useCases": [
            "optimised navbar",
            "multi category navbar"
          ],
          "shopifyAppUrl": "https://apps.shopify.com/buddha-mega-menu",
          "category": "Customer Service",
          "scrapedAt": "2025-07-23T08:27:02.566Z",
          "createdAt": "2025-07-23T09:50:35.328Z",
          "updatedAt": "2025-07-23T09:50:35.328Z"
        }
      ],
      "screenshotUrl": "http://localhost:4000/screenshots/homepage-1753354648054.png"
    },
    {
      "problem": "The homepage lacks visible trust signals such as customer reviews or secure payment icons.",
      "solution": "Incorporate customer testimonials or review snippets and add secure payment icons near the footer or product sections to build trust.",
      "relevantImages": [
        {
          "id": "6880b06ba94cce5342bdb985",
          "imageUrl": "/uploads/image_1752566277349.png",
          "useCases": [
            "Customer testimonials and reviews section",
            "Useful for showing social proof",
            "Building trust",
            "Demonstrating customer satisfaction",
            "Can be used in homepage, product pages, or landing pages to increase conversion rates"
          ],
          "uploadDate": "2025-07-15T07:58:01.747Z",
          "fileName": "image_1752566277349.png",
          "createdAt": "2025-07-23T09:50:35.459Z",
          "updatedAt": "2025-07-23T09:50:35.459Z"
        }
      ],
      "relevantAppReferences": [
        {
          "id": "6880c02459ea9d30dd0f9916",
          "name": "Reelify Shoppable Video & UGC",
          "iconUrl": "https://cdn.shopify.com/app-store/listing_images/d1c131f3d394edbcfc2ad12c0aa0fae5/icon/CNuOh5bwq4YDEAE=.png",
          "description": "Turn your Instagram, TikTok videos into a shopping gallery!\nTo help people shop while they watch.\n      \n      \n        Make your store fun and shoppable with fast videos. Use TikTok, Instagram Reels, and UGC to show real people using your products. Add product tags inside autoplay sliders, floating videos, and carousels. Boost sales, ROAS, and engagement. Show TikTok Shops and Reels on your home, product, or collection pages. Reelify is made for Shopify and works great on mobile.\n      \n      \n         Make your store fun and shoppable with fast videos. Use TikTok, Instagram Reels, and UGC to show  ...\n        more\n      \n      \n        \n          Shoppable TikTok & Instagram videos on home, product, and collection pages\n        \n        \n          Import UGC videos from Instagram or TikTok with just one click\n        \n        \n          Boost store SEO by keeping shoppers engaged with video content\n        \n        \n          Video sliders and carousels that load fast and don’t slow your store\n        \n        \n          Optimized for mobile to give smooth video viewing on all devices",
          "useCases": [
            "video testimonials",
            "trust increase"
          ],
          "shopifyAppUrl": "https://apps.shopify.com/reel-app",
          "category": "Conversion",
          "scrapedAt": "2025-07-23T10:57:40.812Z",
          "createdAt": "2025-07-23T10:57:40.817Z",
          "updatedAt": "2025-07-23T10:57:40.817Z"
        },
        {
          "id": "6880b06ba94cce5342bdb981",
          "name": "Air Product Reviews App & UGC",
          "iconUrl": "https://cdn.shopify.com/app-store/listing_images/d636d73c74c4684a910d23211e0e6ddf/icon/CJbfpYa_9oYDEAE=.jpeg",
          "description": "Build your brand from zero? Make it grow with product reviews & testimonials that stand out\n      \n      \n        Whether you're a newcomer or a seasoned pro, Air Reviews makes turning trust into sales simple. Get your first reviews in just few orders with automated reviews requests, and rewarding discounts. Highlight your best reviews in: review box, star rating, carousel, testimonials... Build trust and convert visitors into customers with reviews. Drive traffic using right product reviews and UGC by SEO with review-rich snippets. With Air Reviews, you have a trusted partner to build trust and convert!\n      \n      \n         Whether you're a newcomer or a seasoned pro, Air Reviews makes turning trust into sales simple. Get ...\n        more\n      \n      \n        \n          Flexible widgets → Star rating, Carousel, Testimonial to build trust and convert\n        \n        \n          Automated requests → Convert orders into reviews, then reviews back to orders\n        \n        \n          Discounts for reviews → Reward to motivate customers to leave more reviews\n        \n        \n          SEO snippets → Boost traffic across Google search with review-rich snippets\n        \n        \n          24/7 support → Until you get what you want, even you are on the free plan",
          "useCases": [
            "trust building",
            "customer reviews"
          ],
          "shopifyAppUrl": "https://apps.shopify.com/air-reviews",
          "category": "Conversion",
          "scrapedAt": "2025-07-23T08:38:05.514Z",
          "createdAt": "2025-07-23T09:50:35.396Z",
          "updatedAt": "2025-07-23T09:50:35.396Z"
        }
      ],
      "screenshotUrl": "http://localhost:4000/screenshots/homepage-1753354648054.png"
    },
    {
      "problem": "The 'Why Sitteer?' section does not clearly differentiate the brand's offerings.",
      "solution": "Expand this section to highlight unique selling points, such as handmade quality or exclusive designs, to better convey brand superiority.",
      "relevantImages": [
        {
          "id": "6880b06ba94cce5342bdb989",
          "imageUrl": "/uploads/image_1753248601703.png",
          "useCases": [
            "Clear headline and subheadline structure for product clarity",
            "Product-focused hero images that connect to offerings",
            "Prominent call-to-action buttons with contrasting colors",
            "Hero section optimization for conversion"
          ],
          "uploadDate": "2025-07-23T05:30:01.705Z",
          "fileName": "image_1753248601703.png",
          "createdAt": "2025-07-23T09:50:35.524Z",
          "updatedAt": "2025-07-23T09:50:35.524Z"
        }
      ],
      "relevantAppReferences": [
        {
          "id": "6880c02459ea9d30dd0f9916",
          "name": "Reelify Shoppable Video & UGC",
          "iconUrl": "https://cdn.shopify.com/app-store/listing_images/d1c131f3d394edbcfc2ad12c0aa0fae5/icon/CNuOh5bwq4YDEAE=.png",
          "description": "Turn your Instagram, TikTok videos into a shopping gallery!\nTo help people shop while they watch.\n      \n      \n        Make your store fun and shoppable with fast videos. Use TikTok, Instagram Reels, and UGC to show real people using your products. Add product tags inside autoplay sliders, floating videos, and carousels. Boost sales, ROAS, and engagement. Show TikTok Shops and Reels on your home, product, or collection pages. Reelify is made for Shopify and works great on mobile.\n      \n      \n         Make your store fun and shoppable with fast videos. Use TikTok, Instagram Reels, and UGC to show  ...\n        more\n      \n      \n        \n          Shoppable TikTok & Instagram videos on home, product, and collection pages\n        \n        \n          Import UGC videos from Instagram or TikTok with just one click\n        \n        \n          Boost store SEO by keeping shoppers engaged with video content\n        \n        \n          Video sliders and carousels that load fast and don’t slow your store\n        \n        \n          Optimized for mobile to give smooth video viewing on all devices",
          "useCases": [
            "video testimonials",
            "trust increase"
          ],
          "shopifyAppUrl": "https://apps.shopify.com/reel-app",
          "category": "Conversion",
          "scrapedAt": "2025-07-23T10:57:40.812Z",
          "createdAt": "2025-07-23T10:57:40.817Z",
          "updatedAt": "2025-07-23T10:57:40.817Z"
        }
      ],
      "screenshotUrl": "http://localhost:4000/screenshots/homepage-1753354648054.png"
    },
    {
      "problem": "The product images are visually appealing but do not include quick-view or hover effects for more details.",
      "solution": "Implement hover effects that display additional product details or a quick-view option to enhance the shopping experience.",
      "relevantImages": [
        {
          "id": "6880b06ba94cce5342bdb98d",
          "imageUrl": "/uploads/image_1753259580990.png",
          "useCases": [
            "best sellers section",
            "featured section",
            "products listing",
            "product cards grid"
          ],
          "uploadDate": "2025-07-23T08:33:00.992Z",
          "fileName": "image_1753259580990.png",
          "createdAt": "2025-07-23T09:50:35.611Z",
          "updatedAt": "2025-07-23T09:50:35.611Z"
        }
      ],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/homepage-1753354648054.png"
    },
    {
      "problem": "The newsletter subscription section at the bottom does not offer an incentive for signing up.",
      "solution": "Offer a discount or free shipping on the first order as an incentive for visitors to subscribe to the newsletter.",
      "relevantImages": [],
      "relevantAppReferences": [
        {
          "id": "6880b06ba94cce5342bdb974",
          "name": "Profy Banner & Countdown Timer",
          "iconUrl": "https://cdn.shopify.com/app-store/listing_images/863f7db211f186fc2772693d498efb08/icon/COKKiYjE44ADEAE=.png",
          "description": "Show Coupon code banner, Sales Countdown timer, Scrolling Text, Rotating Banner slider, Message.\n      \n      \n        Improve your store sales and get more conversions with sticky discount & coupon code banner which allows visitors to copy discount code. Add urgency and get the attention of users by adding a sales countdown timer with an expiration date or fixed duration. Display scrolling text / marquee animated banner. Display multiple messages with Multi Rotating Announcement Banner Slider. Target banners based on the page URL, device type, etc, and translate text to user's local language.\n      \n      \n         Improve your store sales and get more conversions with sticky discount & coupon code banner which  ...\n        more\n      \n      \n        \n          Product Page Banner: Show coupon code bar, sales countdown timer & promo code.\n        \n        \n           Countdown Timer: Offer, Sale & Discount countdown, Order delivery timer.\n        \n        \n          Announcement Bar: Multiple banner messages with Multi Rotating Banner Slider.\n        \n        \n          Scrolling text / Marquee: Banners text with Horizontal ticker & Carousel. \n        \n        \n          Customize banner message, background image, color, position, etc.",
          "useCases": [
            "Show Coupon code banner, Sales Countdown timer, Scrolling Text, Rotating Banner slider, Message."
          ],
          "shopifyAppUrl": "https://apps.shopify.com/profy-promo-bar",
          "category": "Conversion",
          "scrapedAt": "2025-07-23T05:04:59.103Z",
          "createdAt": "2025-07-23T09:50:35.177Z",
          "updatedAt": "2025-07-23T09:50:35.177Z"
        }
      ],
      "screenshotUrl": "http://localhost:4000/screenshots/homepage-1753354648054.png"
    },
    {
      "problem": "The homepage lacks a dedicated section for telling the brand's story.",
      "solution": "Include a 'Our Story' section near the bottom with a compelling narrative about the brand's mission and values to engage visitors emotionally.",
      "relevantImages": [],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/homepage-1753354648054.png"
    },
    {
      "problem": "The mobile navigation and CTAs may not be optimized for thumb-friendly use.",
      "solution": "Ensure that the mobile version of the site has larger, easily clickable buttons and a simplified navigation for a better user experience.",
      "relevantImages": [
        {
          "id": "6880b06ba94cce5342bdb989",
          "imageUrl": "/uploads/image_1753248601703.png",
          "useCases": [
            "Clear headline and subheadline structure for product clarity",
            "Product-focused hero images that connect to offerings",
            "Prominent call-to-action buttons with contrasting colors",
            "Hero section optimization for conversion"
          ],
          "uploadDate": "2025-07-23T05:30:01.705Z",
          "fileName": "image_1753248601703.png",
          "createdAt": "2025-07-23T09:50:35.524Z",
          "updatedAt": "2025-07-23T09:50:35.524Z"
        }
      ],
      "relevantAppReferences": [
        {
          "id": "6880b06ba94cce5342bdb97d",
          "name": "Buddha Mega Menu & Navigation",
          "iconUrl": "https://cdn.shopify.com/app-store/listing_images/1f2048e3e855cf4cfd55ccfc3eabbb3c/icon/CIeL15G2yfICEAE=.png",
          "description": "Beautiful drop down menu in minutes. \nNavigate easily through Products, Collections & Pages\n      \n      \n        This is not any drop down menu app. \nYou can easily create an advanced mega menu in minutes. \nAlso, we made the menus look really good using the latest design trends. This menu will improve the look of your store. \nYour customers can add to cart their favourite products & navigate through your categories straight from the menu. \n\n\n\n      \n      \n         This is not any drop down menu app. You can easily create an advanced mega menu in minutes. Also,  ...\n        more\n      \n      \n        \n          4 submenu designs: Tree, Simple, Tabbed, Contact\n        \n        \n          Simple menu items or lists linked to any product, collection, page of your store\n        \n        \n          Image on Collections, Products, Blogs, Pages, Custom, Banner\n        \n        \n          Countdown timer, labels, badges, icons, videos to showcase your promotions \n        \n        \n          Multi-language: translate the menu in any language of your shop with 1 click",
          "useCases": [
            "optimised navbar",
            "multi category navbar"
          ],
          "shopifyAppUrl": "https://apps.shopify.com/buddha-mega-menu",
          "category": "Customer Service",
          "scrapedAt": "2025-07-23T08:27:02.566Z",
          "createdAt": "2025-07-23T09:50:35.328Z",
          "updatedAt": "2025-07-23T09:50:35.328Z"
        }
      ],
      "screenshotUrl": "http://localhost:4000/screenshots/homepage-1753354648054.png"
    }
  ],
  "collection": [
    {
      "problem": "The collection page displays 'SOLD OUT' on several products, which can be discouraging for customers.",
      "solution": "Implement a back-in-stock notification feature so customers can be alerted when the products are available again. This can keep potential buyers engaged and improve conversion rates.",
      "relevantImages": [],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/collection-1753354689046.png"
    },
    {
      "problem": "The product images are not uniformly sized, with some images appearing smaller than others, disrupting the visual harmony of the grid layout.",
      "solution": "Ensure all product images are of uniform size and aspect ratio to maintain a clean and professional appearance, enhancing the browsing experience.",
      "relevantImages": [
        {
          "id": "6880b06ba94cce5342bdb98d",
          "imageUrl": "/uploads/image_1753259580990.png",
          "useCases": [
            "best sellers section",
            "featured section",
            "products listing",
            "product cards grid"
          ],
          "uploadDate": "2025-07-23T08:33:00.992Z",
          "fileName": "image_1753259580990.png",
          "createdAt": "2025-07-23T09:50:35.611Z",
          "updatedAt": "2025-07-23T09:50:35.611Z"
        }
      ],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/collection-1753354689046.png"
    },
    {
      "problem": "The color of the 'SOLD OUT' label blends into the background, making it less noticeable at a glance.",
      "solution": "Use a contrasting color for the 'SOLD OUT' label to make it more visible and improve user experience by clearly communicating product availability.",
      "relevantImages": [
        {
          "id": "6880b06ba94cce5342bdb989",
          "imageUrl": "/uploads/image_1753248601703.png",
          "useCases": [
            "Clear headline and subheadline structure for product clarity",
            "Product-focused hero images that connect to offerings",
            "Prominent call-to-action buttons with contrasting colors",
            "Hero section optimization for conversion"
          ],
          "uploadDate": "2025-07-23T05:30:01.705Z",
          "fileName": "image_1753248601703.png",
          "createdAt": "2025-07-23T09:50:35.524Z",
          "updatedAt": "2025-07-23T09:50:35.524Z"
        },
        {
          "id": "6880b06ba94cce5342bdb98d",
          "imageUrl": "/uploads/image_1753259580990.png",
          "useCases": [
            "best sellers section",
            "featured section",
            "products listing",
            "product cards grid"
          ],
          "uploadDate": "2025-07-23T08:33:00.992Z",
          "fileName": "image_1753259580990.png",
          "createdAt": "2025-07-23T09:50:35.611Z",
          "updatedAt": "2025-07-23T09:50:35.611Z"
        }
      ],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/collection-1753354689046.png"
    },
    {
      "problem": "There are no visible filter options on the page, which could hinder the user's ability to find specific products quickly.",
      "solution": "Add visible and easily accessible filter options for categories like price, ratings, and availability to help customers quickly find what they're looking for.",
      "relevantImages": [],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/collection-1753354689046.png"
    },
    {
      "problem": "The product grid layout is inconsistent, with some rows containing one product and others containing two.",
      "solution": "Standardize the grid layout to consistently display two products per row to optimize space usage and improve the overall aesthetic of the collection page.",
      "relevantImages": [
        {
          "id": "6880b06ba94cce5342bdb98d",
          "imageUrl": "/uploads/image_1753259580990.png",
          "useCases": [
            "best sellers section",
            "featured section",
            "products listing",
            "product cards grid"
          ],
          "uploadDate": "2025-07-23T08:33:00.992Z",
          "fileName": "image_1753259580990.png",
          "createdAt": "2025-07-23T09:50:35.611Z",
          "updatedAt": "2025-07-23T09:50:35.611Z"
        }
      ],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/collection-1753354689046.png"
    },
    {
      "problem": "The navigation for sorting products is not prominently displayed, which might lead users to overlook it.",
      "solution": "Enhance the visibility of the sorting options by using a more prominent color or a dropdown arrow to indicate its functionality.",
      "relevantImages": [],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/collection-1753354689046.png"
    },
    {
      "problem": "Lack of quick view or hover effect for product details, which could enhance the shopping experience by allowing users to view essential information without leaving the page.",
      "solution": "Implement a quick view feature that allows users to see more details about a product by hovering over or clicking a button, reducing the need to navigate away from the collection page.",
      "relevantImages": [
        {
          "id": "6880b06ba94cce5342bdb98d",
          "imageUrl": "/uploads/image_1753259580990.png",
          "useCases": [
            "best sellers section",
            "featured section",
            "products listing",
            "product cards grid"
          ],
          "uploadDate": "2025-07-23T08:33:00.992Z",
          "fileName": "image_1753259580990.png",
          "createdAt": "2025-07-23T09:50:35.611Z",
          "updatedAt": "2025-07-23T09:50:35.611Z"
        }
      ],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/collection-1753354689046.png"
    }
  ],
  "product": [
    {
      "problem": "The product images are limited to two photos and do not show multiple angles, context-of-use, or have zoom capability.",
      "solution": "Add more high-resolution images showing the product from different angles and in context. Implement a zoom feature to allow users to see finer details.",
      "relevantImages": [],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/product-1753354716582.png"
    },
    {
      "problem": "The product description is brief and lacks detailed information about features, materials, and specific use cases.",
      "solution": "Expand the product description to include detailed information about the materials, key features, and potential use cases to better inform and persuade potential buyers.",
      "relevantImages": [],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/product-1753354716582.png"
    },
    {
      "problem": "The price and shipping information is not prominently displayed, with shipping details only available at checkout.",
      "solution": "Make the price more prominent by increasing the font size or using a contrasting color. Provide clear shipping information, such as estimated delivery time and cost, directly on the product page.",
      "relevantImages": [],
      "relevantAppReferences": [
        {
          "id": "6881e082f1a0192f35575aa9",
          "name": "Estimated Delivery Date: EOD",
          "iconUrl": "https://cdn.shopify.com/app-store/listing_images/8d24e93aa9db33e9311a7e9327cc7fa5/icon/CNfQ6YLrn_YCEAE=.png",
          "description": "Reduces your shipping date inquiries and increases customer satisfaction by showing an estimated delivery date on your product.\n      \n      \n        Estimated Delivery Date optimizes your conversion rate with an exact delivery date and helps you display estimated dispatch (shipping) and delivery dates on your product, cart and checkout pages.\n      \n      \n         Estimated Delivery Date optimizes your conversion rate with an exact delivery date and helps you  ...\n        more\n      \n      \n        \n          Unlimited estimated delivery date with urgency Countdown Timer\n        \n        \n          Visitor timezone based date calculation and Week-off days and Business holiday settings\n        \n        \n          Target all/specific products and override settings\n        \n        \n          Templates customizable (messages, date format, styles, languages)\n        \n        \n          Fully customizable and easy to setup and use",
          "useCases": [
            "estimate delivery date"
          ],
          "shopifyAppUrl": "https://apps.shopify.com/order-delivery-estimated",
          "category": "Conversion",
          "scrapedAt": "2025-07-24T07:28:02.293Z",
          "createdAt": "2025-07-24T07:28:02.300Z",
          "updatedAt": "2025-07-24T07:28:02.300Z"
        },
        {
          "id": "6880b06ba94cce5342bdb974",
          "name": "Profy Banner & Countdown Timer",
          "iconUrl": "https://cdn.shopify.com/app-store/listing_images/863f7db211f186fc2772693d498efb08/icon/COKKiYjE44ADEAE=.png",
          "description": "Show Coupon code banner, Sales Countdown timer, Scrolling Text, Rotating Banner slider, Message.\n      \n      \n        Improve your store sales and get more conversions with sticky discount & coupon code banner which allows visitors to copy discount code. Add urgency and get the attention of users by adding a sales countdown timer with an expiration date or fixed duration. Display scrolling text / marquee animated banner. Display multiple messages with Multi Rotating Announcement Banner Slider. Target banners based on the page URL, device type, etc, and translate text to user's local language.\n      \n      \n         Improve your store sales and get more conversions with sticky discount & coupon code banner which  ...\n        more\n      \n      \n        \n          Product Page Banner: Show coupon code bar, sales countdown timer & promo code.\n        \n        \n           Countdown Timer: Offer, Sale & Discount countdown, Order delivery timer.\n        \n        \n          Announcement Bar: Multiple banner messages with Multi Rotating Banner Slider.\n        \n        \n          Scrolling text / Marquee: Banners text with Horizontal ticker & Carousel. \n        \n        \n          Customize banner message, background image, color, position, etc.",
          "useCases": [
            "Show Coupon code banner, Sales Countdown timer, Scrolling Text, Rotating Banner slider, Message."
          ],
          "shopifyAppUrl": "https://apps.shopify.com/profy-promo-bar",
          "category": "Conversion",
          "scrapedAt": "2025-07-23T05:04:59.103Z",
          "createdAt": "2025-07-23T09:50:35.177Z",
          "updatedAt": "2025-07-23T09:50:35.177Z"
        }
      ],
      "screenshotUrl": "http://localhost:4000/screenshots/product-1753354716582.png"
    },
    {
      "problem": "The 'Add to Cart' button blends into the page due to its gray color and lacks prominence.",
      "solution": "Change the 'Add to Cart' button color to a more vibrant hue that stands out against the background and use a bolder font to make it more visually commanding.",
      "relevantImages": [
        {
          "id": "6880b06ba94cce5342bdb989",
          "imageUrl": "/uploads/image_1753248601703.png",
          "useCases": [
            "Clear headline and subheadline structure for product clarity",
            "Product-focused hero images that connect to offerings",
            "Prominent call-to-action buttons with contrasting colors",
            "Hero section optimization for conversion"
          ],
          "uploadDate": "2025-07-23T05:30:01.705Z",
          "fileName": "image_1753248601703.png",
          "createdAt": "2025-07-23T09:50:35.524Z",
          "updatedAt": "2025-07-23T09:50:35.524Z"
        }
      ],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/product-1753354716582.png"
    },
    {
      "problem": "There are no customer reviews or ratings visible on the page, which can affect trust and decision-making.",
      "solution": "Encourage previous buyers to leave reviews and display these prominently on the page, along with an average rating, to build trust and assist in purchase decisions.",
      "relevantImages": [
        {
          "id": "6880b06ba94cce5342bdb985",
          "imageUrl": "/uploads/image_1752566277349.png",
          "useCases": [
            "Customer testimonials and reviews section",
            "Useful for showing social proof",
            "Building trust",
            "Demonstrating customer satisfaction",
            "Can be used in homepage, product pages, or landing pages to increase conversion rates"
          ],
          "uploadDate": "2025-07-15T07:58:01.747Z",
          "fileName": "image_1752566277349.png",
          "createdAt": "2025-07-23T09:50:35.459Z",
          "updatedAt": "2025-07-23T09:50:35.459Z"
        }
      ],
      "relevantAppReferences": [
        {
          "id": "6880b06ba94cce5342bdb981",
          "name": "Air Product Reviews App & UGC",
          "iconUrl": "https://cdn.shopify.com/app-store/listing_images/d636d73c74c4684a910d23211e0e6ddf/icon/CJbfpYa_9oYDEAE=.jpeg",
          "description": "Build your brand from zero? Make it grow with product reviews & testimonials that stand out\n      \n      \n        Whether you're a newcomer or a seasoned pro, Air Reviews makes turning trust into sales simple. Get your first reviews in just few orders with automated reviews requests, and rewarding discounts. Highlight your best reviews in: review box, star rating, carousel, testimonials... Build trust and convert visitors into customers with reviews. Drive traffic using right product reviews and UGC by SEO with review-rich snippets. With Air Reviews, you have a trusted partner to build trust and convert!\n      \n      \n         Whether you're a newcomer or a seasoned pro, Air Reviews makes turning trust into sales simple. Get ...\n        more\n      \n      \n        \n          Flexible widgets → Star rating, Carousel, Testimonial to build trust and convert\n        \n        \n          Automated requests → Convert orders into reviews, then reviews back to orders\n        \n        \n          Discounts for reviews → Reward to motivate customers to leave more reviews\n        \n        \n          SEO snippets → Boost traffic across Google search with review-rich snippets\n        \n        \n          24/7 support → Until you get what you want, even you are on the free plan",
          "useCases": [
            "trust building",
            "customer reviews"
          ],
          "shopifyAppUrl": "https://apps.shopify.com/air-reviews",
          "category": "Conversion",
          "scrapedAt": "2025-07-23T08:38:05.514Z",
          "createdAt": "2025-07-23T09:50:35.396Z",
          "updatedAt": "2025-07-23T09:50:35.396Z"
        }
      ],
      "screenshotUrl": "http://localhost:4000/screenshots/product-1753354716582.png"
    },
    {
      "problem": "The page lacks urgency messaging, such as low-stock alerts or limited-time offers.",
      "solution": "Implement urgency tactics like a low-stock indicator or a countdown timer for special offers to encourage quicker purchasing decisions.",
      "relevantImages": [],
      "relevantAppReferences": [
        {
          "id": "6881e082f1a0192f35575aa9",
          "name": "Estimated Delivery Date: EOD",
          "iconUrl": "https://cdn.shopify.com/app-store/listing_images/8d24e93aa9db33e9311a7e9327cc7fa5/icon/CNfQ6YLrn_YCEAE=.png",
          "description": "Reduces your shipping date inquiries and increases customer satisfaction by showing an estimated delivery date on your product.\n      \n      \n        Estimated Delivery Date optimizes your conversion rate with an exact delivery date and helps you display estimated dispatch (shipping) and delivery dates on your product, cart and checkout pages.\n      \n      \n         Estimated Delivery Date optimizes your conversion rate with an exact delivery date and helps you  ...\n        more\n      \n      \n        \n          Unlimited estimated delivery date with urgency Countdown Timer\n        \n        \n          Visitor timezone based date calculation and Week-off days and Business holiday settings\n        \n        \n          Target all/specific products and override settings\n        \n        \n          Templates customizable (messages, date format, styles, languages)\n        \n        \n          Fully customizable and easy to setup and use",
          "useCases": [
            "estimate delivery date"
          ],
          "shopifyAppUrl": "https://apps.shopify.com/order-delivery-estimated",
          "category": "Conversion",
          "scrapedAt": "2025-07-24T07:28:02.293Z",
          "createdAt": "2025-07-24T07:28:02.300Z",
          "updatedAt": "2025-07-24T07:28:02.300Z"
        },
        {
          "id": "6880b06ba94cce5342bdb974",
          "name": "Profy Banner & Countdown Timer",
          "iconUrl": "https://cdn.shopify.com/app-store/listing_images/863f7db211f186fc2772693d498efb08/icon/COKKiYjE44ADEAE=.png",
          "description": "Show Coupon code banner, Sales Countdown timer, Scrolling Text, Rotating Banner slider, Message.\n      \n      \n        Improve your store sales and get more conversions with sticky discount & coupon code banner which allows visitors to copy discount code. Add urgency and get the attention of users by adding a sales countdown timer with an expiration date or fixed duration. Display scrolling text / marquee animated banner. Display multiple messages with Multi Rotating Announcement Banner Slider. Target banners based on the page URL, device type, etc, and translate text to user's local language.\n      \n      \n         Improve your store sales and get more conversions with sticky discount & coupon code banner which  ...\n        more\n      \n      \n        \n          Product Page Banner: Show coupon code bar, sales countdown timer & promo code.\n        \n        \n           Countdown Timer: Offer, Sale & Discount countdown, Order delivery timer.\n        \n        \n          Announcement Bar: Multiple banner messages with Multi Rotating Banner Slider.\n        \n        \n          Scrolling text / Marquee: Banners text with Horizontal ticker & Carousel. \n        \n        \n          Customize banner message, background image, color, position, etc.",
          "useCases": [
            "Show Coupon code banner, Sales Countdown timer, Scrolling Text, Rotating Banner slider, Message."
          ],
          "shopifyAppUrl": "https://apps.shopify.com/profy-promo-bar",
          "category": "Conversion",
          "scrapedAt": "2025-07-23T05:04:59.103Z",
          "createdAt": "2025-07-23T09:50:35.177Z",
          "updatedAt": "2025-07-23T09:50:35.177Z"
        }
      ],
      "screenshotUrl": "http://localhost:4000/screenshots/product-1753354716582.png"
    },
    {
      "problem": "No clear information on return policy, which can deter potential buyers.",
      "solution": "Include a brief summary of the return policy near the price or CTA to reassure customers about the ease of returns.",
      "relevantImages": [],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/product-1753354716582.png"
    },
    {
      "problem": "The related products section ('You may also like') has placeholder images, which disrupts the visual appeal.",
      "solution": "Ensure all related products have actual images to provide a cohesive and visually appealing browsing experience.",
      "relevantImages": [
        {
          "id": "6880b06ba94cce5342bdb98d",
          "imageUrl": "/uploads/image_1753259580990.png",
          "useCases": [
            "best sellers section",
            "featured section",
            "products listing",
            "product cards grid"
          ],
          "uploadDate": "2025-07-23T08:33:00.992Z",
          "fileName": "image_1753259580990.png",
          "createdAt": "2025-07-23T09:50:35.611Z",
          "updatedAt": "2025-07-23T09:50:35.611Z"
        }
      ],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/product-1753354716582.png"
    }
  ],
  "cart": [
    {
      "problem": "The cart page lacks a shipping calculator or clear shipping options, which might cause uncertainty about additional costs.",
      "solution": "Add a shipping calculator or display estimated shipping costs directly on the cart page to provide transparency and reduce friction.",
      "relevantImages": [],
      "relevantAppReferences": [
        {
          "id": "6881e082f1a0192f35575aa9",
          "name": "Estimated Delivery Date: EOD",
          "iconUrl": "https://cdn.shopify.com/app-store/listing_images/8d24e93aa9db33e9311a7e9327cc7fa5/icon/CNfQ6YLrn_YCEAE=.png",
          "description": "Reduces your shipping date inquiries and increases customer satisfaction by showing an estimated delivery date on your product.\n      \n      \n        Estimated Delivery Date optimizes your conversion rate with an exact delivery date and helps you display estimated dispatch (shipping) and delivery dates on your product, cart and checkout pages.\n      \n      \n         Estimated Delivery Date optimizes your conversion rate with an exact delivery date and helps you  ...\n        more\n      \n      \n        \n          Unlimited estimated delivery date with urgency Countdown Timer\n        \n        \n          Visitor timezone based date calculation and Week-off days and Business holiday settings\n        \n        \n          Target all/specific products and override settings\n        \n        \n          Templates customizable (messages, date format, styles, languages)\n        \n        \n          Fully customizable and easy to setup and use",
          "useCases": [
            "estimate delivery date"
          ],
          "shopifyAppUrl": "https://apps.shopify.com/order-delivery-estimated",
          "category": "Conversion",
          "scrapedAt": "2025-07-24T07:28:02.293Z",
          "createdAt": "2025-07-24T07:28:02.300Z",
          "updatedAt": "2025-07-24T07:28:02.300Z"
        }
      ],
      "screenshotUrl": "http://localhost:4000/screenshots/cart-with-products-1753354765993.png"
    },
    {
      "problem": "The page does not display any trust signals such as security badges or accepted payment methods, which may reduce customer confidence.",
      "solution": "Include visible trust signals like security badges and icons for accepted payment methods to reassure customers about the security of their purchase.",
      "relevantImages": [],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/cart-with-products-1753354765993.png"
    },
    {
      "problem": "There is no indication of the checkout progress, which can leave users uncertain about how many steps are left in the process.",
      "solution": "Implement a progress indicator to clearly show users their current step in the checkout process and how many steps remain.",
      "relevantImages": [],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/cart-with-products-1753354765993.png"
    },
    {
      "problem": "The cart page does not highlight any urgency cues or incentives such as free shipping thresholds.",
      "solution": "Introduce urgency cues like limited-time offers or highlight free shipping thresholds to motivate users to complete their purchase.",
      "relevantImages": [],
      "relevantAppReferences": [
        {
          "id": "6881e082f1a0192f35575aa9",
          "name": "Estimated Delivery Date: EOD",
          "iconUrl": "https://cdn.shopify.com/app-store/listing_images/8d24e93aa9db33e9311a7e9327cc7fa5/icon/CNfQ6YLrn_YCEAE=.png",
          "description": "Reduces your shipping date inquiries and increases customer satisfaction by showing an estimated delivery date on your product.\n      \n      \n        Estimated Delivery Date optimizes your conversion rate with an exact delivery date and helps you display estimated dispatch (shipping) and delivery dates on your product, cart and checkout pages.\n      \n      \n         Estimated Delivery Date optimizes your conversion rate with an exact delivery date and helps you  ...\n        more\n      \n      \n        \n          Unlimited estimated delivery date with urgency Countdown Timer\n        \n        \n          Visitor timezone based date calculation and Week-off days and Business holiday settings\n        \n        \n          Target all/specific products and override settings\n        \n        \n          Templates customizable (messages, date format, styles, languages)\n        \n        \n          Fully customizable and easy to setup and use",
          "useCases": [
            "estimate delivery date"
          ],
          "shopifyAppUrl": "https://apps.shopify.com/order-delivery-estimated",
          "category": "Conversion",
          "scrapedAt": "2025-07-24T07:28:02.293Z",
          "createdAt": "2025-07-24T07:28:02.300Z",
          "updatedAt": "2025-07-24T07:28:02.300Z"
        },
        {
          "id": "6880b06ba94cce5342bdb974",
          "name": "Profy Banner & Countdown Timer",
          "iconUrl": "https://cdn.shopify.com/app-store/listing_images/863f7db211f186fc2772693d498efb08/icon/COKKiYjE44ADEAE=.png",
          "description": "Show Coupon code banner, Sales Countdown timer, Scrolling Text, Rotating Banner slider, Message.\n      \n      \n        Improve your store sales and get more conversions with sticky discount & coupon code banner which allows visitors to copy discount code. Add urgency and get the attention of users by adding a sales countdown timer with an expiration date or fixed duration. Display scrolling text / marquee animated banner. Display multiple messages with Multi Rotating Announcement Banner Slider. Target banners based on the page URL, device type, etc, and translate text to user's local language.\n      \n      \n         Improve your store sales and get more conversions with sticky discount & coupon code banner which  ...\n        more\n      \n      \n        \n          Product Page Banner: Show coupon code bar, sales countdown timer & promo code.\n        \n        \n           Countdown Timer: Offer, Sale & Discount countdown, Order delivery timer.\n        \n        \n          Announcement Bar: Multiple banner messages with Multi Rotating Banner Slider.\n        \n        \n          Scrolling text / Marquee: Banners text with Horizontal ticker & Carousel. \n        \n        \n          Customize banner message, background image, color, position, etc.",
          "useCases": [
            "Show Coupon code banner, Sales Countdown timer, Scrolling Text, Rotating Banner slider, Message."
          ],
          "shopifyAppUrl": "https://apps.shopify.com/profy-promo-bar",
          "category": "Conversion",
          "scrapedAt": "2025-07-23T05:04:59.103Z",
          "createdAt": "2025-07-23T09:50:35.177Z",
          "updatedAt": "2025-07-23T09:50:35.177Z"
        }
      ],
      "screenshotUrl": "http://localhost:4000/screenshots/cart-with-products-1753354765993.png"
    },
    {
      "problem": "The 'Update Cart' and 'Check Out' buttons are not visually distinct, potentially leading to user confusion.",
      "solution": "Use contrasting colors or design elements to make the 'Check Out' button more prominent than the 'Update Cart' button, guiding users towards completing their purchase.",
      "relevantImages": [
        {
          "id": "6880b06ba94cce5342bdb989",
          "imageUrl": "/uploads/image_1753248601703.png",
          "useCases": [
            "Clear headline and subheadline structure for product clarity",
            "Product-focused hero images that connect to offerings",
            "Prominent call-to-action buttons with contrasting colors",
            "Hero section optimization for conversion"
          ],
          "uploadDate": "2025-07-23T05:30:01.705Z",
          "fileName": "image_1753248601703.png",
          "createdAt": "2025-07-23T09:50:35.524Z",
          "updatedAt": "2025-07-23T09:50:35.524Z"
        }
      ],
      "relevantAppReferences": [],
      "screenshotUrl": "http://localhost:4000/screenshots/cart-with-products-1753354765993.png"
    }
  ]
}

export function useAnalysis() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [screenshotUrls, setScreenshotUrls] = useState<{ [key: string]: string }>({});
  const [screenshotsInProgress, setScreenshotsInProgress] = useState<{ [key: string]: boolean }>({});
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisInProgress, setAnalysisInProgress] = useState<{ [key: string]: boolean }>({});
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    mobile: '',
  });

  // Shopify validation state
  const [validatingShopify, setValidatingShopify] = useState(false);
  const [shopifyValidationError, setShopifyValidationError] = useState<string | null>(null);

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Download loading state
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Use refs to track current state for completion checking
  const reportRef = useRef<Report | null>(null);
  const analysisInProgressRef = useRef<{ [key: string]: boolean }>({});
  const completedJobsRef = useRef<Set<string>>(new Set());
  const activeTabRef = useRef<string>('');

  // Update refs when state changes
  useEffect(() => {
    reportRef.current = report;
  }, [report]);

  useEffect(() => {
    analysisInProgressRef.current = analysisInProgress;
  }, [analysisInProgress]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const statusMessages: Record<string, StatusMessage> = {
    // Sequential step-by-step process messages
    'step-1-homepage-start': { description: '🚀 Starting Step 1: Homepage Analysis', step: 1 },
    'step-1-homepage-complete': { description: '✅ Step 1 Complete: Homepage Analysis', step: 1 },
    'step-2-collection-start': { description: '🚀 Starting Step 2: Collection Page Analysis', step: 2 },
    'step-2-collection-complete': { description: '✅ Step 2 Complete: Collection Page Analysis', step: 2 },
    'step-3-product-start': { description: '🚀 Starting Step 3: Product Page Analysis', step: 3 },
    'step-3-product-complete': { description: '✅ Step 3 Complete: Product Page Analysis', step: 3 },
    'step-4-cart-start': { description: '🚀 Starting Step 4: Cart Page Analysis', step: 4 },
    'step-4-cart-complete': { description: '✅ Step 4 Complete: Cart Page Analysis', step: 4 },
    'wait-between-steps': { description: '⏳ Waiting between steps...', step: 0 },
    'wait-for-previous-analyses': { description: '⏳ Waiting for previous analyses to complete...', step: 0 },
    'fallback-to-puppeteer': { description: '🔄 External API failed, using local screenshot...', step: 0 },
    'all-steps-complete': { description: '🎉 All Analysis Steps Completed!', step: 5 },
    'error-occurred': { description: '❌ An error occurred during analysis', step: 0 },
    'starting': { description: '🚀 Initializing sequential analysis...', step: 0 },
    'complete': { description: '✅ Analysis completed successfully!', step: 5 },

    // Individual process messages
    'screenshot-homepage': { description: '📸 Taking homepage screenshot...', step: 1 },
    'screenshot-collection': { description: '📸 Taking collection page screenshot...', step: 2 },
    'search-product-page': { description: '🔍 Searching for product page...', step: 3 },
    'screenshot-product': { description: '📸 Taking product page screenshot...', step: 3 },
    'add-cart': { description: '🛒 Adding product to cart...', step: 4 },
    'screenshot-cart': { description: '📸 Taking cart page screenshot...', step: 4 },
    'cart-error': { description: '❌ Could not add product to cart', step: 4 },
    'no-products': { description: '❌ No in-stock products found', step: 3 },
    'analyze-homepage': { description: '🧠 Analyzing home page...', step: 1 },
    'analyze-collection': { description: '🧠 Analyzing collection page...', step: 2 },
    'analyze-product': { description: '🧠 Analyzing product page...', step: 3 },
    'analyze-cart': { description: '🧠 Analyzing cart page...', step: 4 },
    'cleanup': { description: '🧹 Cleaning up temporary files...', step: 5 },
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerActive) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerActive]);

  // Format time function
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const resetState = useCallback(() => {
    setLoading(true);
    setError(null);
    setShopifyValidationError(null); // Clear any previous validation errors
    setReport(null);
    setActiveTab('');
    setStatus(null);
    setScreenshotUrls({});
    setScreenshotsInProgress({});
    setAnalysisComplete(false);
    setAnalysisInProgress({});

    // Reset completed jobs tracking
    completedJobsRef.current.clear();

    // Start timer
    setElapsedTime(0);
    setStartTime(new Date());
    setTimerActive(true);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();

    try {
      // First, validate if it's a Shopify site
      setValidatingShopify(true);
      console.log('[SHOPIFY VALIDATION] Starting validation for URL:', url);

      const validationResult = await shopifyValidationService.validateShopifySite(url);

      if (!validationResult.isShopify) {
        setShopifyValidationError(validationResult.message || 'This does not appear to be a Shopify site');
        setValidatingShopify(false);
        setLoading(false); // Stop the loading state
        setTimerActive(false); // Stop the timer
        return;
      }

      console.log('[SHOPIFY VALIDATION] ✅ Validated as Shopify site');
      setValidatingShopify(false);

      const domain = new URL(url).hostname;

      console.log('[SEQUENTIAL] Starting sequential analysis for domain:', domain);

      // Start sequential analysis
      const result = await analysisService.startSequentialAnalysis(domain);
      const jobId = result.jobId;

      console.log('[SEQUENTIAL] Started with jobId:', jobId);

      // Poll for sequential analysis results
      const pollInterval = setInterval(async () => {
        try {
          const status = await analysisService.getSequentialAnalysisStatus(jobId);
          console.log('[SEQUENTIAL] Status:', status);

          if (status.error) {
            console.error('[SEQUENTIAL] Analysis error:', status.error);
            setError(`Analysis failed: ${status.error}`);
            clearInterval(pollInterval);
            return;
          }

          // Update status
          if (status.status) {
            setStatus(status.status);

            // Handle screenshot URL updates
            if (status.status.startsWith('screenshot-url:')) {
              const parts = status.status.split(':');
              if (parts.length >= 4) {
                const pageType = parts[1];
                const screenshotUrl = parts.slice(2).join(':'); // Rejoin the URL parts
                console.log('[SCREENSHOT] Received URL for', pageType, ':', screenshotUrl);
                setScreenshotUrls(prev => ({
                  ...prev,
                  [pageType]: screenshotUrl
                }));
                setScreenshotsInProgress(prev => ({
                  ...prev,
                  [pageType]: false
                }));
              }
            }

            // Handle screenshot progress
            if (status.status.startsWith('screenshot-') && !status.status.startsWith('screenshot-url:')) {
              const pageType = status.status.replace('screenshot-', '');
              setScreenshotsInProgress(prev => ({
                ...prev,
                [pageType]: true
              }));
            }

            // Handle analysis progress
            if (status.status.startsWith('analyze-')) {
              const pageType = status.status.replace('analyze-', '');
              setAnalysisInProgress(prev => ({
                ...prev,
                [pageType]: true
              }));
            }
          }

          // Check if analysis is complete
          if (status.complete && status.analysis) {
            console.log('[COMPLETE] Final analysis data:', status.analysis);
            console.log('[COMPLETE] Screenshot URLs:', screenshotUrls);
            console.log('[COMPLETE] Screenshots from backend:', status.screenshots);

            // Add screenshot URLs to final analysis data
            const finalReport = { ...status.analysis };
            Object.keys(status.analysis).forEach(pageType => {
              // Try to get screenshot URL from backend screenshots first, then fallback to status updates
              let screenshotUrl = null;
              if (status.screenshots && status.screenshots[pageType]) {
                const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('/api', '') || 'http://localhost:4000';
                screenshotUrl = `${backendBaseUrl}/screenshots/${status.screenshots[pageType].filename}`;
                console.log(`[COMPLETE] Using backend screenshot for ${pageType}:`, screenshotUrl);
              } else {
                screenshotUrl = screenshotUrls[pageType];
                console.log(`[COMPLETE] Using status screenshot for ${pageType}:`, screenshotUrl);
              }

              if (screenshotUrl && status.analysis[pageType]) {
                // Add screenshot URL to each analysis item
                finalReport[pageType] = status.analysis[pageType].map((item: any) => ({
                  ...item,
                  screenshotUrl: screenshotUrl
                }));
              }
            });

            console.log('[COMPLETE] Final report with screenshots:', finalReport);
            setReport(finalReport);

            // Clear all analysis progress
            setAnalysisInProgress({
              homepage: false,
              collection: false,
              product: false,
              cart: false
            });

            // Set the first page type as active tab only if no tab is currently selected
            const pageTypes = Object.keys(status.analysis);
            if (pageTypes.length > 0 && (!activeTabRef.current || activeTabRef.current === '')) {
              setActiveTab(pageTypes[0]);
            }

            clearInterval(pollInterval);
            setAnalysisComplete(true);
            setLoading(false);
            setTimerActive(false);
            console.log('[SEQUENTIAL] All analyses completed!');
          } else if (status.complete && status.error) {
            // Handle error completion
            setAnalysisInProgress({
              homepage: false,
              collection: false,
              product: false,
              cart: false
            });

            clearInterval(pollInterval);
            setError(`Analysis failed: ${status.error}`);
            setLoading(false);
            setTimerActive(false);

            console.log('[SEQUENTIAL] Analysis failed:', status.error);
          }

          // Update report incrementally if analysis data is available
          if (status.analysis && Object.keys(status.analysis).length > 0) {
            console.log('[SEQUENTIAL] Updating report with:', status.analysis);
            console.log('[SCREENSHOT] Current screenshot URLs:', screenshotUrls);
            console.log('[SCREENSHOT] Backend screenshots:', status.screenshots);
            setReport(prevReport => {
              const newReport = { ...prevReport };

              // Add screenshot URLs to analysis data
              Object.keys(status.analysis).forEach(pageType => {
                // Try to get screenshot URL from backend screenshots first, then fallback to status updates
                let screenshotUrl = null;
                if (status.screenshots && status.screenshots[pageType]) {
                  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace('/api', '') || 'http://localhost:4000';
                  screenshotUrl = `${backendBaseUrl}/screenshots/${status.screenshots[pageType].filename}`;
                  console.log(`[SCREENSHOT] Using backend screenshot for ${pageType}:`, screenshotUrl);
                } else {
                  screenshotUrl = screenshotUrls[pageType];
                  console.log(`[SCREENSHOT] Using status screenshot for ${pageType}:`, screenshotUrl);
                }

                if (screenshotUrl && status.analysis[pageType]) {
                  // Add screenshot URL to each analysis item
                  newReport[pageType] = status.analysis[pageType].map((item: any) => ({
                    ...item,
                    screenshotUrl: screenshotUrl
                  }));
                } else {
                  newReport[pageType] = status.analysis[pageType];
                }
              });

              console.log('[SEQUENTIAL] New report state with screenshots:', newReport);
              return newReport;
            });

            // Set active tab only if no tab is currently selected by user
            if (!activeTabRef.current || activeTabRef.current === '') {
              const pageTypes = Object.keys(status.analysis);
              if (pageTypes.length > 0) {
                setActiveTab(pageTypes[0]);
              }
            }
          }
        } catch (error) {
          console.error('[SEQUENTIAL] Error polling for status:', error);
          setError('Failed to check analysis status');
          clearInterval(pollInterval);
          setLoading(false);
          setTimerActive(false);
        }
      }, 2000); // Poll every 2 seconds

      // Cleanup interval after 10 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
      }, 600000);



    } catch (err) {
      setTimerActive(false);
      setValidatingShopify(false);

      // Check if it's a validation error
      if (err instanceof Error && err.message.includes('Shopify')) {
        setShopifyValidationError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
      setLoading(false);
    }
  }, [url, report, analysisInProgress, resetState]);

  const handleUserInfoSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setDownloadLoading(true);
      setError(null);
      setSuccessMessage('Generating your PDF report...');

      const pdfBlob = await analysisService.downloadReport(report, url, userInfo);

      // Create a download link
      const downloadUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Create filename with website URL and "audit report"
      const domain = new URL(url).hostname;
      const cleanDomain = domain.replace(/[^a-zA-Z0-9.-]/g, '-');
      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      link.download = `${cleanDomain}-audit-report-${timestamp}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      window.URL.revokeObjectURL(downloadUrl);

      // Show success message
      setSuccessMessage('Your PDF report has been downloaded successfully!');
      setDownloadLoading(false);
      setShowModal(false);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to download report. Please try again.');
      setDownloadLoading(false);
    }
  }, [report, url, userInfo]);

  const handleUserInfoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleUrlChange = useCallback((newUrl: string) => {
    setUrl(newUrl);
    // Clear validation errors when user starts typing a new URL
    if (shopifyValidationError) {
      setShopifyValidationError(null);
    }
  }, [shopifyValidationError]);

  return {
    // State
    url,
    setUrl,
    loading,
    report,
    error,
    activeTab,
    setActiveTab,
    status,
    showModal,
    setShowModal,
    successMessage,
    screenshotUrls,
    screenshotsInProgress,
    analysisComplete,
    analysisInProgress,
    userInfo,
    elapsedTime,
    timerActive,
    validatingShopify,
    shopifyValidationError,
    downloadLoading,

    // Functions
    handleSubmit,
    handleUserInfoSubmit,
    handleUserInfoChange,
    handleUrlChange,
    formatTime,
    statusMessages,
  };
} 