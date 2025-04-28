// client/src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  userId: string;
  username: string;
  email: string;
  token: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const API_URL = 'http://localhost:8000/api';

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.detail || 'Login failed');
          }
          
          set({ 
            user: data.data,
            isLoading: false, 
            isAuthenticated: true,
          });
          
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isAuthenticated: false,
          });
        }
      },
      
      register: async (email: string, password: string, username: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, username }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.detail || 'Registration failed');
          }
          
          set({ isLoading: false });
          
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred',
          });
        }
      },
      
      loginWithGoogle: async (idToken: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.detail || 'Google login failed');
          }
          
          set({ 
            user: data.data,
            isLoading: false, 
            isAuthenticated: true,
          });
          
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isAuthenticated: false,
          });
        }
      },
      
      logout: async () => {
        try {
          set({ isLoading: true });
          
          const { user } = get();
          
          if (user?.token) {
            // Call the logout API
            await fetch(`${API_URL}/auth/logout`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ idToken: user.token }),
            });
          }
          
          // Clear user data regardless of API response
          set({ 
            user: null, 
            isLoading: false, 
            isAuthenticated: false,
          });
          
        } catch (error) {
          // Still clear user data even if API fails
          set({ 
            user: null,
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Logout failed',
            isAuthenticated: false,
          });
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'uply-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;