import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRoles = [] }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Check if user needs to select a role
  if (user.role === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-blue-500 mx-auto" />
              <h2 className="text-2xl font-bold">Select Your Role</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Please select how you'd like to use GiveEase to continue.
              </p>
              <div className="space-y-2 pt-4">
                <RoleButton role="donor" label="I want to donate items" />
                <RoleButton role="recipient" label="I need items" />
                <RoleButton role="ngo" label="I represent an NGO" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user needs verification
  if (user.status === 'unverified') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Clock className="h-12 w-12 text-orange-500 mx-auto" />
              <h2 className="text-2xl font-bold">Verification Required</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your account is pending verification. Please wait for admin approval to access all features.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role permissions
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold">Access Denied</h2>
              <p className="text-gray-600 dark:text-gray-300">
                You don't have permission to access this page.
              </p>
              <Button onClick={() => setLocation('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}

function RoleButton({ role, label }) {
  const { selectRole, isSelectingRole } = useAuth();

  const handleSelectRole = async () => {
    try {
      await selectRole(role);
    } catch (error) {
      console.error('Error selecting role:', error);
    }
  };

  return (
    <Button
      onClick={handleSelectRole}
      disabled={isSelectingRole}
      className="w-full"
      variant="outline"
    >
      {label}
    </Button>
  );
}
