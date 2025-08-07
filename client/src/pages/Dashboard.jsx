import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'wouter';
import { 
  Plus, 
  Package, 
  Heart, 
  Award, 
  Calendar, 
  MapPin, 
  User,
  Image as ImageIcon,
  Search,
  TrendingUp,
  Users,
  Gift
} from 'lucide-react';
import EnhancedDashboard from '@/components/EnhancedDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  const { data: myDonations, isLoading: donationsLoading } = useQuery({
    queryKey: ['/api/items/my-donations'],
    enabled: user?.role === 'donor' || user?.role === 'ngo',
  });

  const { data: myReceivedItems, isLoading: receivedLoading } = useQuery({
    queryKey: ['/api/items/my-received'],
    enabled: user?.role === 'recipient' || user?.role === 'ngo',
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
  });

  const getBadgeColor = (level) => {
    switch (level) {
      case 'bronze': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'claimed': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'delivered': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-neutral dark:text-gray-300">
          Here's your impact summary and recent activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.donationCount || 0}</div>
            <p className="text-xs text-neutral dark:text-gray-400">Items successfully donated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badge Level</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getBadgeColor(user?.badgeLevel)}>
                {user?.badgeLevel === 'none' ? 'No badge' : `${user?.badgeLevel} level`}
              </Badge>
            </div>
            <p className="text-xs text-neutral dark:text-gray-400">
              {user?.badgeLevel === 'bronze' && 'Keep going! 5 donations for Silver'}
              {user?.badgeLevel === 'silver' && '5 more donations for Gold!'}
              {user?.badgeLevel === 'gold' && 'You are a Gold Hero!'}
              {user?.badgeLevel === 'none' && 'Make your first donation!'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <User className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user?.status}</div>
            <p className="text-xs text-neutral dark:text-gray-400">
              Role: {user?.role}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Role-based Actions */}
      <div className="flex flex-wrap gap-4">
        {(user?.role === 'donor' || user?.role === 'ngo') && (
          <Link href="/add-donation">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Donation
            </Button>
          </Link>
        )}
        <Link href="/browse">
          <Button variant="outline">
            <Package className="mr-2 h-4 w-4" />
            Browse Items
          </Button>
        </Link>
      </div>

      {/* My Donations (for donors and NGOs) */}
      {(user?.role === 'donor' || user?.role === 'ngo') && (
        <Card>
          <CardHeader>
            <CardTitle>My Donations</CardTitle>
            <CardDescription>
              Track the status of your donated items
            </CardDescription>
          </CardHeader>
          <CardContent>
            {donationsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : myDonations && myDonations.length > 0 ? (
              <div className="space-y-4">
                {myDonations.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-neutral dark:text-gray-400 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2 items-end">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {item.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-neutral dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Created {formatDate(item.createdAt)}</span>
                        </div>
                        {item.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>
                      {item.imageUrl && (
                        <div className="flex items-center space-x-1">
                          <ImageIcon className="h-3 w-3" />
                          <span>Has image</span>
                        </div>
                      )}
                    </div>

                    {item.recipient && (
                      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                        <p className="text-sm">
                          <strong>Claimed by:</strong> {item.recipient.firstName} {item.recipient.lastName}
                        </p>
                        {item.claimedAt && (
                          <p className="text-xs text-neutral dark:text-gray-400">
                            Claimed on {formatDate(item.claimedAt)}
                          </p>
                        )}
                      </div>
                    )}

                    {item.deliveryProof && (
                      <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                        <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                          ✅ Delivery Confirmed!
                        </p>
                        <p className="text-sm">
                          <strong>Thank you message:</strong> {item.deliveryProof.thankYouMessage}
                        </p>
                        {item.deliveryProof.imageUrl && (
                          <div className="mt-2">
                            <img
                              src={item.deliveryProof.imageUrl}
                              alt="Delivery proof"
                              className="w-32 h-24 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No donations yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start making a difference by donating your first item
                </p>
                <Link href="/add-donation">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Donation
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* My Received Items (for recipients and NGOs) */}
      {(user?.role === 'recipient' || user?.role === 'ngo') && (
        <Card>
          <CardHeader>
            <CardTitle>My Received Items</CardTitle>
            <CardDescription>
              Items you have claimed and received
            </CardDescription>
          </CardHeader>
          <CardContent>
            {receivedLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : myReceivedItems && myReceivedItems.length > 0 ? (
              <div className="space-y-4">
                {myReceivedItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-neutral dark:text-gray-400 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2 items-end">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {item.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-neutral dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Received {formatDate(item.claimedAt || item.createdAt)}</span>
                        </div>
                        {item.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>
                      {item.imageUrl && (
                        <div className="flex items-center space-x-1">
                          <ImageIcon className="h-3 w-3" />
                          <span>Has image</span>
                        </div>
                      )}
                    </div>

                    {item.donor && (
                      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                        <p className="text-sm">
                          <strong>Donated by:</strong> {item.donor.firstName} {item.donor.lastName}
                        </p>
                        <p className="text-xs text-neutral dark:text-gray-400">
                          Contact for pickup/delivery arrangement
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No received items yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Browse available donations to find items you need
                </p>
                <Link href="/browse">
                  <Button>
                    <Search className="mr-2 h-4 w-4" />
                    Browse Available Items
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
