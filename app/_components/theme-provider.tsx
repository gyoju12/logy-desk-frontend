'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/app/_store/theme-store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // 테마 초기화
    if (theme && theme !== 'green-aurora') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  return <>{children}</>;
}
