import React, { useEffect } from 'react';
import favicon from './assets/faviconn.png';

const Favicon = () => {
  useEffect(() => {
    // Update favicon dynamically
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = favicon;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  return null; // This component doesn't render anything
};

export default Favicon;