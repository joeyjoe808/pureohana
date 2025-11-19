/**
 * Google Tag (gtag.js) utilities for conversion tracking
 *
 * This file provides type-safe utilities for tracking Google Ads conversions
 * and other analytics events.
 */

// Extend the Window interface to include gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Tracks a Google Ads conversion event
 *
 * @param conversionId - The Google Ads conversion ID (e.g., 'AW-CONVERSION_ID/CONVERSION_LABEL')
 * @param value - Optional conversion value (e.g., estimated lead value)
 * @param currency - Currency code (default: 'USD')
 */
export function trackConversion(
  conversionId: string,
  value?: number,
  currency: string = 'USD'
) {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    console.warn('[Google Tag] Not in browser environment (SSR)');
    return;
  }

  // Check if gtag is available
  if (!window.gtag) {
    console.error('[Google Tag] gtag.js is not loaded! Make sure the script is in your layout.');
    console.log('[Google Tag] The Google tag script should be loaded in app/layout.tsx');
    return;
  }

  // Check if dataLayer exists
  if (!window.dataLayer) {
    console.error('[Google Tag] window.dataLayer is not defined! Google tag may not be initialized properly.');
    return;
  }

  try {
    console.log('[Google Tag] Sending conversion to Google Ads:', {
      conversionId,
      value,
      currency,
      timestamp: new Date().toISOString()
    });

    // Send conversion event
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
      currency: currency,
    });

    console.log('[Google Tag] Conversion successfully sent to dataLayer');
    console.log('[Google Tag] dataLayer current state:', window.dataLayer);
  } catch (error) {
    console.error('[Google Tag] Error tracking conversion:', error);
  }
}

/**
 * Tracks a contact form submission conversion
 * This is a convenience function specifically for the contact form
 *
 * @param leadValue - Optional estimated value of this lead
 */
export function trackContactFormSubmission(leadValue?: number) {
  console.log('[Google Tag] Contact Form Conversion Tracking initiated');

  // You'll need to get your conversion label from Google Ads
  // It will look like: 'AW-17740589628/AbC-XXXXXXXXXXXXXXX'
  // For now, we'll track the base conversion

  console.log('[Google Tag] NOTE: To track specific conversion actions, add a conversion label from Google Ads.');
  console.log('[Google Tag] Example: AW-17740589628/YOUR_CONVERSION_LABEL');
  console.log('[Google Tag] You can find this in Google Ads > Goals > Conversions');

  // Track the conversion with the base ID
  trackConversion('AW-17740589628', leadValue);

  // Also send a custom event for analytics
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('[Google Tag] Sending custom analytics event: contact_form_submission');
    window.gtag('event', 'contact_form_submission', {
      event_category: 'Lead Generation',
      event_label: 'Contact Form',
      value: leadValue || 0,
    });
    console.log('[Google Tag] Custom analytics event sent');
  }
}

/**
 * Tracks custom events
 *
 * @param eventName - Name of the event
 * @param params - Optional event parameters
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('[Google Tag] gtag.js is not loaded yet');
    return;
  }

  try {
    window.gtag('event', eventName, params);
    console.log('[Google Tag] Event tracked:', eventName, params);
  } catch (error) {
    console.error('[Google Tag] Error tracking event:', error);
  }
}
