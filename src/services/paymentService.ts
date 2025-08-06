import { config } from '../config/config';

export interface PaymentRequest {
  websiteUrl: string;
  customerEmail: string;
  customerName: string;
  discountCode?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  paymentId?: string;
  message?: string;
  discountApplied?: boolean;
  originalAmount?: number;
  finalAmount?: number;
  discountAmount?: number;
}

export interface PaymentStatus {
  success: boolean;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
}

export interface DiscountVerification {
  success: boolean;
  valid: boolean;
  discountAmount?: number;
  discountPercentage?: number;
  message?: string;
}

class PaymentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
  }

  async verifyDiscountCode(discountCode: string): Promise<DiscountVerification> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/verify-discount/${discountCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: result.success,
          valid: result.valid,
          discountAmount: result.discountAmount,
          discountPercentage: result.discountPercentage,
          message: result.message,
        };
      } else {
        return {
          success: false,
          valid: false,
          message: result.message || 'Failed to verify discount code',
        };
      }
    } catch (error) {
      console.error('Discount verification error:', error);
      return {
        success: false,
        valid: false,
        message: 'Network error occurred',
      };
    }
  }

  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          paymentUrl: result.paymentUrl,
          paymentId: result.paymentId,
          discountApplied: result.discountApplied,
          originalAmount: result.originalAmount,
          finalAmount: result.finalAmount,
          discountAmount: result.discountAmount,
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to create payment',
        };
      }
    } catch (error) {
      console.error('Payment creation error:', error);
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  async verifyPayment(paymentId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/verify/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: result.success,
          status: result.status,
          message: result.message,
        };
      } else {
        return {
          success: false,
          status: 'failed',
          message: result.message || 'Failed to verify payment',
        };
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Network error occurred',
      };
    }
  }

  async verifyPaymentByOrderId(orderId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/verify-order/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: result.success,
          status: result.status,
          message: result.message,
        };
      } else {
        return {
          success: false,
          status: 'failed',
          message: result.message || 'Failed to verify payment',
        };
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Network error occurred',
      };
    }
  }
}

export default new PaymentService(); 