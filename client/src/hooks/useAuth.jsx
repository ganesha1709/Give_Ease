import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// Re-export the auth context hook for convenience
export const useAuth = useAuthContext;

// You can also create additional auth-related hooks here if needed
export default useAuth;
