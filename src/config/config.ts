export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  appName: 'CRO Analysis',
  paymentAmount: parseInt(process.env.NEXT_PUBLIC_PAYMENT_AMOUNT || '49', 10),
  currency: process.env.NEXT_PUBLIC_CURRENCY || 'USD',
  pricing: {
    mainPrice: parseInt(process.env.NEXT_PUBLIC_MAIN_PRICE || '49', 10),
    oldPrice: parseInt(process.env.NEXT_PUBLIC_OLD_PRICE || '999', 10),
    plans: {
      basic: parseInt(process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE || '99', 10),
      professional: parseInt(process.env.NEXT_PUBLIC_PROFESSIONAL_PLAN_PRICE || '199', 10),
      enterprise: parseInt(process.env.NEXT_PUBLIC_ENTERPRISE_PLAN_PRICE || '399', 10),
    },
  },
}; 