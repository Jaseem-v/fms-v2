import { PagewiseAnalysisResult } from "@/hooks/usePagewiseAnalysis";

export const initialHomeReport: PagewiseAnalysisResult = {
    "screenshotPath": "/Users/jaseem/Documents/FULL STACK WORKS/fixmystore/backend/screenshots/homepage-1755860776084.png",
    "imageAnalysis": "Okay, here's a structured analysis of the image, broken down by section from top to bottom.\n\n**1. Header**\n\n*   **Detailed Elements:**\n    *   **Logo:** \"Sitteer\" with a feather-like graphic.\n    *   **Navigation:** \"HOME\", \"CATALOG\", \"CONTACT\", \"TRACK YOUR ORDER\"\n    *   **Icons:** Search icon, User/Account icon, Shopping Cart icon.\n    *   **Language/Currency Selector:** Country flag and \"INR\".\n*   **Section Summary/Purpose:** This section provides the core navigation and brand identification for the website. It allows users to access key areas, track orders, and manage their account. The language/currency selector helps tailor the experience to the user's location.\n\n**2. Hero Section**\n\n*   **Detailed Elements:**\n    *   **Background Image:** A blurred image of a person wearing a light purple dress, possibly holding prayer beads.\n    *   **Text:**\n        *   \"FOR THE LOVE OF ALLAH\" (Heading)\n        *   \"Sitteer\" (Main Heading)\n    *   **Button:** \"SHOP NOW\"\n    *   **Carousel indicators**: 5 indicators showing that the section has carousel slider\n*   **Section Summary/Purpose:** This section is designed to immediately capture the user's attention and communicate the brand's core value proposition. It uses a visually appealing image and compelling text to convey a sense of purpose and spirituality. The \"SHOP NOW\" button encourages immediate engagement with the product catalog.\n\n**3. \"Why Sitteer?\" Section**\n\n*   **Detailed Elements:**\n    *   **Heading:** \"Why Sitteer?\"\n    *   **Text:** \"Just because each product of ours is sourced with a Niyyah of pleasing Allah Azza Wajal & with utmost care for its premium quality.\"\n*   **Section Summary/Purpose:**  This section explains the brand's unique selling point and its commitment to quality and ethical sourcing. It emphasizes the spiritual intention behind the products.\n\n**4. \"FOR YOU\" Section**\n\n*   **Detailed Elements:**\n    *   **Heading:** \"FOR YOU\"\n    *   **Four Image/Text Blocks:**\n        *   Image with text overlay: \"Plain Prayer dress\"\n        *   Image with text overlay: \"Floral Prayer Dresses\"\n        *   Image with text overlay: \"Kids Love Allah Too\"\n        *   Image with text overlay: \"Timeless Cotton Prayer Dresses\"\n*   **Section Summary/Purpose:** This section showcases different product categories. The images and titles act as links to specific product collections.\n\n**5. \"Dress Your Gift\" Section**\n\n*   **Detailed Elements:**\n    *   **Heading:** \"Dress Your Gift\"\n    *   **Product Cards:** Four product cards displayed\n        *   Image of \"Fancy Gifting Pouch\" - RS. 85\n        *   Image of \"Sitteer Gift box - Gifting Option\" - RS. 475. The card displays \"Sold Out\".\n        *   Image of \"Floral Fancy Gifting Mailer\" - RS. 35. The card displays \"Sold Out\".\n        *   Image of \"Traditional Wooden Gifting Box\" - RS. 1,299\n*   **Section Summary/Purpose:** This section highlights gifting-related products and their prices. It encourages users to explore gifting options from the brand.\n\n**6. \"Khalta Maryam Perfume\" Section**\n\n*   **Detailed Elements:**\n    *   **Product Image:** Image of the \"Khalta Maryam Perfume\".\n    *   **Product Details:**\n        *   Heading: \"Khalta Maryam Perfume\"\n        *   Price: \"RS. 999.00\"\n        *   Shipping Information: \"Shipping calculated at checkout.\"\n    *   **Buttons:** \"SOLD OUT\", \"BUY IT NOW\"\n    *   **Link:** \"Full details ->\"\n    *   **Social Sharing Icons:** Share, Tweet, Pin It\n*   **Section Summary/Purpose:** This section provides a focused product presentation. It showcases a specific product with its price, availability, and options for purchase or further exploration. Social sharing buttons encourage users to spread the word.\n\n**7. Newsletter Subscription Section**\n\n*   **Detailed Elements:**\n    *   **Heading:** \"Subscribe to our newsletter\"\n    *   **Subheading:** \"Promotions, new products and sales. Directly to your inbox.\"\n    *   **Input Field:** \"Your email\"\n    *   **Button:** \"SUBSCRIBE\"\n*   **Section Summary/Purpose:** This section is designed to capture email addresses for marketing purposes. It promises promotions, new product announcements, and sales updates to subscribers.\n\n**8. Footer**\n\n*   **Detailed Elements:**\n    *   **Links:** \"Search\", \"Terms of Service\", \"Refund & Return policy\", \"Shipping policy\", \"Contact us\"\n    *   **Language/Currency Selector:** \"India (INR)\"\n    *   **Copyright:** \"© 2025, Sitteer\"\n*   **Section Summary/Purpose:** The footer contains useful links for customer support and legal information. It also reinforces the brand identity with the copyright notice. The language/currency selector is repeated for convenience.\n",
    "checklistAnalysis": [
        {
            "checklistItem": "PRODUCT BADGES: Check for badges on thumbnails ('Fast delivery', 'Best-seller', 'New', 'Trending').",
            "status": "FAIL",
            "reason": "The product thumbnails in the \"Dress Your Gift\" section and the Khalta Maryam Perfume section do not have any promotional badges like 'Fast delivery', 'Best-seller', 'New', or 'Trending'.",
            "problemName": "Missing Product Badges",
            "problem": "The product thumbnails lack badges that could highlight key selling points or create a sense of urgency or popularity.",
            "solution": "Add relevant badges to product thumbnails to highlight features like 'Best Seller', 'New Arrival', or 'Limited Stock'.",
            "image_reference": "68a7307098ffd64b8df64fa4",
            "imageReferenceObject": {
                "id": "68a7307098ffd64b8df64fa4",
                "imageUrl": "/uploads/image_1755787376655.jpeg",
                "useCases": [
                    "The homepage lacks trust badges, which could further enhance credibility and reassure potential customers."
                ],
                "page": "homepage",
                "industry": "Beauty & Personal Care",
                "country": "IN",
                "uploadDate": "2025-08-21T14:42:56.661Z",
                "fileName": "image_1755787376655.jpeg",
                "createdAt": "2025-08-21T14:42:56.687Z",
                "updatedAt": "2025-08-21T14:42:56.687Z"
            }
        },
        {
            "checklistItem": "FEATURED PRODUCTS LIST: Check for curated list of important products with links.",
            "status": "FAIL",
            "reason": "There is no section explicitly dedicated to a curated list of featured products like best sellers, new arrivals, or sale items. The 'For You' section lists categories, but doesn't showcase individual featured products.",
            "problemName": "Missing Featured Products List",
            "problem": "The homepage lacks a dedicated section to showcase featured products, making it harder for users to quickly discover popular or recommended items.",
            "solution": "Create a 'Featured Products' section that highlights best-selling, new arrival, or discounted items to drive sales and product discovery.",
            "image_reference": "68850a101974bdc7c8e4ab25",
            "imageReferenceObject": {
                "id": "68850a101974bdc7c8e4ab25",
                "imageUrl": "/uploads/image_1753549328792.png",
                "useCases": [
                    "\"Effective announcement banner 'Free Deluxe Samples with every purchase' leveraging promotional incentive for increased conversions\" (Banners)",
                    "\"Strong product messaging emphasizing 'best-selling' status as credible social proof and trust signal for new product launch\" (Trust & Social Proof)"
                ],
                "uploadDate": "2025-07-26T17:02:08.792Z",
                "fileName": "image_1753549328792.png",
                "createdAt": "2025-07-26T17:02:08.793Z",
                "updatedAt": "2025-08-21T05:50:00.040Z",
                "page": "homepage",
                "country": "IN"
            }
        },
        {
            "checklistItem": "TRUST BADGES: Look for product features badges, premium materils , secure checkout , fast delivery   etc ..",
            "status": "FAIL",
            "reason": "The homepage lacks any visible trust badges that would assure customers about product quality, secure checkout, or fast delivery.",
            "problemName": "Missing Trust Badges",
            "problem": "The absence of trust badges undermines customer confidence and may deter them from making a purchase.",
            "solution": "Include trust badges related to secure checkout, product quality, or fast delivery to build customer trust and increase conversions.",
            "image_reference": "68a6cf7e98ffd64b8df64f60",
            "app_reference": "68a6f88098ffd64b8df64f99",
            "imageReferenceObject": {
                "id": "68a6cf7e98ffd64b8df64f60",
                "imageUrl": "/uploads/image_1755762558502.png",
                "useCases": [
                    "TRUST SIGNALS: ✓ 18. TRUST BADGES: Look for product features badges , testimonails, ratings etc .."
                ],
                "page": "homepage",
                "industry": "Health & Wellness",
                "country": "GB",
                "uploadDate": "2025-08-21T07:49:18.503Z",
                "fileName": "image_1755762558502.png",
                "createdAt": "2025-08-21T07:49:18.504Z",
                "updatedAt": "2025-08-21T07:49:18.504Z"
            },
            "appReferenceObject": {
                "_id": "68a6f88098ffd64b8df64f99",
                "name": "Essential Trust Badges & Icons",
                "iconUrl": "https://cdn.shopify.com/app-store/listing_images/447aa873cb88a7ec294e5b0963f7f12e/icon/CMng8b353f4CEAE=.png",
                "description": "Show features & guarantees with product badge icons, trust badges banners, stickers & product labels\n      \n      \n        Essential Icon & Trust Badge Banners - Use product badges to elevate your Shopify store's visual appeal & build trust. Effortlessly personalize and select the placement of banners or payment gateway icons on product page or any custom location. Upload your own custom icons to stand out & have a trusted site.\n\nBoost your website's credibility and drive sales with icons, banners, product labels, stickers, trust badges, sale banners, return & shipping badges, payment icons, labels & guarantees.\n      \n      \n         Essential Icon & Trust Badge Banners - Use product badges to elevate your Shopify store's visual  ...\n        more\n      \n      \n        \n          Icon & trust badges banner library: diverse options for features and guarantees\n        \n        \n          Banner customization: edit size, font, & color to match brand identity\n        \n        \n          Flexible placement: add banners to product pages, or any custom location\n        \n        \n          Upload your icons: use unique guarantee icons, banners & payment icons\n        \n        \n          Trust badges master design: preview & optimize product labels on any device",
                "useCases": [
                    "✓ 18. TRUST BADGES: Look for product features badges , testimonails, ratings etc .."
                ],
                "page": "homepage",
                "shopifyAppUrl": "https://apps.shopify.com/essential-icon-badge-banners",
                "category": "Conversion",
                "scrapedAt": "2025-08-21T10:44:16.188Z",
                "createdAt": "2025-08-21T10:44:16.189Z",
                "updatedAt": "2025-08-21T10:44:16.189Z",
                "__v": 0
            }
        },
        {
            "checklistItem": "PRODUCT VARIANTS: Look if available variants (size, color) are clearly displayed per product.",
            "status": "FAIL",
            "reason": "The product cards in the 'Dress Your Gift' and Khalta Maryam Perfume sections do not display any available variants like size or color.",
            "problemName": "Missing Product Variants",
            "problem": "Customers cannot see available sizes or colors directly from the homepage, which requires them to click through to the product page to view this information.",
            "solution": "Display available product variants (size, color) directly on the product cards to improve user experience and encourage faster purchasing decisions.",
            "image_reference": "68a6dd5698ffd64b8df64f6e",
            "imageReferenceObject": {
                "id": "68a6dd5698ffd64b8df64f6e",
                "imageUrl": "/uploads/image_1755766102094.png",
                "useCases": [
                    "✓ 26. PRODUCT VARIANTS: Look if available variants (size, color) are clearly displayed per product."
                ],
                "page": "homepage",
                "industry": "Clothing & Fashion",
                "country": "US",
                "uploadDate": "2025-08-21T08:48:22.095Z",
                "fileName": "image_1755766102094.png",
                "createdAt": "2025-08-21T08:48:22.096Z",
                "updatedAt": "2025-08-21T08:48:22.096Z"
            }
        },
        {
            "checklistItem": "SITE-WIDE OFFER BANNER: Look for promotional banners at the top (e.g. 'Free Shipping', '50% Off', 'Limited Time'). Check if urgency/scarcity triggers are present.",
            "status": "FAIL",
            "reason": "There is no site-wide offer banner at the top of the homepage to highlight any ongoing promotions, discounts, or special offers. There's also no visible urgency or scarcity messaging.",
            "problemName": "Missing Offer Banner",
            "problem": "The absence of a prominent offer banner means that visitors might miss out on potential deals, reducing the likelihood of immediate purchases.",
            "solution": "Implement a site-wide offer banner at the top to advertise promotions like free shipping or discounts, and include urgency/scarcity triggers to encourage immediate action.",
            "image_reference": "68a6f4ec98ffd64b8df64f86",
            "app_reference": "68a6f53f98ffd64b8df64f90",
            "imageReferenceObject": {
                "id": "68a6f4ec98ffd64b8df64f86",
                "imageUrl": "/uploads/image_1755772140886.jpeg",
                "useCases": [
                    "SITE-WIDE OFFER BANNER: Look for promotional banners at the top (e.g. \"Free Shipping\", \"50% Off\", \"Limited Time\"). Check if urgency/scarcity triggers are present."
                ],
                "page": "homepage",
                "industry": "Beauty & Personal Care",
                "country": "IN",
                "uploadDate": "2025-08-21T10:29:00.886Z",
                "fileName": "image_1755772140886.jpeg",
                "createdAt": "2025-08-21T10:29:00.888Z",
                "updatedAt": "2025-08-21T10:29:00.888Z"
            },
            "appReferenceObject": {
                "_id": "68a6f53f98ffd64b8df64f90",
                "name": "Profy Banner & Countdown Timer",
                "iconUrl": "https://cdn.shopify.com/app-store/listing_images/863f7db211f186fc2772693d498efb08/icon/COKKiYjE44ADEAE=.png",
                "description": "Show Coupon code banner, Sales Countdown timer, Scrolling Text, Rotating Banner slider, Message.\n      \n      \n        Improve your store sales and get more conversions with sticky discount & coupon code banner which allows visitors to copy discount code. Add urgency and get the attention of users by adding a sales countdown timer with an expiration date or fixed duration. Display scrolling text / marquee animated banner. Display multiple messages with Multi Rotating Announcement Banner Slider. Target banners based on the page URL, device type, etc, and translate text to user's local language.\n      \n      \n         Improve your store sales and get more conversions with sticky discount & coupon code banner which  ...\n        more\n      \n      \n        \n          Product Page Banner: Show coupon code bar, sales countdown timer & promo code.\n        \n        \n           Countdown Timer: Offer, Sale & Discount countdown, Order delivery timer.\n        \n        \n          Announcement Bar: Multiple banner messages with Multi Rotating Banner Slider.\n        \n        \n          Scrolling text / Marquee: Banners text with Horizontal ticker & Carousel. \n        \n        \n          Customize banner message, background image, color, position, etc.",
                "useCases": [
                    "✓ 1. SITE-WIDE OFFER BANNER: Look for promotional banners at the top (e.g. \"Free Shipping\", \"50% Off\", \"Limited Time\"). Check if urgency/scarcity triggers are present."
                ],
                "page": "homepage",
                "shopifyAppUrl": "https://apps.shopify.com/profy-promo-bar",
                "category": "Conversion",
                "scrapedAt": "2025-08-21T10:30:23.933Z",
                "createdAt": "2025-08-21T10:30:23.935Z",
                "updatedAt": "2025-08-21T10:30:23.935Z",
                "__v": 0
            }
        },
        {
            "checklistItem": "TRENDING ON TOP: Look if trending, top-rated, best-selling items are shown first by default.",
            "status": "FAIL",
            "reason": "The homepage does not appear to prioritize or highlight trending, top-rated, or best-selling items by default. There's no explicit section or sorting to indicate this.",
            "problemName": "Missing Trending Products",
            "problem": "The homepage does not showcase trending or best-selling products, which could lead to users missing out on popular items.",
            "solution": "Implement a section showcasing trending, top-rated, or best-selling products to highlight popular items and encourage purchases.",
            "image_reference": "68a6f03e98ffd64b8df64f7d",
            "imageReferenceObject": {
                "id": "68a6f03e98ffd64b8df64f7d",
                "imageUrl": "/uploads/image_1755770942900.jpeg",
                "useCases": [
                    "TRENDING ON TOP: Look if trending, top-rated, best-selling items are shown first by default."
                ],
                "page": "homepage",
                "industry": "Beauty & Personal Care",
                "country": "IN",
                "uploadDate": "2025-08-21T10:09:02.901Z",
                "fileName": "image_1755770942900.jpeg",
                "createdAt": "2025-08-21T10:09:02.902Z",
                "updatedAt": "2025-08-21T10:09:02.902Z"
            }
        },
        {
            "checklistItem": "CONTACT METHOD: Look for visible live chat btn, support btn, whatsapp btn ",
            "status": "FAIL",
            "reason": "While there is a 'CONTACT' link in the header, there is no immediate visibility of a live chat button, support button, or WhatsApp button on the homepage itself.",
            "problemName": "Missing Contact Method",
            "problem": "The lack of a readily visible contact method (like live chat) can hinder customer support and potentially lead to lost sales due to unanswered queries.",
            "solution": "Add a visible live chat button or a quick contact link (e.g., WhatsApp) to the homepage to improve customer support accessibility.",
            "image_reference": "68a6ce5198ffd64b8df64f5a",
            "app_reference": "68a6f77d98ffd64b8df64f96",
            "imageReferenceObject": {
                "id": "68a6ce5198ffd64b8df64f5a",
                "imageUrl": "/uploads/image_1755762257502.png",
                "useCases": [
                    "CONTACT OPTIONS: ✓ 13. CONTACT METHOD: Look for visible  live chat btn , support button, WhatsApp button"
                ],
                "page": "homepage",
                "industry": "Beauty & Personal Care",
                "country": "US",
                "uploadDate": "2025-08-21T07:44:17.502Z",
                "fileName": "image_1755762257502.png",
                "createdAt": "2025-08-21T07:44:17.503Z",
                "updatedAt": "2025-08-21T07:44:17.503Z"
            },
            "appReferenceObject": {
                "_id": "68a6f77d98ffd64b8df64f96",
                "name": "Tidio ‑ Live Chat & AI Chatbot",
                "iconUrl": "https://cdn.shopify.com/app-store/listing_images/c9308d01d0e596807cd697bab16009a1/icon/COXAs-O_ioQDEAE=.png",
                "description": "Improve customer experience with a chatbot, AI agent, and live chat in one help desk for your store.\n      \n      \n        Tidio lets you engage customers with pre-set messages and talk to them as they shop via live chat. But it’s more than just a live chat extension and chatbot app for Shopify. You can also use conversational AI to upsell via personalized product recommendations. Tidio lets you view customers in real time and learn what products they viewed to increase average order value with discount codes. All this from one helpdesk with dedicated Shopify features.\n      \n      \n         Tidio lets you engage customers with pre-set messages and talk to them as they shop via live chat.  ...\n        more\n      \n      \n        \n          Live chat app—provide live support, resolve issues, and sell via chat and video\n        \n        \n          Chatbot integration—create chatbot automation flows and feed your funnel 24/7\n        \n        \n          AI chatbot—resolve most customer support issues with Lyro the AI sales assistant\n        \n        \n          Help desk software—manage everything from one, easy-to-use, centralized panel\n        \n        \n          Real-time omni-channel support—Preview carts, past orders and recommend products",
                "useCases": [
                    "✓ 13. CONTACT METHOD: Look for visible  live chat btn , support button, WhatsApp button"
                ],
                "page": "homepage",
                "shopifyAppUrl": "https://apps.shopify.com/tidio-chat",
                "category": "Conversion",
                "scrapedAt": "2025-08-21T10:39:57.696Z",
                "createdAt": "2025-08-21T10:39:57.697Z",
                "updatedAt": "2025-08-21T10:39:57.697Z",
                "__v": 0
            }
        },
        {
            "checklistItem": "USER-GENERATED CONTENT: Check for testimonials with user image, Instagram carousel, customer photos, or UGC.",
            "status": "FAIL",
            "reason": "The homepage does not feature any user-generated content such as customer testimonials with images, Instagram carousels, or customer photos.",
            "problemName": "Missing User-Generated Content",
            "problem": "The absence of UGC reduces social proof and makes it harder for potential customers to see how others are using and enjoying the products.",
            "solution": "Incorporate user-generated content like customer testimonials with images or an Instagram feed to build trust and provide social proof.",
            "image_reference": "68a6cc0b98ffd64b8df64f54",
            "app_reference": "68a6f8fe98ffd64b8df64f9c",
            "imageReferenceObject": {
                "id": "68a6cc0b98ffd64b8df64f54",
                "imageUrl": "/uploads/image_1755761675824.png",
                "useCases": [
                    "✓ 21. USER-GENERATED CONTENT: Check for testimonials with user image , Instagram carousel, customer photos, or UGC."
                ],
                "page": "homepage",
                "industry": "Beauty & Personal Care",
                "country": "US",
                "url": "https://functionofbeauty.com/",
                "uploadDate": "2025-08-21T07:34:35.825Z",
                "fileName": "image_1755761675824.png",
                "createdAt": "2025-08-21T07:34:35.827Z",
                "updatedAt": "2025-08-21T07:34:35.827Z"
            },
            "appReferenceObject": {
                "_id": "68a6f8fe98ffd64b8df64f9c",
                "name": "Reelify Shoppable Video & UGC",
                "iconUrl": "https://cdn.shopify.com/app-store/listing_images/d1c131f3d394edbcfc2ad12c0aa0fae5/icon/CNuOh5bwq4YDEAE=.png",
                "description": "Turn your Instagram, TikTok videos into a shopping gallery!\nTo help people shop while they watch.\n      \n      \n        Make your store fun and shoppable with fast videos. Use TikTok, Instagram Reels, and UGC to show real people using your products. Add product tags inside autoplay sliders, floating videos, and carousels. Boost sales, ROAS, and engagement. Show TikTok Shops and Reels on your home, product, or collection pages. Reelify is made for Shopify and works great on mobile.\n      \n      \n         Make your store fun and shoppable with fast videos. Use TikTok, Instagram Reels, and UGC to show  ...\n        more\n      \n      \n        \n          Shoppable TikTok & Instagram videos on home, product, and collection pages\n        \n        \n          Import UGC videos from Instagram or TikTok with just one click\n        \n        \n          Boost store SEO by keeping shoppers engaged with video content\n        \n        \n          Video sliders and carousels that load fast and don’t slow your store\n        \n        \n          Optimized for mobile to give smooth video viewing on all devices",
                "useCases": [
                    "✓ 21. USER-GENERATED CONTENT: Check for testimonials with user image , Instagram carousel, customer photos, or UGC."
                ],
                "page": "homepage",
                "shopifyAppUrl": "https://apps.shopify.com/reel-app",
                "category": "Conversion",
                "scrapedAt": "2025-08-21T10:46:22.207Z",
                "createdAt": "2025-08-21T10:46:22.207Z",
                "updatedAt": "2025-08-21T10:46:22.207Z",
                "__v": 0
            }
        },
        {
            "checklistItem": "COMPLETE INFO: Check for all key info (title, old/new price, discount, reviews, rating, description, variants).",
            "status": "FAIL",
            "reason": "The product cards in the 'Dress Your Gift' section lack key information such as customer reviews, ratings, detailed descriptions, and variants. The Khalta Maryam Perfume Section also lacks reviews and ratings.",
            "problemName": "Missing Product Information",
            "problem": "Incomplete product information on the homepage makes it difficult for customers to make informed decisions without navigating to the product page.",
            "solution": "Include customer reviews, ratings, brief descriptions, and available variants on the product cards to provide more complete product information on the homepage.",
            "image_reference": "6888e2f50305a9dbcd095e35",
            "imageReferenceObject": {
                "id": "6888e2f50305a9dbcd095e35",
                "imageUrl": "/uploads/image_1753801461608.png",
                "useCases": [
                    "\"Product cards effectively display comprehensive information including product name, pricing with discount structure, and detailed product descriptions\" (Product Info & Quick Views)",
                    "\"Multiple promotional labels strategically placed with 'BEST SELLER' and 'NEW' tags highlighting product status and popularity\" (Product Info & Quick Views)",
                    "\"Quick action functionality with plus icons enabling easy product interaction and potential quick view access\" (Product Info & Quick Views)",
                    "\"Detailed product feature descriptions highlighting key benefits like '100% Hutterite down' and 'hypoallergenic PrimaLoft fill'\" (Product Info & Quick Views)"
                ],
                "page": "collection",
                "industry": "Home & Garden",
                "country": "US",
                "url": "https://www.brooklinen.com/collections/comforters-pillows",
                "uploadDate": "2025-07-29T15:04:21.608Z",
                "fileName": "image_1753801461608.png",
                "createdAt": "2025-07-29T15:04:21.614Z",
                "updatedAt": "2025-07-29T15:04:21.614Z"
            }
        },
        {
            "checklistItem": "MEDIA MENTIONS: Check for logos of news sites, blogs, celebrities, or PR mentions.",
            "status": "FAIL",
            "reason": "The homepage does not display any logos or mentions of news sites, blogs, celebrities, or PR, indicating a lack of media or press mentions.",
            "problemName": "Missing Media Mentions",
            "problem": "The absence of media mentions reduces the perceived credibility and authority of the brand.",
            "solution": "Include logos or mentions of any media coverage or press mentions the brand has received to build credibility.",
            "image_reference": "68852f371974bdc7c8e4ab3d",
            "imageReferenceObject": {
                "id": "68852f371974bdc7c8e4ab3d",
                "imageUrl": "/uploads/image_1753558839097.png",
                "useCases": [
                    "✓ 19. MEDIA MENTIONS: Check for logos of news sites, blogs, celebrities, or PR mentions."
                ],
                "uploadDate": "2025-07-26T19:40:39.098Z",
                "fileName": "image_1753558839097.png",
                "createdAt": "2025-07-26T19:40:39.099Z",
                "updatedAt": "2025-08-21T07:31:28.438Z",
                "page": "homepage",
                "country": "US"
            }
        },
        {
            "checklistItem": "CUSTOMER REVIEWS: Look for customer reviews, testimonials, or product reviews with links.",
            "status": "FAIL",
            "reason": "The homepage lacks any visible customer reviews, testimonials, or product reviews.",
            "problemName": "Missing Customer Reviews",
            "problem": "The absence of customer reviews reduces social proof and may deter potential customers from making a purchase.",
            "solution": "Incorporate customer reviews or testimonials on the homepage to build trust and provide social proof.",
            "image_reference": "68a6cef998ffd64b8df64f5d",
            "app_reference": "68a6f5e198ffd64b8df64f93",
            "imageReferenceObject": {
                "id": "68a6cef998ffd64b8df64f5d",
                "imageUrl": "/uploads/image_1755762425367.png",
                "useCases": [
                    "✓ 16. CUSTOMER REVIEWS: Look for customer reviews, testimonials, or product reviews with links."
                ],
                "page": "homepage",
                "industry": "Beauty & Personal Care",
                "country": "US",
                "uploadDate": "2025-08-21T07:47:05.368Z",
                "fileName": "image_1755762425367.png",
                "createdAt": "2025-08-21T07:47:05.369Z",
                "updatedAt": "2025-08-21T07:47:05.369Z"
            },
            "appReferenceObject": {
                "_id": "68a6f5e198ffd64b8df64f93",
                "name": "Air Product Reviews App & UGC",
                "iconUrl": "https://cdn.shopify.com/app-store/listing_images/d636d73c74c4684a910d23211e0e6ddf/icon/CJbfpYa_9oYDEAE=.jpeg",
                "description": "Build your brand from zero? Make it grow with product reviews & testimonials that stand out\n      \n      \n        Whether you're a newcomer or a seasoned pro, Air Reviews makes turning trust into sales simple. Get your first reviews in just few orders with automated reviews requests, and rewarding discounts. Highlight your best reviews in: review box, star rating, carousel, testimonials... Build trust and convert visitors into customers with reviews. Drive traffic using right product reviews and UGC by SEO with review-rich snippets. With Air Reviews, you have a trusted partner to build trust and convert!\n      \n      \n         Whether you're a newcomer or a seasoned pro, Air Reviews makes turning trust into sales simple. Get ...\n        more\n      \n      \n        \n          Flexible widgets → Star rating, Carousel, Testimonial to build trust and convert\n        \n        \n          Automated requests → Convert orders into reviews, then reviews back to orders\n        \n        \n          Discounts for reviews → Reward to motivate customers to leave more reviews\n        \n        \n          SEO snippets → Boost traffic across Google search with review-rich snippets\n        \n        \n          24/7 support → Until you get what you want, even you are on the free plan",
                "useCases": [
                    "✓ 16. CUSTOMER REVIEWS: Look for customer reviews, testimonials, or product reviews with links."
                ],
                "page": "homepage",
                "shopifyAppUrl": "https://apps.shopify.com/air-reviews",
                "category": "Conversion",
                "scrapedAt": "2025-08-21T10:33:05.093Z",
                "createdAt": "2025-08-21T10:33:05.095Z",
                "updatedAt": "2025-08-21T10:33:05.095Z",
                "__v": 0
            }
        },
        {
            "checklistItem": "SPECIAL OFFERS: Check for highlighted deals, discounts, or urgency offers near the top.",
            "status": "FAIL",
            "reason": "There are no highlighted deals, discounts, or urgency offers prominently displayed near the top of the homepage.",
            "problemName": "Missing Special Offers",
            "problem": "The lack of special offers near the top means visitors might miss out on potential savings, reducing the likelihood of immediate purchases.",
            "solution": "Highlight any deals, discounts, or limited-time offers near the top of the homepage to attract customer attention and encourage conversions.",
            "image_reference": "6884fd451974bdc7c8e4aa72",
            "imageReferenceObject": {
                "id": "6884fd451974bdc7c8e4aa72",
                "imageUrl": "/uploads/image_1753546053066.png",
                "useCases": [
                    "VALUE PROPOSITION & MESSAGING: ✓ 5. VALUE PROPOSITION: Look for clear tagline, welcome message, or value statement."
                ],
                "uploadDate": "2025-07-26T16:07:33.074Z",
                "fileName": "image_1753546053066.png",
                "createdAt": "2025-07-26T16:07:33.106Z",
                "updatedAt": "2025-08-21T06:49:15.500Z",
                "page": "homepage",
                "country": "US"
            }
        },
        {
            "checklistItem": "CTA BUTTONS: Look for CTA button to motivate clicks to product page , add to cart button , or buy now button etc..",
            "status": "FAIL",
            "reason": "While the Khalta Maryam Perfume section contains a \"BUY IT NOW\" button, the Dress Your Gift section does not have a clear CTA button to motivate clicks to the product page. The other product cards do not contain the CTA buttons.",
            "problemName": "Missing CTA Buttons on Product Cards",
            "problem": "Customers are not easily prompted to click through to product pages from the product cards, which can reduce engagement and potential sales.",
            "solution": "Add a clear \"Shop Now\" or \"View Details\" CTA button to each product card to encourage clicks to the product pages and facilitate purchases.",
            "image_reference": "6888ea360305a9dbcd095e58",
            "imageReferenceObject": {
                "id": "6888ea360305a9dbcd095e58",
                "imageUrl": "/uploads/image_1753803318661.png",
                "useCases": [
                    "\"Strategic product comparison section featuring two variants with clear differentiation: Black Edition (High-protein complete meal) vs Powder (The original complete meal)\" (Cross-sells & Upsells)",
                    "\"Detailed nutritional information with protein content (40g vs 30g) and calorie count (400 kcal per meal) for informed comparison\" (Product Title & Description)",
                    "\"Dual call-to-action strategy with 'View product' for detailed information and 'Add to basket' for immediate purchase\" (CTAs)"
                ],
                "page": "collection",
                "industry": "Health & Wellness",
                "country": "GB",
                "url": "https://uk.huel.com/products/huel-black-edition",
                "uploadDate": "2025-07-29T15:35:18.662Z",
                "fileName": "image_1753803318661.png",
                "createdAt": "2025-07-29T15:35:18.663Z",
                "updatedAt": "2025-07-29T15:35:18.663Z"
            }
        }
    ]
}