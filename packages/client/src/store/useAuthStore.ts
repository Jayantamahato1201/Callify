import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setAuth: (user, accessToken) => {
    set({ user, accessToken, isAuthenticated: true });
  },
  updateUser: (updatedFields) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedFields } : null
    }));
  },
  logout: () => {
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
