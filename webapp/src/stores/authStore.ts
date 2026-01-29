import { create } from 'zustand';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  department?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isSignedIn: boolean;
  isAdmin: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  setUser: (user: User | null) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  isSignedIn: false,
  isAdmin: false,

  login: async (username: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login(username, password);
      const { token, user } = response.data;

      Cookies.set('authToken', token, { expires: 7 });
      Cookies.set('user', JSON.stringify(user));

      set({
        user,
        token,
        isSignedIn: true,
        isAdmin: user.role === 'admin',
        loading: false,
      });
    } catch (err: any) {
      const error = err.response?.data?.message || 'Login failed';
      set({ error, loading: false });
      throw err;
    }
  },

  logout: () => {
    Cookies.remove('authToken');
    Cookies.remove('user');
    set({
      user: null,
      token: null,
      isSignedIn: false,
      isAdmin: false,
      error: null,
    });
  },

  register: async (data: any) => {
    set({ loading: true, error: null });
    try {
      await authAPI.registerUser(data);
      set({ loading: false });
    } catch (err: any) {
      const error = err.response?.data?.message || 'Registration failed';
      set({ error, loading: false });
      throw err;
    }
  },

  setUser: (user: User | null) => {
    set({
      user,
      isSignedIn: !!user,
      isAdmin: user?.role === 'admin' || false,
    });
  },

  initializeAuth: () => {
    const token = Cookies.get('authToken');
    const userCookie = Cookies.get('user');

    if (token && userCookie) {
      try {
        const user = JSON.parse(userCookie);
        set({
          token,
          user,
          isSignedIn: true,
          isAdmin: user.role === 'admin',
        });
      } catch (err) {
        Cookies.remove('authToken');
        Cookies.remove('user');
      }
    }
  },
}));
