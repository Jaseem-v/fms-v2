import React from 'react'

interface PageContent {
    title: string
    subtitle: string
    description: string
    issues: string[]
}

const pageContentMap: Record<string, PageContent> = {
    homepage: {
        title: "Why Your Homepage Matters",
        subtitle: "First Impressions Decide Everything",
        description: "A cluttered or unclear home page makes visitors bounce fast. Our audit shows what's stopping them from exploring.",
        issues: [
            "Weak hero headline",
            "Confusing navigation",
            "Missing offers/promos",
            "Poor mobile layout",
            "Slow load speed",
            "No clear value prop"
        ]
    },
    collection: {
        title: "Why Your Collection Page Matters",
        subtitle: "The collection page is your store's \"aisle.\"",
        description: "Hard-to-find products = lost sales. An optimized collection page keeps shoppers browsing and buying.",
        issues: [
            "Confusing filters",
            "No sorting options",
            "Overcrowded layout",
            "Hidden products",
            "Poor category naming"
        ]
    },
    product: {
        title: "Why Your Product Page Matters",
        subtitle: "Your product page is where buying decisions are made.",
        description: "Weak images, reviews, or CTAs kill conversions. Fixing product pages instantly boosts sales.",
        issues: [
            "Product images too small",
            "Trust badges missing",
            "Missing reviews",
            "Long product descriptions",
            "Weak CTA placement"
        ]
    },
    cart: {
        title: "Why Your Cart Page Matters",
        subtitle: "The cart page is the final checkpoint before checkout.",
        description: "Friction or hidden costs cause cart abandonment. A smooth cart flow keeps shoppers moving to checkout.",
        issues: [
            "Hidden shipping cost",
            "Cluttered cart design",
            "No urgency element",
            "Missing discount code box",
            "Weak upsell suggestions"
        ]
    }
}

export default function PageSpecificFeatures({ type }: { type: 'homepage' | 'collection' | 'product' | 'cart' }) {
    const getPageContent = (pageType: string): PageContent => {
        switch (pageType) {
            case 'homepage':
                return pageContentMap.homepage
            case 'collection':
                return pageContentMap.collection
            case 'product':
                return pageContentMap.product
            case 'cart':
                return pageContentMap.cart
            default:
                return pageContentMap.homepage
        }
    }

    const content = getPageContent(type)

    return (
        <div className="psf my-16">
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-8">
                        <h2 className="section-header__title">
                            {content.title}
                        </h2>
                    </div>
                    <div className="flex w-full justify-center">
                        <div className="psf__content">
                            <h3>
                                {content.subtitle}
                            </h3>
                            <p>
                                {content.description}
                            </p>

                            <ul className='psf__list'>
                                {content.issues.map((issue, index) => (
                                    <li key={index}>
                                        {issue}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
