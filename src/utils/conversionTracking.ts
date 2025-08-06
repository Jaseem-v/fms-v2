/**
 * Utility functions for Google Ads conversion tracking
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
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