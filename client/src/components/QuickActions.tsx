import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Heart, Users, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function QuickActions() {
  const { user } = useAuth();

  const getDonorActions = () => [
    {
      title: 'Add Donation',
      description: 'Share an item you no longer need',
      icon: <Plus className="h-5 w-5" />,
      href: '/add-donation',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'View My Donations',
      description: 'Track your donated items',
      icon: <TrendingUp className="h-5 w-5" />,
      href: '/dashboard',
      color: 'bg-blue-500 hover:bg-blue-600'
    }
  ];

  const getRecipientActions = () => [
    {
      title: 'Browse Items',
      description: 'Find items you need',
      icon: <Search className="h-5 w-5" />,
      href: '/browse',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'My Received Items',
      description: 'Track received donations',
      icon: <Heart className="h-5 w-5" />,
      href: '/dashboard',
      color: 'bg-red-500 hover:bg-red-600'
    }
  ];

  const getNgoActions = () => [
    {
      title: 'Donate Items',
      description: 'Add items on behalf of your NGO',
      icon: <Plus className="h-5 w-5" />,
      href: '/add-donation',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Browse Donations',
      description: 'Find items for your beneficiaries',
      icon: <Search className="h-5 w-5" />,
      href: '/browse',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'NGO Dashboard',
      description: 'Manage your organization activities',
      icon: <Users className="h-5 w-5" />,
      href: '/dashboard',
      color: 'bg-blue-500 hover:bg-blue-600'
    }
  ];

  const getActionsForRole = () => {
    switch (user?.role) {
      case 'donor':
        return getDonorActions();
      case 'recipient':
        return getRecipientActions();
      case 'ngo':
        return getNgoActions();
      default:
        return [];
    }
  };

  const actions = getActionsForRole();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0">
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto p-4 justify-start hover:scale-105 transition-transform"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white mr-4`}>
                  {action.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {action.description}
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}