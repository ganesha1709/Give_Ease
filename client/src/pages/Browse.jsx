import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Filter, Heart, MapPin, Calendar, User } from 'lucide-react';

export default function Browse() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: selectedCategory === 'all' ? ['/api/items'] : ['/api/items', selectedCategory],
    refetchOnWindowFocus: false,
  });

  const claimItemMutation = useMutation({
    mutationFn: async (itemId) => {
      const response = await fetch(`/api/items/${itemId}/claim`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to claim item');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      toast({
        title: 'Item claimed successfully!',
        description: 'The donor will be notified. Please arrange for pickup or delivery.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to claim item',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'clothes', label: 'Clothes' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'books', label: 'Books' },
    { value: 'toys', label: 'Toys' },
    { value: 'kitchen', label: 'Kitchen Items' },
    { value: 'other', label: 'Other' },
  ];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleClaimItem = (itemId) => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please log in to claim items.',
        variant: 'destructive',
      });
      return;
    }

    if (user?.status !== 'verified') {
      toast({
        title: 'Verification required',
        description: 'Your account must be verified to claim items.',
        variant: 'destructive',
      });
      return;
    }

    if (user?.role !== 'recipient' && user?.role !== 'ngo') {
      toast({
        title: 'Access denied',
        description: 'Only recipients and NGOs can claim items.',
        variant: 'destructive',
      });
      return;
    }

    claimItemMutation.mutate(itemId);
  };

  const getBadgeColor = (level) => {
    switch (level) {
      case 'bronze': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Browse Donations</h1>
        <p className="text-neutral dark:text-gray-300">
          Find items that could help you or your organization
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="capitalize">
                    {item.category}
                  </Badge>
                  <Badge className="capitalize">
                    {item.condition.replace('_', ' ')}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">{item.title}</h3>
                <p className="text-neutral dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <User className="text-white text-xs" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {item.donor ? `${item.donor.firstName} ${item.donor.lastName[0]}.` : 'Unknown'}
                        </span>
                        {item.donor?.badgeLevel !== 'none' && (
                          <Badge size="sm" className={getBadgeColor(item.donor.badgeLevel)}>
                            {item.donor.badgeLevel}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {isAuthenticated && (user?.role === 'recipient' || user?.role === 'ngo') && user?.status === 'verified' ? (
                      <Button
                        size="sm"
                        onClick={() => handleClaimItem(item.id)}
                        disabled={claimItemMutation.isPending}
                      >
                        <Heart className="mr-1 h-3 w-3" />
                        {claimItemMutation.isPending ? 'Claiming...' : 'Claim'}
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" disabled>
                        <Heart className="mr-1 h-3 w-3" />
                        Available
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No items found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'No donations are currently available'
            }
          </p>
        </div>
      )}

      {!isAuthenticated && (
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Want to claim items?
          </h3>
          <p className="text-blue-800 dark:text-blue-200 mb-4">
            Create an account and get verified to start claiming donations
          </p>
          <Button>
            Get Started
          </Button>
        </div>
      )}
    </div>
  );
}
