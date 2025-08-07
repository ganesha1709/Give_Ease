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
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: selectedCategory === 'all' ? ['/api/items'] : ['/api/items', selectedCategory],
    refetchOnWindowFocus: false,
  });

  const claimItemMutation = useMutation({
    mutationFn: async (itemId) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/items/${itemId}/claim`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
        title: 'Admin approved your request!',
        description: 'Your order is on the way! The donor will contact you soon for delivery.',
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
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCondition = selectedCondition === 'all' || item.condition === selectedCondition;
    const matchesLocation = selectedLocation === 'all' || 
      (item.location && item.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    
    return matchesSearch && matchesCategory && matchesCondition && matchesLocation;
  });

  const handleClaimItem = (itemId) => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Login required',
        description: 'Please log in to claim items.',
        variant: 'destructive',
      });
      return;
    }

    // No verification required - users can claim immediately

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

  const handleSuggestionClick = (suggestion, type) => {
    if (type === 'search') {
      setSearchTerm(suggestion);
    } else if (type === 'category') {
      setSelectedCategory(suggestion);
    } else if (type === 'location') {
      setSelectedLocation(suggestion);
    }
    setShowSuggestions(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Browse Donations</h1>
        <p className="text-neutral dark:text-gray-300">
          Find items that could help you or your organization
        </p>
      </div>

      {/* Advanced Search and Filters */}
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedCondition={selectedCondition}
        setSelectedCondition={setSelectedCondition}
      />

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
            <ItemCard
              key={item.id}
              item={item}
              onClaim={handleClaimItem}
              isClaimPending={claimItemMutation.isPending}
            />
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
            Create an account to start receiving donations instantly
          </p>
          <Button>
            Get Started
          </Button>
        </div>
      )}
    </div>
  );
}
