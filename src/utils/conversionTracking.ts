/**
 * Utility functions for Google Ads conversion tracking
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * Triggers a Google Ads conversion event for successful purchases
 * @param transactionId - Unique transaction identifier
 * @param value - Transaction value in USD
 * @param currency - Currency code (default: USD)
 */
export const triggerPurchaseConversion = (
  transactionId: string,
  value: number = 49.0,
  currency: string = 'USD'
): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-17433848522/SDTECL7i8oAbEMrVjflA',
      'value': value,
      'currency': currency,
      'transaction_id': transactionId
    });
    
    console.log('Google Ads conversion triggered:', {
      transactionId,
      value,
      currency
    });
  } else {
    console.warn('Google Ads gtag not available');
  }
};

/**
 * Triggers a conversion event with custom parameters
 * @param conversionId - Google Ads conversion ID
 * @param value - Transaction value
 * @param currency - Currency code
 * @param transactionId - Unique transaction identifier
 */
export const triggerCustomConversion = (
  conversionId: string,
  value: number,
  currency: string = 'USD',
  transactionId?: string
): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    const eventData: any = {
      'send_to': conversionId,
      'value': value,
      'currency': currency
    };
    
    if (transactionId) {
      eventData.transaction_id = transactionId;
    }
    
    window.gtag('event', 'conversion', eventData);
    
    console.log('Custom conversion triggered:', eventData);
  } else {
    console.warn('Google Ads gtag not available');
  }
};

/**
 * Triggers a GA4 purchase event with comprehensive tracking data
 * @param transactionData - Object containing transaction details
 */
export const triggerGA4Purchase = (transactionData: {
  conversionId: string;
  email?: string;
  phoneNumber?: string;
  itemCount: number;
  currency: string;
  transactionValue: number;
  productRows: Array<{
    id: string;
    category: string;
    name: string;
  }>;
}): void => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    const advancedMatchingParams = [];
    
    if (transactionData.email) {
      advancedMatchingParams.push({ 
        name: "email", 
        value: transactionData.email 
      });
    }
    
    if (transactionData.phoneNumber) {
      advancedMatchingParams.push({ 
        name: "phoneNumber", 
        value: transactionData.phoneNumber 
      });
    }

    window.dataLayer.push({
      event: "Purchase",
      conversionId: transactionData.conversionId,
      advancedMatchingParams,
      itemCount: transactionData.itemCount,
      currency: transactionData.currency,
      transactionValue: transactionData.transactionValue,
      productRows: transactionData.productRows
    });

    console.log('GA4 Purchase event triggered:', {
      event: "Purchase",
      conversionId: transactionData.conversionId,
      advancedMatchingParams,
      itemCount: transactionData.itemCount,
      currency: transactionData.currency,
      transactionValue: transactionData.transactionValue,
      productRows: transactionData.productRows
    });
  } else {
    console.warn('GA4 dataLayer not available');
  }
}; 