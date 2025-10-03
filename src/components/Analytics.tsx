import { useEffect } from 'react';

export const Analytics = () => {
  useEffect(() => {
    // Track page view
    const trackVisit = async () => {
      try {
        // Use hostname to create unique counter for localhost vs production
        const hostname = window.location.hostname;
        const key = hostname === 'localhost' ? 'chainexplorer-dev' : 'chainexplorer.app';
        await fetch(`https://api.countapi.xyz/hit/${key}/visits`);
      } catch (error) {
        console.log('Analytics tracking failed:', error);
      }
    };

    trackVisit();
  }, []);

  return null; // This component doesn't render anything
};