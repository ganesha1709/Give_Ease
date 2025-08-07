import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarContent, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Calendar, MapPin, User, Star, Verified } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface ItemCardProps {
  item: any;
  onClaim: (itemId: string) => void;
  isClaimPending: boolean;
}

export default function ItemCard({ item, onClaim, isClaimPending }: ItemCardProps) {
  const { user, isAuthenticated } = useAuth();

  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'bronze': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'gold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'slightly_used': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const canClaim = isAuthenticated && (user?.role === 'recipient' || user?.role === 'ngo');

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 group">
      {/* Image Section */}
      <div className="relative">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image available</span>
          </div>
        )}
        
        {/* Quick Info Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs capitalize backdrop-blur-sm bg-white/80 dark:bg-black/80">
            {item.category}
          </Badge>
          <Badge className={`text-xs capitalize ${getConditionColor(item.condition)} backdrop-blur-sm`}>
            {item.condition.replace('_', ' ')}
          </Badge>
        </div>

        {/* Time Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="text-xs backdrop-blur-sm bg-white/80 dark:bg-black/80">
            {formatDate(item.createdAt)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title and Description */}
        <div className="space-y-2 mb-4">
          <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Location */}
        {item.location && (
          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <MapPin className="h-3 w-3" />
            <span className="capitalize">{item.location}</span>
          </div>
        )}

        {/* Donor Info and Action */}
        <div className="flex items-center justify-between">
          {/* Donor Info */}
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-white text-xs">
                {item.donor ? `${item.donor.firstName[0]}${item.donor.lastName[0]}` : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">
                  {item.donor ? `${item.donor.firstName} ${item.donor.lastName[0]}.` : 'Anonymous'}
                </span>
                {item.donor?.badgeLevel && item.donor.badgeLevel !== 'none' && (
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                )}
              </div>
              {item.donor?.badgeLevel && item.donor.badgeLevel !== 'none' && (
                <Badge size="sm" className={`${getBadgeColor(item.donor.badgeLevel)} text-xs w-fit`}>
                  {item.donor.badgeLevel} donor
                </Badge>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div>
            {item.status === 'claimed' ? (
              <Button size="sm" variant="secondary" disabled>
                <Heart className="mr-1 h-3 w-3" />
                Claimed
              </Button>
            ) : item.status === 'delivered' ? (
              <Button size="sm" variant="secondary" disabled>
                <Heart className="mr-1 h-3 w-3" />
                Delivered
              </Button>
            ) : canClaim ? (
              <Button
                size="sm"
                onClick={() => onClaim(item.id)}
                disabled={isClaimPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Heart className="mr-1 h-3 w-3" />
                {isClaimPending ? 'Processing...' : 'Receive'}
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
  );
}