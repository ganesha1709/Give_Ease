import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Edit3, 
  Save, 
  X,
  Heart,
  Gift,
  Users,
  TrendingUp,
  Star
} from 'lucide-react';

export default function MyProfile() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      return response.json();
    },
    onSuccess: (data) => {
      login(data.user, localStorage.getItem('token'));
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      setIsEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(false);
  };

  const getBadgeColor = (level) => {
    switch (level) {
      case 'bronze':
        return 'bg-amber-600 hover:bg-amber-700';
      case 'silver':
        return 'bg-slate-500 hover:bg-slate-600';
      case 'gold':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'donor':
        return <Gift className="h-4 w-4" />;
      case 'recipient':
        return <Heart className="h-4 w-4" />;
      case 'ngo':
        return <Users className="h-4 w-4" />;
      case 'admin':
        return <Star className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'donor':
        return 'Help others by donating items you no longer need';
      case 'recipient':
        return 'Receive donated items from generous community members';
      case 'ngo':
        return 'Connect with donors to support your organization\'s mission';
      case 'admin':
        return 'Manage and oversee the GiveEase platform';
      default:
        return 'Welcome to the GiveEase community';
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {user.firstName || 'Not specified'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      {user.lastName || 'Not specified'}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{user.email}</span>
                </div>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{user.phone || 'Not specified'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{user.address || 'Not specified'}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Account Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {user.donationCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Items Donated
                  </div>
                </div>
                
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {user.claimedCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Items Received
                  </div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {user.impactScore || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Impact Score
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Profile Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {user.firstName ? user.firstName[0].toUpperCase() : user.username[0].toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user.username
                  }
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  @{user.username}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Role</span>
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    {getRoleIcon(user.role)}
                    <span className="capitalize">{user.role}</span>
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Badge Level</span>
                  {user.badgeLevel && user.badgeLevel !== 'none' ? (
                    <Badge className={`${getBadgeColor(user.badgeLevel)} text-white`}>
                      <Award className="h-3 w-3 mr-1" />
                      {user.badgeLevel}
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Award className="h-3 w-3 mr-1" />
                      No Badge
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Member Since</span>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  "{getRoleDescription(user.role)}"
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(user.role === 'donor' || user.role === 'ngo') && (
                <Button variant="outline" className="w-full justify-start">
                  <Gift className="h-4 w-4 mr-2" />
                  Add New Donation
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start">
                <Heart className="h-4 w-4 mr-2" />
                Browse Items
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}