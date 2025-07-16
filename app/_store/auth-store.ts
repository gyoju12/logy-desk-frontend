import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const initialState = {
    isLoggedIn: !!storedUserId,
    userId: storedUserId,
  };

  return {
    ...initialState,
    login: (userId) => {
      localStorage.setItem('userId', userId);
      set({ isLoggedIn: true, userId });
    },
    logout: () => {
      localStorage.removeItem('userId');
      set({ isLoggedIn: false, userId: null });
    },
  };
});
