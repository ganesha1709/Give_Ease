import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Activity, Heart, Gift, Users, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'donation_added' | 'item_claimed' | 'item_delivered' | 'user_joined';
  title: string;
  description: string;
  user: {
    name: string;
    role: string;
  };
  timestamp: Date;
  category?: string;
}

export default function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'donation_added',
      title: 'New Winter Jacket Available',
      description: 'Added a winter jacket in great condition',
      user: { name: 'John D.', role: 'donor' },
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      category: 'clothes'
    },
    {
      id: '2',
      type: 'item_claimed',
      title: 'Laptop Claimed',
      description: 'Electronics item found a new home',
      user: { name: 'Sarah K.', role: 'recipient' },
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      category: 'electronics'
    },
    {
      id: '3',
      type: 'user_joined',
      title: 'New Member Joined',
      description: 'Welcome to the GiveEase community!',
      user: { name: 'Mike R.', role: 'ngo' },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '4',
      type: 'donation_added',
      title: 'Children Books Available',
      description: 'Educational books for kids aged 5-10',
      user: { name: 'Lisa M.', role: 'donor' },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      category: 'books'
    },
    {
      id: '5',
      type: 'item_delivered',
      title: 'Kitchen Items Delivered',
      description: 'Successfully delivered to recipient',
      user: { name: 'Anna P.', role: 'recipient' },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      category: 'kitchen'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'donation_added':
        return <Gift className="h-4 w-4 text-green-500" />;
      case 'item_claimed':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'item_delivered':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'user_joined':
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'donor':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'recipient':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'ngo':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.title}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {activity.description}
                </p>
                <div className="flex items-center space-x-2">
                  <Avatar className="w-5 h-5">
                    <AvatarFallback className="text-xs bg-primary text-white">
                      {activity.user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {activity.user.name}
                  </span>
                  <Badge size="sm" className={`${getRoleColor(activity.user.role)} text-xs`}>
                    {activity.user.role}
                  </Badge>
                  {activity.category && (
                    <Badge variant="outline" size="sm" className="text-xs capitalize">
                      {activity.category}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-2">
            <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              View all activity
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}