import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Clock, MapPin, Tag } from 'lucide-react';

interface SearchSuggestionsProps {
  onSuggestionClick: (suggestion: string, type: 'search' | 'category' | 'location') => void;
}

export default function SearchSuggestions({ onSuggestionClick }: SearchSuggestionsProps) {
  const trendingSearches = [
    'winter clothes',
    'laptop computer',
    'children books',
    'kitchen utensils',
    'study materials'
  ];

  const popularCategories = [
    { name: 'Electronics', count: 45 },
    { name: 'Clothes', count: 72 },
    { name: 'Books', count: 38 },
    { name: 'Kitchen', count: 29 },
    { name: 'Furniture', count: 15 }
  ];

  const nearbyLocations = [
    'Bangalore',
    'Mumbai', 
    'Delhi',
    'Hyderabad',
    'Pune'
  ];

  const recentSearches = [
    'textbooks for students',
    'winter jackets',
    'office supplies'
  ];

  return (
    <div className="space-y-4">
      {/* Trending Searches */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Trending Searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick(search, 'search')}
                className="text-xs h-7 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950"
              >
                <Search className="h-3 w-3 mr-1" />
                {search}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Categories */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Tag className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Popular Categories</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {popularCategories.map((category, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => onSuggestionClick(category.name.toLowerCase(), 'category')}
                className="justify-between text-xs h-8 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <span>{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nearby Locations */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <MapPin className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">Near You</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {nearbyLocations.map((location, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick(location.toLowerCase(), 'location')}
                className="text-xs h-6 px-2 hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-950"
              >
                {location}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Recent Searches</span>
            </div>
            <div className="space-y-1">
              {recentSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => onSuggestionClick(search, 'search')}
                  className="w-full justify-start text-xs h-7 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <Clock className="h-3 w-3 mr-2" />
                  {search}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}