# Settings Feature Documentation

## Overview
The settings feature allows administrators to control application behavior, specifically the payment flow for report generation.

## Features

### Payment Toggle
- **Location**: Admin Panel → Settings
- **Functionality**: Toggle between payment-enabled and payment-disabled modes
- **Storage**: Settings are stored in localStorage under the key `adminSettings`

## How It Works

### Payment Enabled (Default)
When payment is enabled:
1. User enters website URL
2. System validates Shopify site
3. User is redirected to payment page
4. After payment, user is redirected to report generation

### Payment Disabled
When payment is disabled:
1. User enters website URL
2. System validates Shopify site
3. Report generation starts immediately
4. No payment verification required

## Files Modified/Created

### New Files
- `src/app/admin/settings/page.tsx` - Settings page component
- `src/services/settingsService.ts` - Settings management service
- `src/utils/settingsUtils.ts` - Utility functions for settings

### Modified Files
- `src/components/admin/AdminSidebar.tsx` - Added settings navigation link
- `src/hooks/useAnalysis.ts` - Modified to check payment settings before redirecting

## Usage

### For Administrators
1. Navigate to `/admin/settings`
2. Toggle the "Enable Payment Gateway" switch
3. Settings are automatically saved to localStorage
4. Changes take effect immediately

### For Developers
```typescript
import settingsService from '../services/settingsService';

// Check if payment is enabled
const isPaymentEnabled = settingsService.isPaymentEnabled();

// Get all settings
const settings = settingsService.getSettings();

// Update a specific setting
settingsService.updateSetting('paymentEnabled', false);

// Save settings
settingsService.saveSettings({ paymentEnabled: false });
```

## Technical Details

### Settings Structure
```typescript
interface Settings {
  paymentEnabled: boolean;
}
```

### Default Settings
```typescript
const DEFAULT_SETTINGS: Settings = {
  paymentEnabled: true
};
```

### Storage
- **Key**: `adminSettings`
- **Format**: JSON string
- **Location**: localStorage
- **Fallback**: Default settings if localStorage is empty or corrupted

## Testing

### Manual Testing
1. Set payment to disabled in admin settings
2. Try to generate a report from the main page
3. Verify that analysis starts directly without payment redirect

### Utility Functions
```typescript
import { getPaymentStatus, setPaymentEnabled } from '../utils/settingsUtils';

// Test payment status
console.log('Payment enabled:', getPaymentStatus());

// Set payment disabled for testing
setPaymentEnabled(false);
```

## Future Enhancements
- Database storage for settings (currently localStorage)
- Additional settings (e.g., report customization, email notifications)
- User role-based settings access
- Settings API endpoints for backend integration 