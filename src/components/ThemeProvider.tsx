'use client';

import { useEffect } from 'react';

export default function ThemeProvider({ initialTheme }: { initialTheme?: string }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem('space_a_theme') || initialTheme || 'monochrome';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, [initialTheme]);

  return null;
}
