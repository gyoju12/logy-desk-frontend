import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'green-aurora' | 'sky-coral' | 'lavender' | 'classic-blue';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'green-aurora', // 기본 테마: 그린오로라
      setTheme: (theme) => {
        set({ theme });
        // data-theme 속성 업데이트
        if (theme === 'green-aurora') {
          document.documentElement.removeAttribute('data-theme');
        } else {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // 저장된 테마 적용
        if (state?.theme && state.theme !== 'green-aurora') {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);

// 테마 목록 정의
export const themes = [
  {
    id: 'green-aurora' as Theme,
    name: '그린오로라',
    description: '자연스러운 초록빛',
    colors: ['#4CAF50', '#66BB6A', '#388E3C', '#E8F5E8'],
  },
  {
    id: 'sky-coral' as Theme,
    name: '스카이코랄',
    description: '따뜻한 코랄 핑크',
    colors: ['#FF8A85', '#FFB3B0', '#FF6B6B', '#FFF0E8'],
  },
  {
    id: 'lavender' as Theme,
    name: '라벤더',
    description: '우아한 퍼플',
    colors: ['#B673D6', '#D4A5E3', '#E8D5F0', '#F5F2F7'],
  },
  {
    id: 'classic-blue' as Theme,
    name: '클래식 블루',
    description: '신뢰감 있는 블루',
    colors: ['#4578B8', '#7BA8D8', '#A8C8E8', '#2A4A88'],
  },
];
