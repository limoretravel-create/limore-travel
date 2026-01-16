// Analytics utility functions
// Replace with actual analytics service integration (Google Analytics, etc.)

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
  console.log('Analytics Event:', eventName, properties);
};

export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path,
    });
  }
  console.log('Page View:', path);
};

export const trackUserAction = (action: string, category: string, label?: string) => {
  trackEvent(action, {
    event_category: category,
    event_label: label,
  });
};

