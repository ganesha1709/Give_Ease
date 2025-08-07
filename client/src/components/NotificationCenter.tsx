import { useState } from 'react';
import { Bell, Gift, Heart, User, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'donation_claimed' | 'new_donation' | 'donation_delivered' | 'system';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'donation_claimed',
      title: 'Item Claimed!',
      message: 'Your Winter Jacket has been claimed by Sarah K.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      actionUrl: '/dashboard'
    },
    {
      id: '2',
      type: 'new_donation',
      title: 'New Donation Available',
      message: 'A laptop in Electronics category is now available near you.',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      actionUrl: '/browse'
    },
    {
      id: '3',
      type: 'system',
      title: 'Welcome to GiveEase!',
      message: 'Thank you for joining our community. Start by exploring available donations.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      actionUrl: '/browse'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'donation_claimed':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'new_donation':
        return <Gift className="h-4 w-4 text-green-500" />;
      case 'donation_delivered':
        return <Check className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'donation_claimed':
        return 'border-l-red-500';
      case 'new_donation':
        return 'border-l-green-500';
      case 'donation_delivered':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg">Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs"
          >
            Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-1 p-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    getNotificationColor(notification.type)
                  } ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-950' : 'bg-white dark:bg-gray-900'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}