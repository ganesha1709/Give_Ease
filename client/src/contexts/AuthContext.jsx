import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: !!token,
    retry: false,
    meta: {
      onError: () => {
        setToken(null);
        localStorage.removeItem('auth_token');
      }
    }
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await apiRequest('POST', '/api/auth/login', { email, password });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setToken(data.token);
      localStorage.setItem('auth_token', data.token);
      queryClient.setQueryData(['/api/auth/me'], data.user);
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await apiRequest('POST', '/api/auth/register', userData);
      return response.json();
    }
  });

  const selectRoleMutation = useMutation({
    mutationFn: async (role) => {
      const response = await apiRequest('PATCH', '/api/auth/select-role', { role });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/auth/me'], data);
    }
  });

  const logout = () => {
    setToken(null);
    localStorage.removeItem('auth_token');
    queryClient.clear();
  };

  // Set up axios interceptor for token
  useEffect(() => {
    if (token) {
      const originalFetch = window.fetch;
      window.fetch = function(url, options = {}) {
        if (url.toString().startsWith('/api/')) {
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
          };
        }
        return originalFetch(url, options);
      };
      
      return () => {
        window.fetch = originalFetch;
      };
    }
  }, [token]);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    selectRole: selectRoleMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isSelectingRole: selectRoleMutation.isPending
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
