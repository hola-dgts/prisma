'use client';

import { useState, useEffect } from 'react';

export const useResponsiveTitle = (title: string) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + '...' : str;
  };
  
  return {
    displayTitle: isMobile ? truncate(title, 20) : truncate(title, 40),
    showFullTitle: !isMobile,
    isMobile
  };
};
