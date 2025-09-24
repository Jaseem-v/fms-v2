export const config = {
  apiUrl: process.env.NEXT_PUBLIC_BACKEND_URL_WITHOUT_API || 'http://localhost:4000',
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000',
  appName: 'CRO Analysis',
  paymentAmount: parseInt(process.env.NEXT_PUBLIC_PAYMENT_AMOUNT || '149', 10),
  currency: process.env.NEXT_PUBLIC_CURRENCY || 'USD',
  pricing: {
    mainPrice: parseInt(process.env.NEXT_PUBLIC_MAIN_PRICE || '149', 10),
    oldPrice: parseInt(process.env.NEXT_PUBLIC_OLD_PRICE || '997', 10),
    storeAudit: parseInt(process.env.NEXT_PUBLIC_STORE_AUDIT || '349', 10),
    oneOnOneConsultation: parseInt(process.env.NEXT_PUBLIC_ONE_ON_ONE_CONSULTATION || '349', 10),
    croResource: parseInt(process.env.NEXT_PUBLIC_CRO_RESOURCE || '299', 10),
    plans: {
      basic: parseInt(process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE || '99', 10),
      professional: parseInt(process.env.NEXT_PUBLIC_PROFESSIONAL_PLAN_PRICE || '199', 10),
      enterprise: parseInt(process.env.NEXT_PUBLIC_ENTERPRISE_PLAN_PRICE || '399', 10),
    },
  },
}; 