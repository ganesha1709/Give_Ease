import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart,
  Package,
  Users,
  Home,
  Menu,
  X,
  Gift,
  Search,
  Settings,
  LogOut,
  User,
  ChevronRight,
  RefreshCw,
  ChevronDown,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout, login } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const roleItems = [
    {
      key: 'donor',
      label: 'Donor',
      icon: Gift,
      href: '/add-donation',
      description: 'Donate items to those in need',
      status: 'active',
      available: ['donor', 'ngo']
    },
    {
      key: 'recipient',
      label: 'Recipient',
      icon: Heart,
      href: '/browse',
      description: 'Browse and receive donations',
      status: 'active',
      available: ['recipient', 'ngo']
    },
    {
      key: 'ngo',
      label: 'NGO',
      icon: Users,
      href: '/ngo',
      description: 'NGO partnership features',
      status: 'beta',
      available: ['ngo']
    }
  ];

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard',
    },
    {
      label: 'Browse Items',
      icon: Search,
      href: '/browse',
    },
    {
      label: 'My Profile',
      icon: User,
      href: '/profile',
    }
  ];

  const switchRoleMutation = useMutation({
    mutationFn: async (newRole) => {
      const response = await fetch('/api/auth/select-role', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to switch role');
      }

      return response.json();
    },
    onSuccess: (data) => {
      login(data, localStorage.getItem('token'));
      queryClient.invalidateQueries();
      toast({
        title: 'Role Switched',
        description: `You are now using the platform as a ${data.role}.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Role Switch Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleRoleSwitch = (newRole: string) => {
    if (newRole !== user?.role) {
      switchRoleMutation.mutate(newRole);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const availableRoles = [
    { value: 'donor', label: 'Donor', icon: Gift, description: 'Donate items to help others' },
    { value: 'recipient', label: 'Recipient', icon: Heart, description: 'Receive donations from the community' },
    { value: 'ngo', label: 'NGO', icon: Users, description: 'Connect with donors for your organization' },
  ];

  const isActive = (href: string) => {
    return location === href || location.startsWith(href + '/');
  };

  return (
    <div className={cn(
      "fixed left-0 top-0 z-50 h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-80"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <Heart className="text-white text-sm" />
            </div>
            <span className="font-bold text-lg">GiveEase</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="text-white text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.firstName} {user?.lastName}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 p-1 mt-1 justify-start">
                      <Badge variant="secondary" className="text-xs capitalize mr-1">
                        {user?.role || 'Member'}
                      </Badge>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-xs text-gray-500">Switch Role</p>
                    </div>
                    <DropdownMenuSeparator />
                    {availableRoles.map((role) => (
                      <DropdownMenuItem
                        key={role.value}
                        onClick={() => handleRoleSwitch(role.value)}
                        disabled={switchRoleMutation.isPending}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <role.icon className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{role.label}</span>
                            {user?.role === role.value && (
                              <Check className="h-3 w-3 text-green-600" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{role.description}</p>
                        </div>
                        {switchRoleMutation.isPending && user?.role !== role.value && (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        )}

        {/* Role-based Features */}
        <div className="p-4">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Role Features
            </h3>
          )}
          <div className="space-y-2">
            {roleItems.map((item) => {
              const Icon = item.icon;
              const isAvailable = item.available.includes(user?.role || '');
              const isCurrent = user?.role === item.key;
              
              if (!isAvailable && !isCurrent) return null;

              return (
                <div key={item.key}>
                  {item.status === 'active' ? (
                    <Link href={item.href}>
                      <Button
                        variant={isActive(item.href) ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          isCollapsed ? "px-2" : "px-3"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {!isCollapsed && (
                          <>
                            <span className="ml-3">{item.label}</span>
                            {isCurrent && (
                              <Badge variant="outline" className="ml-auto text-xs">
                                Active
                              </Badge>
                            )}
                          </>
                        )}
                      </Button>
                    </Link>
                  ) : (
                    <div
                      className={cn(
                        "w-full flex items-center px-3 py-2 rounded-md bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800",
                        isCollapsed && "px-2"
                      )}
                    >
                      <Icon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      {!isCollapsed && (
                        <>
                          <span className="ml-3 text-orange-700 dark:text-orange-300">
                            {item.label}
                          </span>
                          <Badge variant="secondary" className="ml-auto text-xs bg-orange-100 text-orange-700">
                            Beta
                          </Badge>
                        </>
                      )}
                    </div>
                  )}
                  {!isCollapsed && item.status === 'beta' && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 ml-7">
                      Coming soon - Under development
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Navigation
            </h3>
          )}
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isCollapsed ? "px-2" : "px-3"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-slate-800 p-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
            isCollapsed ? "px-2" : "px-3"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
}