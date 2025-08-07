import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
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
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const [location] = useLocation();

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

  const handleLogout = () => {
    logout();
  };

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
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role}
                </p>
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