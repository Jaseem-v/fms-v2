export class ShopifyValidationService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api';
  }

  async validateShopifySite(url: string): Promise<{ isShopify: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/validate-shopify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Validation request failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Shopify validation error:', error);
      throw new Error('Failed to validate Shopify site');
    }
  }

  // Client-side validation as fallback
  async validateShopifyClientSide(url: string): Promise<{ isShopify: boolean; message?: string }> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'no-cors', // This won't work due to CORS, but we'll try
      });

      // Since we can't actually fetch due to CORS, we'll do basic URL validation
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      // Check for common Shopify indicators in the URL
      const shopifyIndicators = [
        '.myshopify.com',
        'shopify',
        'shop',
        'store'
      ];

      const hasShopifyIndicator = shopifyIndicators.some(indicator => 
        hostname.includes(indicator)
      );

      if (hasShopifyIndicator) {
        return { 
          isShopify: true, 
          message: 'URL appears to be a Shopify site based on domain pattern' 
        };
      }

      return { 
        isShopify: false, 
        message: 'This does not appear to be a Shopify site. Please enter a valid Shopify store URL.' 
      };
    } catch (error) {
      console.error('Client-side validation error:', error);
      return { 
        isShopify: false, 
        message: 'Unable to validate site. Please ensure you enter a valid Shopify store URL.' 
      };
    }
  }
}

export default new ShopifyValidationService(); 