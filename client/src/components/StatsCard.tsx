import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  colorClass?: string;
}

export default function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  colorClass = 'bg-primary'
}: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center text-white`}>
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="mt-3 flex items-center space-x-1">
            {trend.value > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs font-medium ${trend.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-gray-500">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}