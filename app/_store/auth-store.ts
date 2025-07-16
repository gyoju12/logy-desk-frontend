import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

const getInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { isLoggedIn: false, userId: null };
  }
  const storedUserId = localStorage.getItem('userId');
  return {
    isLoggedIn: !!storedUserId,
    userId: storedUserId,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  login: (userId) => {
    localStorage.setItem('userId', userId);
    set({ isLoggedIn: true, userId });
  },
  logout: () => {
    localStorage.removeItem('userId');
    set({ isLoggedIn: false, userId: null });
  },
}));
