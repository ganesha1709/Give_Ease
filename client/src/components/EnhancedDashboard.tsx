import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Bell, 
  TrendingUp, 
  Users, 
  Gift, 
  Heart, 
  Plus,
  Search,
  Award,
  Target,
  Activity,
  Clock,
  Zap
} from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

export default function EnhancedDashboard({ stats, myDonations, myReceivedItems }) {
  const { user } = useAuth();
  
  const donationCount = user?.donationCount || 0;
  
  // Quick stats data
  const quickStats = [
    {
      title: 'My Impact',
      value: donationCount,
      description: user?.role === 'donor' ? 'Items donated' : 'Items received',
      icon: <Award className="h-5 w-5" />,
      color: 'bg-blue-500',
      trend: { value: 12, label: 'this month' }
    },
    {
      title: 'Badge Level',
      value: user?.badgeLevel || 'Bronze',
      description: 'Achievement level',
      icon: <Heart className="h-5 w-5" />,
      color: 'bg-red-500'
    },
    {
      title: 'Community',
      value: stats?.totalDonations || 0,
      description: 'Total platform donations',
      icon: <Gift className="h-5 w-5" />,
      color: 'bg-green-500'
    },
    {
      title: 'Active Users',
      value: stats?.verifiedUsers || 0,
      description: 'Verified members',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-purple-500'
    }
  ];

  // Recent notifications (mock data)
  const notifications = [
    {
      id: 1,
      title: 'Item Claimed!',
      message: 'Your Winter Jacket has been claimed by Sarah K.',
      time: '2h ago',
      type: 'success'
    },
    {
      id: 2,
      title: 'New Match Found',
      message: 'A laptop near you matches your preferences.',
      time: '4h ago',
      type: 'info'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.firstName || 'Friend'}! 👋
            </h1>
            <p className="opacity-90">
              You're making a real difference in the community as a {user?.role}.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{donationCount}</div>
            <div className="text-sm opacity-75">Total Impact</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
              </div>
              
              {stat.trend && (
                <div className="mt-3 flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs font-medium text-green-600">
                    +{stat.trend.value}%
                  </span>
                  <span className="text-xs text-gray-500">{stat.trend.label}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user?.role === 'donor' && (
                  <>
                    <Link href="/add-donation">
                      <Button className="w-full h-16 bg-green-500 hover:bg-green-600">
                        <div className="text-center">
                          <Plus className="h-5 w-5 mx-auto mb-1" />
                          <div className="font-medium">Add Donation</div>
                          <div className="text-xs opacity-75">Share an item</div>
                        </div>
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full h-16">
                      <div className="text-center">
                        <Activity className="h-5 w-5 mx-auto mb-1" />
                        <div className="font-medium">Track Donations</div>
                        <div className="text-xs text-gray-500">View status</div>
                      </div>
                    </Button>
                  </>
                )}
                {user?.role === 'recipient' && (
                  <>
                    <Link href="/browse">
                      <Button className="w-full h-16 bg-blue-500 hover:bg-blue-600">
                        <div className="text-center">
                          <Search className="h-5 w-5 mx-auto mb-1" />
                          <div className="font-medium">Browse Items</div>
                          <div className="text-xs opacity-75">Find what you need</div>
                        </div>
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full h-16">
                      <div className="text-center">
                        <Heart className="h-5 w-5 mx-auto mb-1" />
                        <div className="font-medium">My Items</div>
                        <div className="text-xs text-gray-500">Track received</div>
                      </div>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progress Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-500" />
                <span>Impact Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Badge Progress</span>
                  <span>{donationCount}/10 to Gold</span>
                </div>
                <Progress value={(donationCount / 10) * 100} className="h-2" />
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-500">{donationCount}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-500">2</div>
                  <div className="text-xs text-gray-500">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-500">5</div>
                  <div className="text-xs text-gray-500">This Month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  <span>Notifications</span>
                </div>
                <Badge variant="destructive" className="text-xs">2</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-500" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { user: 'John D.', action: 'donated Winter Jacket', time: '15m ago' },
                  { user: 'Sarah K.', action: 'claimed Laptop', time: '1h ago' },
                  { user: 'Mike R.', action: 'joined community', time: '2h ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-primary text-white">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm"><strong>{activity.user}</strong> {activity.action}</p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}