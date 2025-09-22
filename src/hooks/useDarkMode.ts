import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('moviehub-theme');
    if (stored) {
      return stored === 'dark';
    }
    
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Persist preference
    localStorage.setItem('moviehub-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark(!isDark);

  return { isDark, toggle };
}