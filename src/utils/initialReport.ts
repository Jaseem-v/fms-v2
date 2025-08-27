import { Report } from '../hooks/useAnalysis';

export const initialReport: Report = {
  homepage: {
    screenshotPath: "/report-img/1.png",
    imageAnalysis: "Analysis of homepage with 7 optimization opportunities",
    checklistAnalysis: [
      {
        checklistItem: "Add promotional offers to the top banner instead of newsletter signup",
        status: "FAIL",
        reason: "There are no new offers/ promotional things running on top of the banner. Telling people to sign up for the newsletter isn't the right message.",
        problem: "There are no new offers/ promotional things running on top of the banner. Telling people to sign up for the newsletter isn't the right message.",
        solution: "Placing offers in this banner will help customers quickly learn about recent promotions.",
        image_reference: "1",
        imageReferenceObject: {
          id: "1",
          imageUrl: "/report-img/1.png",
          useCases: ["Banner optimization", "Promotional messaging"],
          uploadDate: new Date().toISOString(),
          fileName: "1.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "homepage"
        },
        appReferenceObject: {
          _id: "68a6f53f98ffd64b8df64f90",
          name: "Profy Banner & Countdown Timer",
          iconUrl: "https://cdn.shopify.com/app-store/listing_images/863f7db211f186fc2772693d498efb08/icon/COKKiYjE44ADEAE=.png",
          description: "Show Coupon code banner, Sales Countdown timer, Scrolling Text, Rotating Banner slider, Message.\n      \n      \n        Improve your store sales and get more conversions with sticky discount & coupon code banner which allows visitors to copy discount code. Add urgency and get the attention of users by adding a sales countdown timer with an expiration date or fixed duration. Display scrolling text / marquee animated banner. Display multiple messages with Multi Rotating Announcement Banner Slider. Target banners based on the page URL, device type, etc, and translate text to user's local language.\n      \n      \n         Improve your store sales and get more conversions with sticky discount & coupon code banner which  ...\n        more\n      \n      \n        \n          Product Page Banner: Show coupon code bar, sales countdown timer & promo code.\n        \n        \n           Countdown Timer: Offer, Sale & Discount countdown, Order delivery timer.\n        \n        \n          Announcement Bar: Multiple banner messages with Multi Rotating Banner Slider.\n        \n        \n          Scrolling text / Marquee: Banners text with Horizontal ticker & Carousel. \n        \n        \n          Customize banner message, background image, color, position, etc.",
          useCases: [
            "✓ 1. SITE-WIDE OFFER BANNER: Look for promotional banners at the top (e.g. \"Free Shipping\", \"50% Off\", \"Limited Time\"). Check if urgency/scarcity triggers are present."
          ],
          page: "homepage",
          shopifyAppUrl: "https://apps.shopify.com/profy-promo-bar",
          category: "Conversion",
          scrapedAt: "2025-08-21T10:30:23.933Z",
          createdAt: "2025-08-21T10:30:23.935Z",
          updatedAt: "2025-08-21T10:30:23.935Z",
          __v: 0
        }
      },
      {
        checklistItem: "Display category icons prominently at the top for easy navigation",
        status: "FAIL",
        reason: "It is hard to find different categories at a single glance. Visitors might be looking for a specific category.",
        problem: "It is hard to find different categories at a single glance. Visitors might be looking for a specific category.",
        solution: "Add different categories as round icons at the top of the homepage, making them easy to find.",
        image_reference: "2",
        imageReferenceObject: {
          id: "2",
          imageUrl: "/report-img/2.png",
          useCases: ["Category navigation", "User experience"],
          uploadDate: new Date().toISOString(),
          fileName: "2.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "homepage"
        }
      },
      {
        checklistItem: "Redesign menu with interactive visuals for better product navigation",
        status: "FAIL",
        reason: "The menu bar is not optimized for easy navigation for multiple products and categories.",
        problem: "The menu bar is not optimized for easy navigation for multiple products and categories.",
        solution: "Turn the menu into a more interactive and easy-to-find product format with visuals included in that.",
        image_reference: "3",
        imageReferenceObject: {
          id: "3",
          imageUrl: "/report-img/3.png",
          useCases: ["Menu design", "Navigation optimization"],
          uploadDate: new Date().toISOString(),
          fileName: "3.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "homepage"
        },
        appReferenceObject: {
          name: "qikify Mega Menu & Navigation",
          iconUrl: "https://cdn.shopify.com/app-store/listing_images/04108b4f825e790fb3fddaf54c9d6a3a/icon/CKnJ3uKO8foCEAE=.png",
          description: "Easily create all mega menu types for better store navigation with no code.\n      \n      \n        Qikify Mega Menu & Navigation lets you effortlessly create stunning menus that improve store navigation and help customers find products faster. You can choose from pre-built templates of mega menu, tabs menu or simple menu that include search bars, social icons, maps, images, etc. Advanced customization options offer flexible layouts, responsive design across all devices, and powerful promotional widgets. Boost sales with featured products, collection displays, and strategic banner placement.\n      \n      \n         Qikify Mega Menu & Navigation lets you effortlessly create stunning menus that improve store  ...\n        more\n      \n      \n        \n          Add Product, Collection (support filter by tags), Pages and custom links in menu\n        \n        \n          Create menu with search bar, block items, contact form, google map and HTML\n        \n        \n          Add eye-catching labels, badges, icons to attract customers to special deals\n        \n        \n          Fullly customize (font, color, size, etc) and unlimited number of menu items\n        \n        \n          Create multi-level menu with templates (mega menu, tabs menu, tree menu, etc)",
          useCases: [
            "The menu bar is not optimized for easy navigation for multiple products and categories."
          ],
          page: "homepage",
          shopifyAppUrl: "https://apps.shopify.com/smart-menu",
          category: "Conversion",
          scrapedAt: "2025-08-27T09:47:46.740Z",
          _id: "68aed442efe879f4b708087e",
          createdAt: "2025-08-27T09:47:46.756Z",
          updatedAt: "2025-08-27T09:47:46.756Z",
          __v: 0
        }
      },
      {
        checklistItem: "Include lifestyle context in product visuals to show usage occasions",
        status: "FAIL",
        reason: "Lifestyle-oriented product visuals are missing from the homepage. Visitors couldn't identify the exact use of each product.",
        problem: "Lifestyle-oriented product visuals are missing from the homepage. Visitors couldn't identify the exact use of each product.",
        solution: "Show the product in a way where people can see on which occasions it can be used.",
        image_reference: "4",
        imageReferenceObject: {
          id: "4",
          imageUrl: "/report-img/4.png",
          useCases: ["Lifestyle visuals", "Product context"],
          uploadDate: new Date().toISOString(),
          fileName: "4.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "homepage"
        }
      },
      {
        checklistItem: "Add customer testimonials to build social proof and community trust",
        status: "FAIL",
        reason: "There are no customer testimonials or anything else that creates social belonging for the visitors.",
        problem: "There are no customer testimonials or anything else that creates social belonging for the visitors.",
        solution: "Add testimonials or elements that show the product is also used by a community of customers.",
        image_reference: "5",
        imageReferenceObject: {
          id: "5",
          imageUrl: "/report-img/5.png",
          useCases: ["Customer testimonials", "Social proof"],
          uploadDate: new Date().toISOString(),
          fileName: "5.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "homepage"
        },
        appReferenceObject: {
          _id: "68a6f5e198ffd64b8df64f93",
          name: "Air Product Reviews App & UGC",
          iconUrl: "https://cdn.shopify.com/app-store/listing_images/d636d73c74c4684a910d23211e0e6ddf/icon/CJbfpYa_9oYDEAE=.jpeg",
          description: "Build your brand from zero? Make it grow with product reviews & testimonials that stand out\n      \n      \n        Whether you're a newcomer or a seasoned pro, Air Reviews makes turning trust into sales simple. Get your first reviews in just few orders with automated reviews requests, and rewarding discounts. Highlight your best reviews in: review box, star rating, carousel, testimonials... Build trust and convert visitors into customers with reviews. Drive traffic using right product reviews and UGC by SEO with review-rich snippets. With Air Reviews, you have a trusted partner to build trust and convert!\n      \n      \n         Whether you're a newcomer or a seasoned pro, Air Reviews makes turning trust into sales simple. Get ...\n        more\n      \n      \n        \n          Flexible widgets → Star rating, Carousel, Testimonial to build trust and convert\n        \n        \n          Automated requests → Convert orders into reviews, then reviews back to orders\n        \n        \n          Discounts for reviews → Reward to motivate customers to leave more reviews\n        \n        \n          SEO snippets → Boost traffic across Google search with review-rich snippets\n        \n        \n          24/7 support → Until you get what you want, even you are on the free plan",
          useCases: [
            "✓ 16. CUSTOMER REVIEWS: Look for customer reviews, testimonials, or product reviews with links."
          ],
          page: "homepage",
          shopifyAppUrl: "https://apps.shopify.com/air-reviews",
          category: "Conversion",
          scrapedAt: "2025-08-21T10:33:05.093Z",
          createdAt: "2025-08-21T10:33:05.095Z",
          updatedAt: "2025-08-21T10:33:05.095Z",
          __v: 0
        }
      },
      {
        checklistItem: "Include brand story section to help first-time visitors understand the brand purpose",
        status: "FAIL",
        reason: "The brand story is missing on the homepage. For a visitor who visits for the first time, they don't know the purpose of the brand.",
        problem: "The brand story is missing on the homepage. For a visitor who visits for the first time, they don't know the purpose of the brand.",
        solution: "Add an \"About Us\" or brand story section so visitors can understand the purpose of the brand.",
        image_reference: "6",
        imageReferenceObject: {
          id: "6",
          imageUrl: "/report-img/6.png",
          useCases: ["Brand story", "About us section"],
          uploadDate: new Date().toISOString(),
          fileName: "6.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "homepage"
        }
      },
      {
        checklistItem: "Create trending/best sellers section to highlight popular products",
        status: "FAIL",
        reason: "There is no category named \"trending\" where the latest products are listed",
        problem: "There is no category named \"trending\" where the latest products are listed",
        solution: "Add a section named \"trending\" or \"best sellers\" where you showcase the best-selling products. So people can easily find what they are looking for.",
      }
    ]
  },
  collection: {
    screenshotPath: "/report-img/8.png",
    imageAnalysis: "Analysis of collection page with 4 optimization opportunities",
    checklistAnalysis: [
      {
        checklistItem: "Include promotional messages near product visuals",
        status: "FAIL",
        reason: "A promotional message is missing near the image.",
        problem: "A promotional message is missing near the image.",
        solution: "Add a promotional message near at least the first two visuals.",
        image_reference: "8",
        imageReferenceObject: {
          id: "8",
          imageUrl: "/report-img/8.png",
          useCases: ["Promotional messaging", "Product visuals"],
          uploadDate: new Date().toISOString(),
          fileName: "8.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "collection"
        }
      },
      {
        checklistItem: "Provide easy color selection options for products",
        status: "FAIL",
        reason: "Easy option to choose different colors is absent. Each visitor might prefer a different colour.",
        problem: "Easy option to choose different colors is absent. Each visitor might prefer a different colour.",
        solution: "Add an easy option to select different colours.",
        image_reference: "9",
        imageReferenceObject: {
          id: "9",
          imageUrl: "/report-img/7.png",
          useCases: ["Color selection", "Product variations"],
          uploadDate: new Date().toISOString(),
          fileName: "9.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "collection"
        }
      },
      {
        checklistItem: "Add quick add to cart and wishlist buttons for faster shopping",
        status: "FAIL",
        reason: "\"Quick add to cart\" or \"Wish list\" button is missing in visuals. Visitors might be looking to add the product to the cart quickly.",
        problem: "\"Quick add to cart\" or \"Wish list\" button is missing in visuals. Visitors might be looking to add the product to the cart quickly.",
        solution: "This will help people quickly add products to the cart or Wishlist.",
        image_reference: "9.1",
        imageReferenceObject: {
          id: "9.1",
          imageUrl: "/report-img/9.1.png",
          useCases: ["Quick actions", "Shopping experience"],
          uploadDate: new Date().toISOString(),
          fileName: "9.1.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "collection"
        },
        appReferenceObject: {
          name: "Swym Wishlist Plus",
          iconUrl: "https://cdn.shopify.com/app-store/listing_images/d612f58ce0decfaba38849af3396fb5b/icon/CKKXmdzFx_MCEAE=.jpeg",
          description: "Boost sales with an easy-to-set-up Wishlist for all customer touchpoints. Top integrations included.\n      \n      \n        Wishlist Plus enables your shoppers to save favorites and return to them later. Comes with powerful APIs to customize wishlists and integrates with leading email services to send price drop and restock alerts. Helps shoppers organize products into multiple wishlists and share them via emails, SMS, and socials. Supports anonymous wishlists. Comes with detailed reports on shopper behavior. Includes a new Customer Accounts extension for easy tracking of all wishlists and browsing activity.\n      \n      \n         Wishlist Plus enables your shoppers to save favorites and return to them later. Comes with powerful ...\n        more\n      \n      \n        \n          Seamlessly integrates with your Shopify theme. Get going in less than 5 mins.\n        \n        \n          NEW personalized customer accounts to track wishlists, recent views, offers etc.\n        \n        \n          Send email alerts for low-stock, restock and price drops of wishlisted items.\n        \n        \n          Share wishlists via email, social media, SMS, or a direct link.\n        \n        \n          Reduce cart abandonment by enabling shoppers to save products for later.",
          useCases: [
            "“Quick add to cart” or “Wish list” button is missing in visuals. Visitors might be looking to add the product to the cart quickly."
          ],
          page: "homepage",
          shopifyAppUrl: "https://apps.shopify.com/swym-relay",
          category: "Conversion",
          scrapedAt: "2025-08-27T09:57:20.794Z",
          _id: "68aed680efe879f4b7080882",
          createdAt: "2025-08-27T09:57:20.795Z",
          updatedAt: "2025-08-27T09:57:20.795Z",
          __v: 0
        }
      },
      {
        checklistItem: "Include informative banner at the top of collection pages",
        status: "FAIL",
        reason: "A banner is missing in the top banner. This banner can convey the intended message.",
        problem: "A banner is missing in the top banner. This banner can convey the intended message.",
        solution: "Add a small banner at the top of the collection page.",
        image_reference: "10",
        imageReferenceObject: {
          id: "10",
          imageUrl: "/report-img/10.png",
          useCases: ["Top banner", "Information display"],
          uploadDate: new Date().toISOString(),
          fileName: "10.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "collection"
        }
      }
    ]
  },
  product: {
    screenshotPath: "/report-img/11.png",
    imageAnalysis: "Analysis of product page with 5 optimization opportunities",
    checklistAnalysis: [
      {
        checklistItem: "Implement sticky add to cart button for better conversion",
        status: "FAIL",
        reason: "Visitors don't have the option to add a product to the cart once they scroll down. People might miss out on adding products.",
        problem: "Visitors don't have the option to add a product to the cart once they scroll down. People might miss out on adding products.",
        solution: "Add a \"sticky add to cart\" button, so visitors can add products at any time.",
        image_reference: "11",
        imageReferenceObject: {
          id: "11",
          imageUrl: "/report-img/11.png",
          useCases: ["Sticky cart button", "Conversion optimization"],
          uploadDate: new Date().toISOString(),
          fileName: "11.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "product"
        },
        appReferenceObject: {
          name: "Add to cart button ‑ FoxCart",
          iconUrl: "https://cdn.shopify.com/app-store/listing_images/2b9bba2ab61edabc6d836f14f9377671/icon/CL-Lhc30lu8CEAE=.png",
          description: "Show add to cart buttons on every product in your store, a sticky bar on product pages and more!\n      \n      \n        This app will boost your sales by adding \"Add to cart\" button to every product in your store, a sticky bar on product pages and a floating sticky cart button. It will make it easier to add products to the cart. Your customers will now buy more products and spend more money in your store.\n      \n      \n         This app will boost your sales by adding \"Add to cart\" button to every product in your store, a  ...\n        more\n      \n      \n        \n          Add \"Add to cart\" buttons on every product in your shop.\n        \n        \n          Show \"Sticky add to cart bar\" on each product page to boost conversions\n        \n        \n          Redirect users directly to the checkout when they add an item to the cart\n        \n        \n          Show sticky cart on a fixed position in your shop.",
          useCases: [
            "Visitors don’t have the option to add a product to the cart once they scroll down. People might miss out on adding products."
          ],
          page: "homepage",
          shopifyAppUrl: "https://apps.shopify.com/add-to-cart",
          category: "Conversion",
          scrapedAt: "2025-08-27T09:58:56.043Z",
          _id: "68aed6e0efe879f4b7080885",
          createdAt: "2025-08-27T09:58:56.044Z",
          updatedAt: "2025-08-27T09:58:56.044Z",
          __v: 0
        }
      },
      {
        checklistItem: "Include customer reviews and testimonials to build trust",
        status: "FAIL",
        reason: "Lacks reviews or testimonials to build trust in the brand and product.",
        problem: "Lacks reviews or testimonials to build trust in the brand and product.",
        solution: "Add a section below the page where testimonials are presented.",
        image_reference: "12",
        imageReferenceObject: {
          id: "12",
          imageUrl: "/report-img/12.png",
          useCases: ["Customer reviews", "Trust building"],
          uploadDate: new Date().toISOString(),
          fileName: "12.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "product"
        }
      },
      {
        checklistItem: "Make size and color guides easily accessible and user-friendly",
        status: "FAIL",
        reason: "The size and color guide isn't placed in an easily accessible way. Visitors might want to see the different variations of a product.",
        problem: "The size and color guide isn't placed in an easily accessible way. Visitors might want to see the different variations of a product.",
        solution: "Add a visible, easy-to-use size and colour guide.",
        image_reference: "13",
        imageReferenceObject: {
          id: "13",
          imageUrl: "/report-img/13.png",
          useCases: ["Size guide", "Color guide"],
          uploadDate: new Date().toISOString(),
          fileName: "13.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "product"
        }
      },
      {
        checklistItem: "Display star ratings near product images for instant credibility",
        status: "FAIL",
        reason: "Reviews are missing near product visuals, and this can reduce trust in the product",
        problem: "Reviews are missing near product visuals, and this can reduce trust in the product",
        solution: "Add a star rating near the images for instant trust and credibility.",
        image_reference: "14",
        imageReferenceObject: {
          id: "14",
          imageUrl: "/report-img/14.png",
          useCases: ["Star ratings", "Product credibility"],
          uploadDate: new Date().toISOString(),
          fileName: "14.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "product"
        }
      },
      {
        checklistItem: "Show payment methods and EMI options to build payment trust",
        status: "FAIL",
        reason: "No mention of payment methods or the option to pay in instalments (EMI).",
        problem: "No mention of payment methods or the option to pay in instalments (EMI).",
        solution: "Add payment logos or trust badges regarding payment.",
        image_reference: "15",
        imageReferenceObject: {
          id: "15",
          imageUrl: "/report-img/15.png",
          useCases: ["Payment methods", "Trust badges"],
          uploadDate: new Date().toISOString(),
          fileName: "15.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "product"
        }
      }
    ]
  },
  cart: {
    screenshotPath: "/report-img/17.png",
    imageAnalysis: "Analysis of cart page with 2 optimization opportunities",
    checklistAnalysis: [
      {
        checklistItem: "Implement upselling and cross-selling in cart for increased revenue",
        status: "FAIL",
        reason: "Not upselling or cross-selling opportunities on the cart page.",
        problem: "Not upselling or cross-selling opportunities on the cart page.",
        solution: "Use apps to enable upselling or cross-selling in the cart.",
        image_reference: "17",
        imageReferenceObject: {
          id: "17",
          imageUrl: "/report-img/17.png",
          useCases: ["Upselling", "Cross-selling"],
          uploadDate: new Date().toISOString(),
          fileName: "17.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "cart"
        }
      },
      {
        checklistItem: "Create urgency with free shipping offers or countdown timers",
        status: "FAIL",
        reason: "No urgency prompting customers to proceed from the cart to checkout.",
        problem: "No urgency prompting customers to proceed from the cart to checkout.",
        solution: "Add free shipping or a timer to create urgency in the cart.",
        image_reference: "6",
        imageReferenceObject: {
          id: "6",
          imageUrl: "/report-img/6.png",
          useCases: ["Urgency creation", "Checkout optimization"],
          uploadDate: new Date().toISOString(),
          fileName: "6.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "cart"
        }
      }
    ]
  }
};
