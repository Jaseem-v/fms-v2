import { Report } from '../hooks/useAnalysis';

export const initialReport: Report = {
  homepage: [
    {
      problem: "There are no new offers/ promotional things running on top of the banner. Telling people to sign up for the newsletter isn't the right message.",
      solution: "Placing offers in this banner will help customers quickly learn about recent promotions.",
      summary: "Add promotional offers to the top banner instead of newsletter signup",
      relevantImages: [
        {
          id: "1",
          imageUrl: "/report-img/1.png",
          useCases: ["Banner optimization", "Promotional messaging"],
          uploadDate: new Date().toISOString(),
          fileName: "1.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "homepage"
        }
      ]
    },
    {
      problem: "It is hard to find different categories at a single glance. Visitors might be looking for a specific category.",
      solution: "Add different categories as round icons at the top of the homepage, making them easy to find.",
      summary: "Display category icons prominently at the top for easy navigation",
      relevantImages: [
        {
          id: "2",
          imageUrl: "/report-img/2.png",
          useCases: ["Category navigation", "User experience"],
          uploadDate: new Date().toISOString(),
          fileName: "2.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "homepage"
        }
      ]
    },
    {
      problem: "The menu bar is not optimized for easy navigation for multiple products and categories.",
      solution: "Turn the menu into a more interactive and easy-to-find product format with visuals included in that.",
      summary: "Redesign menu with interactive visuals for better product navigation",
      relevantImages: [
        {
          id: "3",
          imageUrl: "/report-img/3.png",
          useCases: ["Menu design", "Navigation optimization"],
          uploadDate: new Date().toISOString(),
          fileName: "3.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "homepage"
        }
      ]
    },
    {
      problem: "Lifestyle-oriented product visuals are missing from the homepage. Visitors couldn't identify the exact use of each product.",
      solution: "Show the product in a way where people can see on which occasions it can be used.",
      summary: "Include lifestyle context in product visuals to show usage occasions",
      relevantImages: [
        {
          id: "4",
          imageUrl: "/report-img/4.png",
          useCases: ["Lifestyle visuals", "Product context"],
          uploadDate: new Date().toISOString(),
          fileName: "4.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "homepage"
        }
      ]
    },
    {
      problem: "There are no customer testimonials or anything else that creates social belonging for the visitors.",
      solution: "Add testimonials or elements that show the product is also used by a community of customers.",
      summary: "Add customer testimonials to build social proof and community trust",
      relevantImages: [
        {
          id: "5",
          imageUrl: "/report-img/5.png",
          useCases: ["Customer testimonials", "Social proof"],
          uploadDate: new Date().toISOString(),
          fileName: "5.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "homepage"
        }
      ]
    },
    {
      problem: "The brand story is missing on the homepage. For a visitor who visits for the first time, they don't know the purpose of the brand.",
      solution: "Add an \"About Us\" or brand story section so visitors can understand the purpose of the brand.",
      summary: "Include brand story section to help first-time visitors understand the brand purpose",
      relevantImages: [
        {
          id: "6",
          imageUrl: "/report-img/6.png",
          useCases: ["Brand story", "About us section"],
          uploadDate: new Date().toISOString(),
          fileName: "6.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "homepage"
        }
      ]
    },
    {
      problem: "There is no category named \"trending\" where the latest products are listed",
      solution: "Add a section named \"trending\" or \"best sellers\" where you showcase the best-selling products. So people can easily find what they are looking for.",
      summary: "Create trending/best sellers section to highlight popular products",
      relevantImages: [
        {
          id: "7",
          imageUrl: "/report-img/7.png",
          useCases: ["Trending products", "Best sellers"],
          uploadDate: new Date().toISOString(),
          fileName: "7.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "homepage"
        }
      ]
    }
  ],
  collection: [
    {
      problem: "A promotional message is missing near the image.",
      solution: "Add a promotional message near at least the first two visuals.",
      summary: "Include promotional messages near product visuals",
      relevantImages: [
        {
          id: "8",
          imageUrl: "/report-img/8.png",
          useCases: ["Promotional messaging", "Product visuals"],
          uploadDate: new Date().toISOString(),
          fileName: "8.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "collection"
        }
      ]
    },
    {
      problem: "Easy option to choose different colors is absent. Each visitor might prefer a different colour.",
      solution: "Add an easy option to select different colours.",
      summary: "Provide easy color selection options for products",
      relevantImages: [
        {
          id: "9",
          imageUrl: "/report-img/9.png",
          useCases: ["Color selection", "Product variations"],
          uploadDate: new Date().toISOString(),
          fileName: "9.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "collection"
        }
      ]
    },
    {
      problem: "\"Quick add to cart\" or \"Wish list\" button is missing in visuals. Visitors might be looking to add the product to the cart quickly.",
      solution: "This will help people quickly add products to the cart or Wishlist.",
      summary: "Add quick add to cart and wishlist buttons for faster shopping",
      relevantImages: [
        {
          id: "9.1",
          imageUrl: "/report-img/9.1.png",
          useCases: ["Quick actions", "Shopping experience"],
          uploadDate: new Date().toISOString(),
          fileName: "9.1.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "collection"
        }
      ]
    },
    {
      problem: "A banner is missing in the top banner. This banner can convey the intended message.",
      solution: "Add a small banner at the top of the collection page.",
      summary: "Include informative banner at the top of collection pages",
      relevantImages: [
        {
          id: "10",
          imageUrl: "/report-img/10.png",
          useCases: ["Top banner", "Information display"],
          uploadDate: new Date().toISOString(),
          fileName: "10.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "collection"
        }
      ]
    }
  ],
  product: [
    {
      problem: "Visitors don't have the option to add a product to the cart once they scroll down. People might miss out on adding products.",
      solution: "Add a \"sticky add to cart\" button, so visitors can add products at any time.",
      summary: "Implement sticky add to cart button for better conversion",
      relevantImages: [
        {
          id: "11",
          imageUrl: "/report-img/11.png",
          useCases: ["Sticky cart button", "Conversion optimization"],
          uploadDate: new Date().toISOString(),
          fileName: "11.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "product"
        }
      ]
    },
    {
      problem: "Lacks reviews or testimonials to build trust in the brand and product.",
      solution: "Add a section below the page where testimonials are presented.",
      summary: "Include customer reviews and testimonials to build trust",
      relevantImages: [
        {
          id: "12",
          imageUrl: "/report-img/12.png",
          useCases: ["Customer reviews", "Trust building"],
          uploadDate: new Date().toISOString(),
          fileName: "12.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "product"
        }
      ]
    },
    {
      problem: "The size and color guide isn't placed in an easily accessible way. Visitors might want to see the different variations of a product.",
      solution: "Add a visible, easy-to-use size and colour guide.",
      summary: "Make size and color guides easily accessible and user-friendly",
      relevantImages: [
        {
          id: "13",
          imageUrl: "/report-img/13.png",
          useCases: ["Size guide", "Color guide"],
          uploadDate: new Date().toISOString(),
          fileName: "13.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "product"
        }
      ]
    },
    {
      problem: "Reviews are missing near product visuals, and this can reduce trust in the product",
      solution: "Add a star rating near the images for instant trust and credibility.",
      summary: "Display star ratings near product images for instant credibility",
      relevantImages: [
        {
          id: "14",
          imageUrl: "/report-img/14.png",
          useCases: ["Star ratings", "Product credibility"],
          uploadDate: new Date().toISOString(),
          fileName: "14.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "product"
        }
      ]
    },
    {
      problem: "No mention of payment methods or the option to pay in instalments (EMI).",
      solution: "Add payment logos or trust badges regarding payment.",
      summary: "Show payment methods and EMI options to build payment trust",
      relevantImages: [
        {
          id: "15",
          imageUrl: "/report-img/15.png",
          useCases: ["Payment methods", "Trust badges"],
          uploadDate: new Date().toISOString(),
          fileName: "15.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "product"
        }
      ]
    }
  ],
  cart: [
    {
      problem: "Not upselling or cross-selling opportunities on the cart page.",
      solution: "Use apps to enable upselling or cross-selling in the cart.",
      summary: "Implement upselling and cross-selling in cart for increased revenue",
      relevantImages: [
        {
          id: "17",
          imageUrl: "/report-img/17.png",
          useCases: ["Upselling", "Cross-selling"],
          uploadDate: new Date().toISOString(),
          fileName: "17.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "cart"
        }
      ]
    },
    {
      problem: "No urgency prompting customers to proceed from the cart to checkout.",
      solution: "Add free shipping or a timer to create urgency in the cart.",
      summary: "Create urgency with free shipping offers or countdown timers",
      relevantImages: [
        {
          id: "6",
          imageUrl: "/report-img/6.png",
          useCases: ["Urgency creation", "Checkout optimization"],
          uploadDate: new Date().toISOString(),
          fileName: "6.png",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          page: "cart"
        }
      ]
    }
  ]
};
