import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Sparkles, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ImpactTracker() {
  const { user } = useAuth();
  
  const donationCount = user?.donationCount || 0;
  
  const getBadgeProgress = () => {
    if (donationCount < 5) {
      return {
        current: 'Bronze',
        next: 'Silver',
        progress: (donationCount / 5) * 100,
        remaining: 5 - donationCount,
        color: 'bg-orange-500'
      };
    } else if (donationCount < 10) {
      return {
        current: 'Silver',
        next: 'Gold',
        progress: ((donationCount - 5) / 5) * 100,
        remaining: 10 - donationCount,
        color: 'bg-gray-400'
      };
    } else {
      return {
        current: 'Gold',
        next: 'Platinum',
        progress: Math.min(((donationCount - 10) / 10) * 100, 100),
        remaining: Math.max(20 - donationCount, 0),
        color: 'bg-yellow-500'
      };
    }
  };

  const badgeInfo = getBadgeProgress();

  const achievements = [
    {
      title: 'First Donation',
      description: 'Made your first donation',
      icon: <Sparkles className="h-4 w-4" />,
      unlocked: donationCount >= 1,
      color: 'text-blue-500'
    },
    {
      title: 'Generous Giver',
      description: 'Donated 5+ items',
      icon: <Award className="h-4 w-4" />,
      unlocked: donationCount >= 5,
      color: 'text-green-500'
    },
    {
      title: 'Community Champion',
      description: 'Donated 10+ items',
      icon: <Trophy className="h-4 w-4" />,
      unlocked: donationCount >= 10,
      color: 'text-yellow-500'
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">Impact Tracker</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Badge Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${badgeInfo.color}`} />
              <span className="font-medium">{badgeInfo.current} Status</span>
            </div>
            <Badge variant="outline" className="text-xs">
              Next: {badgeInfo.next}
            </Badge>
          </div>
          
          <Progress value={badgeInfo.progress} className="h-2" />
          
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {badgeInfo.remaining > 0 
              ? `${badgeInfo.remaining} more donations to reach ${badgeInfo.next}`
              : `Congratulations! You've reached ${badgeInfo.current} status!`
            }
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Achievements</h4>
          <div className="grid gap-2">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-2 rounded-lg border transition-all ${
                  achievement.unlocked 
                    ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60'
                }`}
              >
                <div className={`${achievement.unlocked ? achievement.color : 'text-gray-400'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    achievement.unlocked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {achievement.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    ✓
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{donationCount}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Donations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {Math.round((donationCount / Math.max(user?.createdAt ? 
                (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24) : 1, 1)) * 7) || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Per Week</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}