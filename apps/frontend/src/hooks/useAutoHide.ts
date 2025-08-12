'use client';

import { useState, useEffect, useRef } from 'react';

export const useAutoHide = (delay: number = 6000) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth > 768;
      setIsDesktop(desktop);
      
      // En móvil, siempre visible
      if (!desktop) {
        setIsVisible(true);
      }
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const updateActivity = () => {
    lastActivityRef.current = Date.now();
    setIsVisible(true);
  };

  useEffect(() => {
    if (!isDesktop) return;

    const handleActivity = () => updateActivity();
    
    // Detectar actividad del usuario
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('click', handleActivity);
    document.addEventListener('scroll', handleActivity);

    // Timer de verificación cada segundo
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const inactive = (now - lastActivityRef.current) > delay;
      
      if (inactive && isVisible) {
        setIsVisible(false);
      }
    }, 1000);

    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('scroll', handleActivity);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isDesktop, delay, isVisible]);

  return {
    isVisible,
    isDesktop,
    updateActivity
  };
};
