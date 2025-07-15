'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteLogger() {
  const pathname = usePathname();

  useEffect(() => {
    console.log(`[Route Change] Navigated to: ${pathname}`);
  }, [pathname]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
}
